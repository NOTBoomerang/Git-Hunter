"use server"
import axios from "axios";
import pLimit from "p-limit";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { spawn } from "child_process";
import path from "path";

/**
 * High-ROI defaults (override via env)
 */
const GITHUB_API = process.env.NEXT_GITHUB_API || "https://api.github.com";
const GITHUB_TOKEN = process.env.NEXT_GITHUB_TOKEN || "[MASKED]";
const OPENAI_KEY = process.env.NEXT_OPENAI_API_KEY || "[MASKED]";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "[MASKED]";
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES || 1024 * 1024); // 1MB
const MAX_FILES = Number(process.env.MAX_FILES || 100);
const BATCH_DOWNLOAD_CONCURRENCY = Number(process.env.BATCH_DOWNLOAD_CONCURRENCY || 8); // Increased for faster downloads
const LINES_PER_CHUNK = Number(process.env.LINES_PER_CHUNK || 200);

// Validate environment on server startup
validateEnvironmentOnStartup();

/* ----------------------------
   Import Types from types.d.ts
   ---------------------------- */
import type { 
  CodeSnippet, 
  Vulnerability, 
  ScanResult, 
  VulnerabilityCardContentType, 
  SemgrepFinding 
} from "@/types";
import { validateEnvironmentOnStartup } from "@/lib/env-validation";

/* ----------------------------
   Enhanced Semgrep Integration
   ---------------------------- */
export async function runSemgrepAnalysis(repoPath: string): Promise<SemgrepFinding[]> {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Running enhanced Semgrep analysis on ${repoPath}...`);
    
    // Set up environment variables for the Python script
    const env = {
      ...process.env,
      OPENAI_API_KEY: OPENAI_KEY,
      PYTHONPATH: process.cwd()
    };

    const scriptPath = path.join(process.cwd(), 'semgrep_scanner.py');
    
    // Spawn Python process
    const pythonProcess = spawn('python3', [scriptPath, repoPath], {
      env,
      cwd: process.cwd()
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error(`stderr: ${stderr}`);
        reject(new Error(`Semgrep analysis failed: ${stderr}`));
        return;
      }

      try {
        // Extract JSON from stdout (everything after the last line of dashes)
        const lines = stdout.split('\n');
        let jsonStartIndex = -1;
        
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes('📋 SECURITY SCAN RESULTS') || lines[i].startsWith('[')) {
            jsonStartIndex = lines[i].startsWith('[') ? i : i + 2;
            break;
          }
        }
        
        if (jsonStartIndex === -1) {
          // Look for any JSON array in the output
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('[')) {
              jsonStartIndex = i;
              break;
            }
          }
        }

        if (jsonStartIndex !== -1) {
          const jsonStr = lines.slice(jsonStartIndex).join('\n');
          const findings = JSON.parse(jsonStr);
          console.log(`✅ Parsed ${findings.length} Semgrep findings`);
          resolve(findings);
        } else {
          console.log('No JSON findings found in output');
          resolve([]);
        }
      } catch (error) {
        console.error('Failed to parse Semgrep output:', error);
        console.log('Raw output:', stdout);
        resolve([]);
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(error);
    });

    // Set timeout
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Semgrep analysis timed out'));
    }, 120000); // 2 minutes timeout
  });
}

/* ----------------------------
   Pure AI-Powered Security Analysis (No Hardcoded Patterns)
   ---------------------------- */

async function analyzeCodeWithAI(snippet: CodeSnippet): Promise<Vulnerability[]> {
  if (!OPENAI_KEY) {
    throw new Error("OpenAI API key not configured. Please set NEXT_OPENAI_API_KEY in your environment variables to enable AI-powered security analysis.");
  }

  console.log(`🤖 Running pure AI security analysis on ${snippet.name}`);
  
  const model = new ChatOpenAI({
    model: OPENAI_MODEL,
    temperature: 0,
    openAIApiKey: OPENAI_KEY,
  });

  const enhancedSecurityPrompt = `You are an elite cybersecurity expert with decades of experience in vulnerability research and code auditing.

MISSION: Perform a comprehensive security analysis of this code with forensic precision.

CODE TO ANALYZE:
File: ${snippet.name}
Language: ${snippet.language}
Size: ${snippet.content.length} characters

\`\`\`${snippet.language}
${snippet.content}
\`\`\`

ANALYSIS REQUIREMENTS:
1. Examine EVERY line for security implications
2. Consider data flow and execution paths
3. Identify attack vectors and exploitation scenarios
4. Assess business logic vulnerabilities
5. Evaluate framework-specific security issues

IMPORTANT: Only report vulnerabilities if you are highly confident they exist in the code. Do NOT report issues unless you can clearly identify them in the code. If you are unsure, do NOT report a vulnerability.

VULNERABILITY CATEGORIES TO ASSESS:
🔴 CRITICAL: SQL Injection, Command Injection, Code Injection, Authentication Bypass
🟠 HIGH: XSS, Path Traversal, Hardcoded Secrets, Insecure Deserialization
🟡 MEDIUM: Weak Crypto, CSRF, Information Disclosure, Input Validation

For each vulnerability discovered, provide this EXACT JSON structure:
[
  {
    "severity": "medium|high|critical",
    "title": "Concise vulnerability name (max 50 chars)",
    "description": "Detailed technical explanation: What is the vulnerability? How can it be exploited? What's the impact? Include attack scenarios.",
    "startLine": line_number_where_vulnerability_starts,
    "endLine": line_number_where_vulnerability_ends,
    "fix": "The FULL code with ALL vulnerabilities fixed, not just a generic example. The code should be the original code, but with all issues resolved in-place. If multiple vulnerabilities exist, the fix should show the code with all of them fixed together. Include necessary imports/dependencies if needed.",
    "confidence": confidence_score_0_to_1,
    "cwe": "CWE-XXX (if applicable)",
    "owasp": "OWASP Top 10 category (if applicable)",
    "attack_vector": "How an attacker would exploit this vulnerability",
    "business_impact": "Real-world consequences of successful exploitation"
  }
]

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON array
- If no vulnerabilities found or if the descriptions is no issues found return: []
- NO markdown formatting, NO extra text
- In the 'fix' field, always return the full code with all vulnerabilities fixed, not just a generic example. The code should be updated in-place, not appended as comments at the bottom.
- Be thorough but precise
- Consider both obvious and subtle vulnerabilities
- Look for logic flaws specific to the application context

EXTRA VERIFICATION: Before reporting any vulnerability, use the Semgrep API (static analysis engine) to check if the issue is actually present in the code. Only report vulnerabilities that are confirmed by Semgrep or are extremely obvious in the code. If Semgrep does not confirm the issue, do NOT report it.`;

  try {
    const response = await model.invoke(enhancedSecurityPrompt);
    const aiResponse = response.content as string;
    
    // Clean and parse AI response
    let jsonStr = aiResponse.trim();
    
    // Remove any markdown formatting
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
    }
    
    // Parse the JSON response
    let aiVulnerabilities;
    try {
      aiVulnerabilities = JSON.parse(jsonStr);
    } catch (jsonError) {
      console.error(`JSON parsing failed for ${snippet.name}:`, jsonError);
      console.error(`Raw AI response:`, aiResponse);
      throw new Error(`AI analysis failed: Unable to parse security analysis results for ${snippet.name}`);
    }
    
    // Convert to our internal Vulnerability format
    const vulnerabilities: Vulnerability[] = aiVulnerabilities.map((v: any) => ({
      severity: v.severity === 'critical' ? 'high' : (v.severity || "medium") as "medium" | "high",
      title: v.title || "Security Issue Detected",
      description: v.description || "AI identified a potential security vulnerability",
      file: snippet.name,
      startLine: v.startLine || 1,
      endLine: v.endLine || v.startLine || 1,
      fix: v.fix || "Review code for security improvements",
      confidence: v.confidence || 0.85
    }));
    
    console.log(`✅ AI analysis complete: ${vulnerabilities.length} vulnerabilities found in ${snippet.name}`);
    
    // Log detailed results for debugging
    if (vulnerabilities.length > 0) {
      console.log(`🔍 Vulnerabilities in ${snippet.name}:`, vulnerabilities.map(v => v.title));
    }
    
    return vulnerabilities;
    
  } catch (error: any) {
    console.error(`❌ Failed to analyze ${snippet.name}:`, error);
    
    // Handle specific OpenAI API errors
    if (error?.message?.includes('rate limit')) {
      throw new Error(`Rate limit exceeded. Please wait a moment and try again.`);
    } else if (error?.message?.includes('insufficient_quota')) {
      throw new Error(`OpenAI quota exceeded. Please check your OpenAI billing and usage limits.`);
    } else if (error?.message?.includes('invalid_api_key')) {
      throw new Error(`Invalid OpenAI API key. Please check your NEXT_OPENAI_API_KEY environment variable.`);
    } else if (error?.message?.includes('model_not_found')) {
      throw new Error(`OpenAI model not found. Please check your model configuration.`);
    } else {
      throw new Error(`AI security analysis failed for ${snippet.name}: ${error.message || 'Unknown error occurred'}`);
    }
  }
}

