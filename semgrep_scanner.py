#!/usr/bin/env python3
"""
Enhanced Security Scanner using Semgrep + OpenAI
Integrates with the existing Node.js security scanner
"""

import json
import subprocess
import sys
import os
from typing import List, Dict, Any
from openai import OpenAI
from pathlib import Path

class SemgrepSecurityScanner:
    def __init__(self, openai_api_key: str = None):
        """Initialize the scanner with OpenAI API key"""
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        if not self.openai_api_key:
            raise ValueError("OpenAI API key required. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.openai_api_key)
        
    def run_semgrep(self, target_path: str = ".") -> Dict[str, Any]:
        """
        Run Semgrep with community ruleset on the target path
        Returns the JSON output from Semgrep
        """
        try:
            print(f"🔍 Running Semgrep scan on {target_path}...")
            
            # Run semgrep with community rules
            cmd = [
                "semgrep", 
                "--config=p/ci",  # Community edition ruleset
                "--json", 
                "--no-git-ignore",  # Include all files
                "--timeout=30",
                target_path
            ]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=60
            )
            
            if result.returncode != 0 and result.returncode != 1:  # 1 is OK (findings found)
                print(f"❌ Semgrep failed with return code {result.returncode}")
                print(f"Error: {result.stderr}")
                return {"results": []}
            
            # Parse JSON output
            try:
                output = json.loads(result.stdout)
                findings_count = len(output.get('results', []))
                print(f"✅ Semgrep scan complete. Found {findings_count} potential issues.")
                return output
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse Semgrep JSON output: {e}")
                return {"results": []}
                
        except subprocess.TimeoutExpired:
            print("❌ Semgrep scan timed out")
            return {"results": []}
        except FileNotFoundError:
            print("❌ Semgrep not found. Install with: pip install semgrep")
            return {"results": []}
        except Exception as e:
            print(f"❌ Unexpected error running Semgrep: {e}")
            return {"results": []}

    def parse_findings(self, semgrep_output: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parse Semgrep output and extract relevant vulnerability details
        """
        findings = []
        
        for result in semgrep_output.get('results', []):
            try:
                # Extract key information
                finding = {
                    'file': result.get('path', 'unknown'),
                    'line': result.get('start', {}).get('line', 0),
                    'end_line': result.get('end', {}).get('line', 0),
                    'rule_id': result.get('check_id', 'unknown_rule'),
                    'severity': result.get('extra', {}).get('severity', 'INFO').upper(),
                    'message': result.get('extra', {}).get('message', result.get('message', '')),
                    'code_snippet': result.get('extra', {}).get('lines', ''),
                    'cwe': self._extract_cwe(result),
                    'owasp': self._extract_owasp(result)
                }
                
                findings.append(finding)
                
            except Exception as e:
                print(f"⚠️ Error parsing finding: {e}")
                continue
        
        print(f"📋 Parsed {len(findings)} findings for analysis")
        return findings

    def _extract_cwe(self, result: Dict[str, Any]) -> str:
        """Extract CWE information from Semgrep result"""
        metadata = result.get('extra', {}).get('metadata', {})
        
        # Check for CWE in various places
        cwe_fields = ['cwe', 'CWE', 'cwe-id']
        for field in cwe_fields:
            if field in metadata:
                cwe_val = metadata[field]
                if isinstance(cwe_val, list) and cwe_val:
                    return f"CWE-{cwe_val[0]}"
                elif isinstance(cwe_val, str):
                    return cwe_val if cwe_val.startswith('CWE-') else f"CWE-{cwe_val}"
        
        # Check in references
        references = metadata.get('references', [])
        for ref in references:
            if 'cwe' in ref.lower():
                return ref
        
        return "CWE-Unknown"

    def _extract_owasp(self, result: Dict[str, Any]) -> str:
        """Extract OWASP category from Semgrep result"""
        metadata = result.get('extra', {}).get('metadata', {})
        
        owasp_fields = ['owasp', 'OWASP', 'owasp-category']
        for field in owasp_fields:
            if field in metadata:
                return str(metadata[field])
        
        # Check in references
        references = metadata.get('references', [])
        for ref in references:
            if 'owasp' in ref.lower():
                return ref
                
        return "OWASP-Unknown"

    def generate_fixes(self, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Send findings to OpenAI GPT for human-readable explanations and secure fixes
        """
        print(f"🤖 Generating AI-powered fixes for {len(findings)} findings...")
        enriched_findings = []
        
        for i, finding in enumerate(findings, 1):
            try:
                print(f"   Processing {i}/{len(findings)}: {finding['rule_id']}")
                
                # Create structured prompt for GPT
                prompt = self._create_gpt_prompt(finding)
                
                # Call OpenAI API
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system", 
                            "content": "You are a security expert. Analyze vulnerabilities and provide clear explanations with secure code fixes. Always respond with valid JSON."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1,
                    max_tokens=1000
                )
                
                # Parse GPT response
                gpt_content = response.choices[0].message.content.strip()
                
                try:
                    # Try to parse as JSON first
                    if gpt_content.startswith('```json'):
                        gpt_content = gpt_content.replace('```json', '').replace('```', '').strip()
                    
                    gpt_response = json.loads(gpt_content)
                    
                    # Create final enriched finding
                    enriched_finding = {
                        "file": finding['file'],
                        "line": finding['line'],
                        "issue": self._normalize_issue_type(finding['rule_id']),
                        "severity": finding['severity'],
                        "rule_id": finding['rule_id'],
                        "cwe": finding['cwe'],  
                        "owasp": finding['owasp'],
                        "description": gpt_response.get('description', finding['message']),
                        "secure_code_fix": gpt_response.get('secure_code_fix', 'No fix provided'),
                        "original_message": finding['message']
                    }
                    
                    enriched_findings.append(enriched_finding)
                    
                except json.JSONDecodeError:
                    # Fallback if GPT doesn't return valid JSON
                    print(f"⚠️ GPT returned invalid JSON for {finding['rule_id']}")
                    enriched_finding = {
                        "file": finding['file'],
                        "line": finding['line'], 
                        "issue": self._normalize_issue_type(finding['rule_id']),
                        "severity": finding['severity'],
                        "rule_id": finding['rule_id'],
                        "cwe": finding['cwe'],
                        "owasp": finding['owasp'],
                        "description": gpt_content[:200] + "..." if len(gpt_content) > 200 else gpt_content,
                        "secure_code_fix": "Please review the code manually for security improvements.",
                        "original_message": finding['message']
                    }
                    enriched_findings.append(enriched_finding)
                
            except Exception as e:
                print(f"⚠️ Error processing finding {finding['rule_id']}: {e}")
                # Add finding without GPT enhancement
                enriched_finding = {
                    "file": finding['file'],
                    "line": finding['line'],
                    "issue": self._normalize_issue_type(finding['rule_id']),
                    "severity": finding['severity'],
                    "rule_id": finding['rule_id'],
                    "cwe": finding['cwe'],
                    "owasp": finding['owasp'],
                    "description": finding['message'],
                    "secure_code_fix": "Manual review required due to processing error.",
                    "original_message": finding['message']
                }
                enriched_findings.append(enriched_finding)
        
        print(f"✅ Generated {len(enriched_findings)} AI-enhanced security findings")
        return enriched_findings

    def _create_gpt_prompt(self, finding: Dict[str, Any]) -> str:
        """Create a structured prompt for GPT analysis"""
        return f"""You are a security assistant. Given this vulnerability, explain it in human terms and provide a secure code fix.

Vulnerability Details:
- File: {finding['file']}
- Line: {finding['line']}
- Rule: {finding['rule_id']}
- Severity: {finding['severity']}
- Message: {finding['message']}
- CWE: {finding['cwe']}
- OWASP: {finding['owasp']}
- Code: {finding['code_snippet'][:200]}

Output JSON with this exact structure:
{{
  "description": "Human-readable explanation of the vulnerability, why it's dangerous, and how it could be exploited",
  "secure_code_fix": "Specific code example or detailed instructions showing how to fix this vulnerability securely"
}}

Make the description educational and the fix actionable. Keep JSON valid."""

    def _normalize_issue_type(self, rule_id: str) -> str:
        """Normalize Semgrep rule ID to a consistent issue type"""
        rule_lower = rule_id.lower()
        
        # Map common Semgrep rules to issue types
        if any(x in rule_lower for x in ['sql', 'injection', 'sqli']):
            return "sql_injection"
        elif any(x in rule_lower for x in ['xss', 'cross-site']):
            return "xss"
        elif any(x in rule_lower for x in ['path', 'traversal', 'directory']):
            return "path_traversal"
        elif any(x in rule_lower for x in ['hardcoded', 'secret', 'password', 'key']):
            return "hardcoded_secrets"
        elif any(x in rule_lower for x in ['eval', 'exec', 'code-injection']):
            return "code_injection"
        elif any(x in rule_lower for x in ['crypto', 'hash', 'md5', 'sha1']):
            return "weak_crypto"
        elif any(x in rule_lower for x in ['csrf', 'forgery']):
            return "csrf"
        elif any(x in rule_lower for x in ['auth', 'authorization', 'access']):
            return "access_control"
        elif any(x in rule_lower for x in ['deserialization', 'pickle']):
            return "deserialization"
        else:
            return rule_id.replace('/', '_').replace('.', '_')

