/* ----------------------------
   Core Types for Security Scanner
   ---------------------------- */

export interface CodeSnippet {
  name: string;
  content: string;
  language: string;
  path: string;
  size?: number;
  isOpen?: boolean;
  isLoading?: boolean;
  isSecure?: boolean;
  message?: string;
}

export interface Vulnerability {
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  file: string;
  startLine?: number;
  endLine?: number;
  fix: string;
  confidence?: number;
}

export interface ScanResult {
  file: string;
  vulnerabilities: Vulnerability[];
}

export interface SemgrepFinding {
  file: string;
  line: number;
  issue: string;
  severity: string;
  rule_id: string;
  cwe: string;
  owasp: string;
  description: string;
  secure_code_fix: string;
  original_message: string;
}

/* ----------------------------
   UI Component Types
   ---------------------------- */

export type RiskLevel = "low" | "medium" | "high" | "" | "error"

export type IsSecureType = {
  isSecure: boolean;
};

export interface VulnerabilityCardContentType {
  riskLevel: RiskLevel | null;
  riskTitle: string;
  riskDescription: string;
}

export interface VulnerabilityCardProps extends VulnerabilityCardContentType {
  setOpenCard?: React.Dispatch<React.SetStateAction<boolean>>;
  codeLanguage?: string;
  correctCode: string;
  vulnerabilityCardLoading: boolean;
  codeFileName?: string;
}