/* ----------------------------
   fetchRepoFiles: uses git/trees for a single recursive listing
   ---------------------------- */
export async function fetchRepoFiles(owner: string, repo: string, branch = "master"): Promise<CodeSnippet[]> {
  if (!GITHUB_TOKEN) {
    throw new Error("GitHub token not configured. Please set NEXT_GITHUB_TOKEN in your environment variables to access GitHub repositories.");
  }

  // Step 1: get the SHA of the branch
  let branchResp;
  try {
    branchResp = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/branches/${branch}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      timeout: 10000,
    });
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404) {
      throw new Error(`Repository '${owner}/${repo}' not found or branch '${branch}' doesn't exist. Please check the repository URL and ensure it's publicly accessible.`);
    } else if (status === 403) {
      throw new Error(`Access denied to repository '${owner}/${repo}'. Please check your GitHub token permissions or ensure the repository is public.`);
    } else if (status === 401) {
      throw new Error(`GitHub authentication failed. Please check your NEXT_GITHUB_TOKEN environment variable.`);
    } else if (e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED') {
      throw new Error(`Network error: Unable to connect to GitHub. Please check your internet connection.`);
    } else {
      throw new Error(`Failed to fetch repository: ${e.message || 'Unknown error occurred'}`);
    }
  }

  const commitSha = branchResp.data?.commit?.commit?.tree?.sha || branchResp.data?.commit?.sha;
  if (!commitSha) {
    throw new Error("Could not locate branch commit SHA.");
  }

  // Step 2: get a recursive tree (single call)
  let treeResp;
  try {
    treeResp = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${commitSha}?recursive=1`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      timeout: 20000,
    });
  } catch (e: any) {
    if (e.code === 'ECONNABORTED') {
      throw new Error(`Request timeout: The repository is too large or GitHub is responding slowly. Please try again later.`);
    }
    throw new Error(`Failed to fetch repository structure: ${e.message || 'Unknown error occurred'}`);
  }

  const items: any[] = treeResp.data?.tree || [];
  const ALLOWED_EXT = /\.(js|ts|py|java|php|rb|go|rs|jsx|tsx|mjs|cjs|env|config|conf|ini|xml|yaml|yml|json|txt)$/i;
  const IGNORED_PATHS = [/node_modules/, /\.gitignore/, /package-lock\.json/, /^dist\//, /^build\//, /\.DS_Store/];

  const candidates = items
    .filter((it) => it.type === "blob")
    .filter((it) => ALLOWED_EXT.test(it.path) || /\.env$/i.test(it.path) || /config/i.test(it.path))
    .filter((it) => !IGNORED_PATHS.some((r) => r.test(it.path)))
    .slice(0, MAX_FILES);

  // Step 3: download files in limited concurrency
  const limit = pLimit(BATCH_DOWNLOAD_CONCURRENCY);
  const downloads = candidates.map((it) =>
    limit(async (): Promise<CodeSnippet | null> => {
      try {
        if (it.size > MAX_FILE_SIZE) {
          console.warn(`Skipping large file ${it.path} size=${it.size}`);
          return null;
        }
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${it.path}`;
        const resp = await axios.get<string>(rawUrl, { timeout: 15000, responseType: "text", transformResponse: [(v: any) => v] });
        return {
          name: it.path,
          path: it.path,
          content: resp.data,
          language: it.path.split(".").pop()?.toLowerCase() || "txt",
          size: it.size,
        };
      } catch (err: any) {
        console.warn(`Failed to fetch ${it.path}: ${err?.message || err}`);
        return null;
      }
    })
  );

  const results = await Promise.all(downloads);
  const final = results.filter(Boolean) as CodeSnippet[];
  console.log(`Fetched ${final.length} files from ${owner}/${repo}`);
  return final;
}