def main():
    """Main orchestration function"""
    print("🛡️ Enhanced Security Scanner (Semgrep + OpenAI)")
    print("=" * 50)
    
    try:
        # Initialize scanner
        scanner = SemgrepSecurityScanner()
        
        # Get target directory (default to current directory)
        target = sys.argv[1] if len(sys.argv) > 1 else "."
        
        # Step 1: Run Semgrep scan
        semgrep_output = scanner.run_semgrep(target)
        
        # Step 2: Parse findings
        findings = scanner.parse_findings(semgrep_output)
        
        if not findings:
            print("🎉 No security issues found!")
            print("[]")
            return
        
        # Step 3: Generate AI-powered fixes
        enriched_findings = scanner.generate_fixes(findings)
        
        # Step 4: Output final JSON
        print("\n" + "=" * 50)
        print("📋 SECURITY SCAN RESULTS")
        print("=" * 50)
        print(json.dumps(enriched_findings, indent=2, ensure_ascii=False))
        
        # Summary
        severity_counts = {}
        for finding in enriched_findings:
            sev = finding['severity']
            severity_counts[sev] = severity_counts.get(sev, 0) + 1
        
        print(f"\n📊 Summary: {len(enriched_findings)} total issues")
        for severity, count in sorted(severity_counts.items()):
            print(f"   {severity}: {count}")
            
    except KeyboardInterrupt:
        print("\n⏹️ Scan interrupted by user")
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