/* ----------------------------
   chunkFileIntoRanges: split large files into chunks with line numbers
   ---------------------------- */
function chunkFileIntoRanges(snippet: CodeSnippet, linesPerChunk = LINES_PER_CHUNK) {
  const lines = snippet.content.split(/\r?\n/);
  const chunks: { text: string; startLine: number; endLine: number; file: string }[] = [];
  for (let i = 0; i < lines.length; i += linesPerChunk) {
    const start = i + 1;
    const end = Math.min(i + linesPerChunk, lines.length);
    const text = lines.slice(i, end).join("\n");
    chunks.push({ text, startLine: start, endLine: end, file: snippet.name });
  }
  return chunks;
}

/* ----------------------------
   AI-Powered Security Scan (replaces basic regex patterns)
   ---------------------------- */
export async function cheapPreScan(snippet: CodeSnippet): Promise<Vulnerability[]> {
  console.log(`🔍 Starting security analysis for ${snippet.name}...`);
  
  // Try AI-powered analysis first, fallback to pattern-based if it fails
  try {
    console.log(`🤖 Attempting AI security analysis...`);
    return await analyzeCodeWithAI(snippet);
  } catch (aiError: any) {
    console.warn(`⚠️ AI analysis failed for ${snippet.name}: ${aiError.message}`);
    console.log(`🔍 Falling back to pattern-based security analysis...`);
    return await fallbackPatternAnalysis(snippet);
  }
}

/* ----------------------------
   Fallback Pattern-Based Security Analysis
   Used when AI analysis is not available
   ---------------------------- */

async function fallbackPatternAnalysis(snippet: CodeSnippet): Promise<Vulnerability[]> {
  console.log(`🔍 Running pattern-based security analysis on ${snippet.name}`);
  const vulnerabilities: Vulnerability[] = [];
  const content = snippet.content.toLowerCase();
  const lines = snippet.content.split(/\r?\n/);

  // SQL Injection patterns
  const sqlInjectionPatterns = [
    /\$\{[^}]*\}/g, // Template literals in SQL
    /["'][^"']*\+[^"']*["']/g, // String concatenation
    /query\s*\+\s*["']/gi, // Query concatenation
    /execute\s*\([^)]*\+/gi, // Execute with concatenation
    /SELECT\s+.*\+/gi, // SELECT with concatenation
    /INSERT\s+.*\+/gi, // INSERT with concatenation
    /UPDATE\s+.*\+/gi, // UPDATE with concatenation
    /DELETE\s+.*\+/gi, // DELETE with concatenation
  ];

  // XSS patterns
  const xssPatterns = [
    /innerHTML\s*=\s*[^"']*\+/gi, // innerHTML with concatenation
    /document\.write\s*\([^)]*\+/gi, // document.write with concatenation
    /\.html\s*\([^)]*\+/gi, // .html() with concatenation
    /eval\s*\(/gi, // eval() usage
    /setTimeout\s*\(["'][^"']*\+/gi, // setTimeout with string concat
    /setInterval\s*\(["'][^"']*\+/gi, // setInterval with string concat
  ];

  // Command Injection patterns
  const commandInjectionPatterns = [
    /exec\s*\([^)]*\+/gi, // exec with concatenation
    /spawn\s*\([^)]*\+/gi, // spawn with concatenation
    /system\s*\([^)]*\+/gi, // system with concatenation
    /shell_exec\s*\([^)]*\+/gi, // shell_exec with concatenation
    /passthru\s*\([^)]*\+/gi, // passthru with concatenation
  ];

  // ...existing code...

  // Path Traversal patterns
  const pathTraversalPatterns = [
    /\.\.\/|\.\.\\/g, // Directory traversal
    /\$_GET\[.*\].*file/gi, // PHP file inclusion
    /\$_POST\[.*\].*file/gi, // PHP file inclusion
    /include\s*\([^)]*\$_/gi, // PHP include with user input
    /require\s*\([^)]*\$_/gi, // PHP require with user input
    /readFile\s*\([^)]*\+/gi, // File read with concatenation
  ];

  // Weak crypto patterns
  const weakCryptoPatterns = [
    /md5\s*\(/gi, // MD5 usage
    /sha1\s*\(/gi, // SHA1 usage
    /base64_encode\s*\(/gi, // Base64 encoding (not encryption)
    /DES|3DES|RC4/gi, // Weak encryption algorithms
  ];

  // Check SQL Injection
  for (const pattern of sqlInjectionPatterns) {
    const matches = snippet.content.match(pattern);
    if (matches) {
      vulnerabilities.push({
        severity: "high",
        title: "Potential SQL Injection",
        description: `SQL injection vulnerability detected. The code appears to concatenate user input directly into SQL queries. Found pattern: ${matches[0]}. This could allow attackers to manipulate database queries and access sensitive data.`,
        file: snippet.name,
        startLine: findLineNumber(lines, matches[0]),
        endLine: findLineNumber(lines, matches[0]),
        fix: "Use parameterized queries or prepared statements instead of string concatenation. Example: db.query('SELECT * FROM users WHERE id = ?', [userId]);",
        confidence: 0.8
      });
    }
  }

  // Check XSS
  for (const pattern of xssPatterns) {
    const matches = snippet.content.match(pattern);
    if (matches) {
      vulnerabilities.push({
        severity: "high",
        title: "Potential Cross-Site Scripting (XSS)",
        description: `XSS vulnerability detected. The code appears to insert user data directly into HTML without proper sanitization. Found pattern: ${matches[0]}. This could allow attackers to execute malicious scripts in users' browsers.`,
        file: snippet.name,
        startLine: findLineNumber(lines, matches[0]),
        endLine: findLineNumber(lines, matches[0]),
        fix: "Always sanitize user input before inserting into HTML. Use proper encoding functions or libraries like DOMPurify for HTML sanitization.",
        confidence: 0.8
      });
    }
  }

  // Check Command Injection
  for (const pattern of commandInjectionPatterns) {
    const matches = snippet.content.match(pattern);
    if (matches) {
      vulnerabilities.push({
        severity: "high",
        title: "Potential Command Injection",
        description: `Command injection vulnerability detected. The code appears to execute system commands with user input. Found pattern: ${matches[0]}. This could allow attackers to execute arbitrary commands on the server.`,
        file: snippet.name,
        startLine: findLineNumber(lines, matches[0]),
        endLine: findLineNumber(lines, matches[0]),
        fix: "Avoid executing system commands with user input. If necessary, use whitelisting and proper input validation. Consider using safer alternatives or libraries.",
        confidence: 0.9
      });
    }
  }

  // ...existing code...

  // Check Path Traversal
  for (const pattern of pathTraversalPatterns) {
    const matches = snippet.content.match(pattern);
    if (matches) {
      vulnerabilities.push({
        severity: "medium",
        title: "Potential Path Traversal",
        description: `Path traversal vulnerability detected. The code may allow access to files outside the intended directory. Found pattern: ${matches[0]}. This could lead to unauthorized file access.`,
        file: snippet.name,
        startLine: findLineNumber(lines, matches[0]),
        endLine: findLineNumber(lines, matches[0]),
        fix: "Validate and sanitize all file paths. Use path.resolve() and path.basename() to prevent directory traversal. Implement proper access controls.",
        confidence: 0.7
      });
    }
  }

  // Check Weak Crypto
  for (const pattern of weakCryptoPatterns) {
    const matches = snippet.content.match(pattern);
    if (matches) {
      vulnerabilities.push({
        severity: "medium",
        title: "Weak Cryptographic Algorithm",
        description: `Weak cryptographic algorithm detected: ${matches[0]}. These algorithms are considered insecure and should not be used for security-sensitive operations.`,
        file: snippet.name,
        startLine: findLineNumber(lines, matches[0]),
        endLine: findLineNumber(lines, matches[0]),
        fix: "Use strong cryptographic algorithms like SHA-256, AES, or bcrypt. For password hashing, use bcrypt, scrypt, or Argon2.",
        confidence: 0.9
      });
    }
  }

  console.log(`✅ Pattern-based analysis complete: ${vulnerabilities.length} vulnerabilities found in ${snippet.name}`);
  return vulnerabilities;
}

// Helper function to find line number of a pattern match
function findLineNumber(lines: string[], pattern: string): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern.substring(0, 20))) {
      return i + 1;
    }
  }
  return 1;
}

/* ----------------------------
   Intelligent Dual-Engine Security Analysis (AI + Semgrep)
   No hardcoded patterns - Pure AI intelligence
   ---------------------------- */
export async function scanRepoFiles(snippets: CodeSnippet[], useEnhancedScan: boolean = true): Promise<ScanResult[]> {
  if (!OPENAI_KEY) {
    throw new Error("🚨 OpenAI API key required for security analysis. This scanner relies on AI intelligence, not hardcoded patterns.");
  }

  const startTime = Date.now();
  console.log(`🚀 OPTIMIZED: Starting performance-tuned security analysis of ${snippets.length} files...`);

  console.log(`�️ Starting intelligent security analysis of ${snippets.length} files...`);
  console.log(`🔧 Analysis engines: ${useEnhancedScan ? 'AI + Semgrep (Enhanced)' : 'AI Only'}`);

  // Quick pre-filter for obviously safe files to improve performance
  const relevantFiles = snippets.filter(s => {
    // Skip documentation and non-code files
  if (/\.(txt|json|lock|gitignore|png|jpg|svg|ico|gif|woff|ttf|eot|pdf|log|xml|yml|yaml|csv|dat)$/i.test(s.name)) return false;
    
    // Skip specific non-security files
    if (/^(readme|license|changelog|contributing|code_of_conduct|package-lock|yarn\.lock|gemfile\.lock)/i.test(s.name)) return false;
    
    // Skip oversized files (likely minified or binary)
    if (s.size && s.size > MAX_FILE_SIZE) return false;
    
    // Only include actual code files that need security analysis
    const codeFilePattern = /\.(js|ts|jsx|tsx|py|java|php|rb|go|rs|c|cpp|cs|scala|kt|swift|dart|sh|bash|zsh|ps1|sql|pl|r|m|mm|h|hpp|cc|cxx)$/i;
    return codeFilePattern.test(s.name);
  });

  console.log(`📊 Filtered to ${relevantFiles.length} relevant files for analysis`);

  // Smart Semgrep usage - skip for very large repositories to save time
  const shouldUseSemgrep = useEnhancedScan && relevantFiles.length <= 25;
  if (useEnhancedScan && !shouldUseSemgrep) {
    console.log(`⚡ Skipping Semgrep for large repository (${relevantFiles.length} files) - using AI-only for speed`);
  }

  // PARALLEL EXECUTION: Run both analyses simultaneously
  const analysisPromises = [];

  // 1. Optimized AI Analysis (always runs)
  console.log(`🤖 Starting optimized batch AI analysis...`);
  const aiAnalysisPromise = analyzeAllFilesWithAI(relevantFiles);
  analysisPromises.push(aiAnalysisPromise);

  // 2. Smart Semgrep Analysis (only for smaller repositories)
  let semgrepPromise: Promise<SemgrepFinding[]> = Promise.resolve([]);
  if (shouldUseSemgrep) {
    console.log(`⚡ Starting parallel Semgrep analysis on ${relevantFiles.length} files...`);
    semgrepPromise = runFullSemgrepAnalysis(relevantFiles);
    analysisPromises.push(semgrepPromise);
  }

  // Wait for both analyses to complete
  const [aiResults, semgrepFindings] = await Promise.all([
    aiAnalysisPromise,
    semgrepPromise
  ]);

  // INTELLIGENT MERGE: Combine results with deduplication
  const finalResults = mergeIntelligentFindings(aiResults, semgrepFindings);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ OPTIMIZED: Analysis complete in ${elapsed}s`);
  console.log(`📊 Results: AI found ${aiResults.length} files, Semgrep found ${semgrepFindings.length} findings`);
  console.log(`🎯 Final: ${finalResults.length} files with security issues identified`);
  
  return finalResults;
}

/* ----------------------------
   PERFORMANCE OPTIMIZED AI Analysis - Batch Processing
   ---------------------------- */
async function analyzeAllFilesWithAI(snippets: CodeSnippet[]): Promise<ScanResult[]> {
  // Smart pre-filtering for performance
  const criticalFiles = filterCriticalFiles(snippets);
  
  console.log(`🚀 OPTIMIZED: Analyzing ${criticalFiles.length}/${snippets.length} critical files`);
  
  if (criticalFiles.length === 0) {
    console.log("✅ No critical files found for AI analysis");
    return [];
  }

  // Batch files for more efficient API usage
  return await batchAnalyzeWithAI(criticalFiles);
}

/* ----------------------------
   Smart File Filtering - Skip non-security-relevant files
   ---------------------------- */
function filterCriticalFiles(snippets: CodeSnippet[]): CodeSnippet[] {
  const SKIP_FILES = /\.(txt|json|lock|png|jpg|gif|ico|svg|woff|ttf|eot|pdf|zip|tar|gz|log|bak|tmp|xml|yml|yaml|csv|dat)$/i;
  const PRIORITY_FILES = /\.(js|ts|py|php|java|rb|go|jsx|tsx|vue|swift|kt|scala|cs|cpp|c|h|sql|sh)$/i;
  
  return snippets.filter(snippet => {
    // Skip obviously safe files
    if (SKIP_FILES.test(snippet.name)) return false;
    
    // Skip huge files (likely to be minified or generated)
    if (snippet.size && snippet.size > 100000) return false;
    
    // Skip tiny files unless they're priority types
    if (snippet.size && snippet.size < 50 && !PRIORITY_FILES.test(snippet.name)) return false;
    
    // Include if it's a priority file type
    if (PRIORITY_FILES.test(snippet.name)) return true;
    
    // Include if content suggests security relevance
    const securityKeywords = ['password', 'secret', 'key', 'token', 'auth', 'eval(', 'exec(', 'SELECT ', 'INSERT ', 'DELETE ', 'UPDATE '];
    const hasSecurityKeywords = securityKeywords.some(keyword => 
      snippet.content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return hasSecurityKeywords;
  });
}

/* ----------------------------
   Batch AI Analysis - Multiple files per API call
   ---------------------------- */
async function batchAnalyzeWithAI(snippets: CodeSnippet[]): Promise<ScanResult[]> {
  const BATCH_SIZE = 3; // Analyze 3 files per AI call for efficiency
  const batches: CodeSnippet[][] = [];
  
  // Create batches of files
  for (let i = 0; i < snippets.length; i += BATCH_SIZE) {
    batches.push(snippets.slice(i, i + BATCH_SIZE));
  }

  console.log(`🔄 Processing ${batches.length} batches (${BATCH_SIZE} files each)`);

  // Process batches with reduced concurrency for stability
  const limit = pLimit(2); // Reduced for better performance and rate limit compliance
  const allResults: ScanResult[] = [];

  const batchPromises = batches.map((batch, batchIndex) =>
    limit(async () => {
      try {
        console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length}`);
        const batchResults = await analyzeBatchWithAI(batch);
        return batchResults;
      } catch (error) {
        console.error(`❌ Batch ${batchIndex + 1} analysis failed:`, error);
        return [];
      }
    })
  );

  const allBatchResults = await Promise.all(batchPromises);
  return allBatchResults.flat();
}

/* ----------------------------
   Single Batch AI Analysis - Analyzes multiple files in one API call
   ---------------------------- */
async function analyzeBatchWithAI(batch: CodeSnippet[]): Promise<ScanResult[]> {
  if (!OPENAI_KEY) return [];

  const model = new ChatOpenAI({
    model: OPENAI_MODEL,
    temperature: 0,
    openAIApiKey: OPENAI_KEY,
  });

  // Create combined prompt for multiple files
  const filesContent = batch.map((snippet, idx) => 
    `FILE_${idx + 1}: ${snippet.name}
Language: ${snippet.language}
\`\`\`${snippet.language}
${snippet.content.slice(0, 8000)} ${snippet.content.length > 8000 ? '... (truncated)' : ''}
\`\`\`
`).join('\n' + '='.repeat(50) + '\n');

  const batchPrompt = `You are an elite cybersecurity expert. Analyze these ${batch.length} files for security vulnerabilities.

For each file that has vulnerabilities, return them in this EXACT JSON structure:
{
  "results": {
    "${batch[0].name}": [
      {
        "severity": "low|medium|high",
        "title": "Vulnerability name (max 50 chars)",
        "description": "Detailed explanation of the vulnerability and how it can be exploited",
        "startLine": line_number,
        "endLine": line_number,
        "fix": "Complete secure code example or detailed fix instructions",
        "confidence": confidence_score_0_to_1
      }
    ],
    "${batch[1]?.name || 'file2.ext'}": [],
    "${batch[2]?.name || 'file3.ext'}": []
  }
}

CRITICAL: 
- Return ONLY the JSON object, no extra text
- If a file has no vulnerabilities, use empty array []
- Focus on: SQL Injection, XSS, Command Injection, Hardcoded Secrets, Path Traversal, Code Injection, Weak Crypto

FILES TO ANALYZE:
${filesContent}`;

  try {
    const response = await model.invoke(batchPrompt);
    const aiResponse = response.content as string;
    
    // Clean and parse AI response
    let jsonStr = aiResponse.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
    }
    
    const batchResults = JSON.parse(jsonStr);
    const scanResults: ScanResult[] = [];
    
    // Convert batch results to ScanResult format
    const results = batchResults.results || batchResults;
    for (const [fileName, vulnerabilities] of Object.entries(results)) {
      if (Array.isArray(vulnerabilities) && vulnerabilities.length > 0) {
        const formattedVulns = vulnerabilities.map((v: any) => ({
          severity: v.severity === 'critical' ? 'high' : (v.severity || "medium") as "low" | "medium" | "high",
          title: v.title || "Security Issue Detected",
          description: v.description || "AI identified a potential security vulnerability",
          file: fileName,
          startLine: v.startLine || 1,
          endLine: v.endLine || v.startLine || 1,
          fix: v.fix || "Review code for security improvements",
          confidence: v.confidence || 0.85
        }));
        
        scanResults.push({
          file: fileName,
          vulnerabilities: formattedVulns
        });
      }
    }
    
    console.log(`✅ Batch analysis: ${scanResults.length} files with vulnerabilities found`);
    return scanResults;
    
  } catch (error) {
    console.error(`❌ Batch AI analysis failed:`, error);
    // Fallback to individual analysis if batch fails
    console.log(`🔄 Falling back to individual file analysis for batch`);
    return await fallbackIndividualAnalysis(batch);
  }
}

/* ----------------------------
   Fallback Individual Analysis - Used when batch analysis fails
   ---------------------------- */
async function fallbackIndividualAnalysis(batch: CodeSnippet[]): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  
  for (const snippet of batch) {
    try {
      const vulnerabilities = await analyzeCodeWithAI(snippet);
      if (vulnerabilities.length > 0) {
        results.push({ file: snippet.name, vulnerabilities });
      }
    } catch (error) {
      console.error(`❌ Individual analysis failed for ${snippet.name}:`, error);
    }
  }
  
  return results;
}

/* ----------------------------
   Semgrep Analysis Engine - Professional static analysis
   ---------------------------- */
async function runFullSemgrepAnalysis(snippets: CodeSnippet[]): Promise<SemgrepFinding[]> {
  try {
    // Create temporary directory with all repository files
    const tempDir = await createTempRepoDir(snippets);
    
    // Run comprehensive Semgrep analysis
    const semgrepFindings = await runSemgrepAnalysis(tempDir);
    
    console.log(`🔍 Semgrep analysis complete: ${semgrepFindings.length} findings`);
    return semgrepFindings;
    
  } catch (error) {
    console.error(`❌ Semgrep analysis failed:`, error);
    throw error; // No fallback - fail fast
  }
}

/* ----------------------------
   Intelligent Results Merger - Combines AI + Semgrep with smart deduplication
   ---------------------------- */
function mergeIntelligentFindings(aiResults: ScanResult[], semgrepFindings: SemgrepFinding[]): ScanResult[] {
  const mergedResults = new Map<string, ScanResult>();

  // Add all AI findings first
  for (const result of aiResults) {
    mergedResults.set(result.file, result);
  }

  // Integrate Semgrep findings
  for (const semgrepFinding of semgrepFindings) {
    // Find matching file
    const fileName = semgrepFinding.file.split('/').pop() || semgrepFinding.file;
    const matchingFile = Array.from(mergedResults.keys()).find(key => 
      key.endsWith(fileName) || key === semgrepFinding.file
    ) || fileName;

    // Convert Semgrep finding to Vulnerability format
    const semgrepVuln: Vulnerability = {
      severity: mapSemgrepSeverity(semgrepFinding.severity),
      title: formatSemgrepTitle(semgrepFinding.issue),
      description: semgrepFinding.description,
      file: matchingFile,
      startLine: semgrepFinding.line,
      endLine: semgrepFinding.line,
      fix: semgrepFinding.secure_code_fix,
      confidence: 0.95 // Semgrep has high confidence
    };

    // Add or merge with existing results
    if (mergedResults.has(matchingFile)) {
      const existing = mergedResults.get(matchingFile)!;
      
      // Check for duplicates (same vulnerability type and line)
      const isDuplicate = existing.vulnerabilities.some(v => 
        v.title === semgrepVuln.title && 
        Math.abs((v.startLine || 0) - (semgrepVuln.startLine || 0)) <= 2
      );

      if (!isDuplicate) {
        existing.vulnerabilities.push(semgrepVuln);
      }
    } else {
      mergedResults.set(matchingFile, {
        file: matchingFile,
        vulnerabilities: [semgrepVuln]
      });
    }
  }

  return Array.from(mergedResults.values());
}


function mapSemgrepSeverity(severity: string): "low" | "medium" | "high" {
  const severityMap: Record<string, "low" | "medium" | "high"> = {
    'ERROR': 'high',
    'WARNING': 'medium', 
    'INFO': 'low',
    'HIGH': 'high',
    'MEDIUM': 'medium',
    'LOW': 'low'
  };
  return severityMap[severity.toUpperCase()] || 'medium';
}

function formatSemgrepTitle(issue: string): string {
  return issue
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}


async function createTempRepoDir(snippets: CodeSnippet[]): Promise<string> {
  const fs = await import('fs/promises');
  const os = await import('os');
  const path = await import('path');
  
  
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'semgrep-scan-'));
  
  
  for (const snippet of snippets) {
    const filePath = path.join(tempDir, snippet.name);
    const dirPath = path.dirname(filePath);
    
    
    await fs.mkdir(dirPath, { recursive: true });
    
    
    await fs.writeFile(filePath, snippet.content, 'utf8');
  }
  
  console.log(`📁 Created temporary repository at ${tempDir}`);
  return tempDir;
}


export async function debugEnvironment() {
  return {
    hasGithubToken: !!GITHUB_TOKEN,
    hasOpenAiKey: !!OPENAI_KEY,
    githubApi: GITHUB_API,
    openaiModel: OPENAI_MODEL,
  githubTokenPreview: GITHUB_TOKEN ? "[MASKED]" : "Not set",
  openaiKeyPreview: OPENAI_KEY ? "[MASKED]" : "Not set"
  };
}


export async function checkCodeSecurity(code: string): Promise<{ 
  isSecure: boolean; 
  vulnerabilities: Vulnerability[] 
}> {
  const snippet: CodeSnippet = {
    name: "input.js",
    path: "input.js",
    content: code,
    language: "javascript",
    size: code.length
  };
  
  const vulnerabilities = await cheapPreScan(snippet);
  return {
    isSecure: vulnerabilities.length === 0,
    vulnerabilities
  };
}

export async function scanVulnerability(code: string): Promise<VulnerabilityCardContentType & { correctCode: string }> {
  console.log("🔍 scanVulnerability called with code length:", code.length);
  console.log("🔑 Environment check - OPENAI_KEY exists:", !!OPENAI_KEY);
  console.log("🔑 Environment check - GITHUB_TOKEN exists:", !!GITHUB_TOKEN);
  
  const snippet: CodeSnippet = {
    name: "temp.js",
    path: "temp.js", 
    content: code,
    language: "javascript",
    size: code.length
  };
  
  const vulnerabilities = await cheapPreScan(snippet);
  console.log("📋 Found vulnerabilities:", vulnerabilities.length);
  
  if (vulnerabilities.length === 0) {
    return {
      riskLevel: "low",
      riskTitle: "No Issues Found", 
      riskDescription: "The code appears to be secure based on our analysis.",
      correctCode: code
    };
  }
  
  const highestSeverity = vulnerabilities.reduce((highest, curr) => {
    const severityOrder = { low: 1, medium: 2, high: 3 };
    return severityOrder[curr.severity] > severityOrder[highest.severity] ? curr : highest;
  });
  

  const secureCodeFix = generateSecureCodeFix(code, highestSeverity);
  
  return {
    riskLevel: highestSeverity.severity,
    riskTitle: highestSeverity.title,
    riskDescription: getDetailedDescription(highestSeverity, code),
    correctCode: secureCodeFix
  };
}

function getDetailedDescription(vulnerability: Vulnerability, originalCode: string): string {
  const descriptions: Record<string, string> = {
    "hardcoded_secrets": `This code contains hardcoded sensitive information (API keys, passwords, tokens, or secrets) directly in the source code. This is a critical security vulnerability because:

• Secrets are visible to anyone with access to the code
• Version control systems store these secrets permanently  
• Deployed applications expose secrets in plain text
• Attackers can extract and misuse these credentials

The detected pattern suggests sensitive data is embedded directly in the code rather than being loaded from secure environment variables or a secrets management system.`,

    "sql_string_interp": `This code uses string interpolation to build SQL queries, making it vulnerable to SQL injection attacks. This occurs when user input is directly concatenated into SQL statements without proper sanitization:

• Attackers can inject malicious SQL code through input parameters
• Database contents can be read, modified, or deleted
• Administrative access to the database may be compromised
• Application logic can be bypassed

The vulnerability allows attackers to manipulate the SQL query structure by providing specially crafted input values.`,

    "eval_os_system": `This code uses dynamic code execution functions (eval, system, exec) which can lead to remote code execution vulnerabilities:

• Attackers can execute arbitrary code on the server
• System commands can be injected and executed
• Full system compromise is possible
• Application sandbox can be escaped

These functions should never process untrusted input as they interpret and execute the input as code or system commands.`,

    "weak_hash": `This code uses cryptographically weak hashing algorithms (MD5, SHA1) that are vulnerable to collision attacks and rainbow table lookups:

• MD5 and SHA1 are considered broken for security purposes
• Modern hardware can compute billions of hashes per second
• Precomputed hash tables (rainbow tables) exist for common inputs
• Collisions can be generated with reasonable computational effort

For security-sensitive applications, use stronger algorithms like SHA-256, SHA-3, or bcrypt for password hashing.`,

    "path_traversal": `This code appears to be vulnerable to path traversal attacks, where attackers can access files outside the intended directory:

• Users can provide paths with "../" sequences to navigate up directories
• Sensitive system files may be accessible
• Application configuration files could be exposed
• The vulnerability can lead to information disclosure or code execution

File operations should validate and sanitize all path inputs to prevent directory traversal.

If no issues are found return []`
  };

  return descriptions[vulnerability.title] || vulnerability.description;
}

function generateSecureCodeFix(originalCode: string, vulnerability: Vulnerability): string {
  const fixes: Record<string, (code: string) => string> = {
    "hardcoded_secrets": (code: string) => {
      let fixedCode = code;
      
      const patterns = [
        { pattern: /(API_KEY|SECRET|PASSWORD|TOKEN)\s*[:=]\s*["']([^"']+)["']/gi, 
          replacement: '$1 = process.env.$1 || ""' },
        { pattern: /apiKey\s*[:=]\s*["']([^"']+)["']/gi, 
          replacement: 'apiKey = process.env.API_KEY || ""' },
        { pattern: /password\s*[:=]\s*["']([^"']+)["']/gi, 
          replacement: 'password = process.env.PASSWORD || ""' }
      ];
      
      patterns.forEach(({ pattern, replacement }) => {
        fixedCode = fixedCode.replace(pattern, replacement);
      });
      
      if (!fixedCode.includes('require("dotenv")') && !fixedCode.includes('import dotenv')) {
        fixedCode = 'require("dotenv").config();\n\n' + fixedCode;
      }
      
      return `// ✅ Secure version - uses environment variables
${fixedCode}

// Add to your .env file:
// API_KEY=your_actual_api_key_here
// PASSWORD=your_actual_password_here`;
    },

    "sql_string_interp": (code: string) => {
      let fixedCode = code;
      fixedCode = fixedCode.replace(
        /SELECT.*FROM.*WHERE.*\$\{.*\}/gi,
        'SELECT * FROM users WHERE id = ?'
      );
      
      return `// ✅ Secure version - uses parameterized queries
${fixedCode}

// Example with proper parameterization:
// const query = 'SELECT * FROM users WHERE id = ? AND name = ?';
// const results = await db.query(query, [userId, userName]);`;
    },

    "eval_os_system": (code: string) => {
      let fixedCode = code;
      fixedCode = fixedCode.replace(/eval\s*\([^)]+\)/gi, '// eval() removed - use safer alternatives');
      fixedCode = fixedCode.replace(/os\.system\s*\([^)]+\)/gi, '// os.system() removed - use subprocess with validation');
      fixedCode = fixedCode.replace(/system\s*\([^)]+\)/gi, '// system() removed - use safer alternatives');
      
      return `// ✅ Secure version - removes dynamic code execution
${fixedCode}

// Safe alternatives:
// - Instead of eval(): use JSON.parse() for data, or a proper parser
// - Instead of system(): use child_process.spawn() with input validation`;
    },

    "weak_hash": (code: string) => {
      let fixedCode = code;
      fixedCode = fixedCode.replace(/md5\s*\(/gi, 'crypto.createHash("sha256")');
      fixedCode = fixedCode.replace(/sha1\s*\(/gi, 'crypto.createHash("sha256")');
      
      return `// ✅ Secure version - uses strong hashing
const crypto = require('crypto');
${fixedCode}

// For password hashing, use bcrypt:
// const bcrypt = require('bcrypt');
// const hashedPassword = await bcrypt.hash(password, 12);`;
    },

    "path_traversal": (code: string) => {
      let fixedCode = code;
      fixedCode = fixedCode.replace(
        /(open\s*\(|fs\.readFileSync\s*\(|readFile\s*\()[^,)]+/gi,
        '$1path.resolve(SAFE_DIR, path.basename(filename))'
      );
      
      return `// ✅ Secure version - validates file paths
const path = require('path');
const SAFE_DIR = '/safe/directory';

${fixedCode}

// Additional security measures:
// - Use path.resolve() and path.basename() to sanitize paths  
// - Define an allowed directory and never go outside it`;
    }
  };

  const fixFunction = fixes[vulnerability.title];
  if (fixFunction) {
    return fixFunction(originalCode);
  }
  
  return `// ✅ Secure version
${originalCode}

// General security recommendations:
// - Validate and sanitize all inputs
// - Use environment variables for secrets
// - Apply principle of least privilege`;
}

/* ----------------------------
   Enhanced repository scanning with Semgrep
   ---------------------------- */
export async function scanRepository(owner: string, repo: string): Promise<ScanResult[]> {
  const files = await fetchRepoFiles(owner, repo);
  return await scanRepoFiles(files, true); // Enable enhanced scanning
}

/* ----------------------------
   Example server handler usage (Next.js / Express)
   ---------------------------- */
export async function handleScanRequest(req: any, res: any) {
  try {
    const { owner, repo, branch, enhanced = true } = req.body || req.query;
    if (!owner || !repo) return res.status(400).json({ error: "owner & repo required" });

    const files = await fetchRepoFiles(owner, repo, branch || "main");
    if (!files.length) return res.status(200).json({ results: [] });

    const results = await scanRepoFiles(files, enhanced);
    return res.status(200).json({ 
      results, 
      scannedFiles: files.length,
      enhancedScanEnabled: enhanced && !!OPENAI_KEY
    });
  } catch (err: any) {
    console.error("scan error:", err?.message || err);
    return res.status(500).json({ error: err?.message || "scan failed" });
  }
}
