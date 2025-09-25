module.exports = {

"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/node:fs [external] (node:fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}}),
"[externals]/node:stream [external] (node:stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[externals]/child_process [external] (child_process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}}),
"[project]/src/app/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"008664ea3258e58a551eda3d9cf841ad4891efff1d":"debugEnvironment","40168f14f5cd1ca63582a4423880f230575c4a3cae":"runSemgrepAnalysis","40347afb77295f1eaeb69af5c659c9a54cac5b9bcf":"checkCodeSecurity","40d4d0d90f9d762d679ef2fb47a9e99b50374447c5":"scanVulnerability","40d6c8da0a195ae774261ad30bff337848de60b2b6":"cheapPreScan","60445b9756b179db5fad13de7a32e58aea2087a7b1":"scanRepoFiles","605bdb6d3aeb5fcdcb52c3b3298eefd8d0e826c987":"scanRepository","60ffd660851ac8d0da75b409e3f94752b88393ab2e":"handleScanRequest","70b085b60687018d99411dba45157e04a55b437dd6":"fetchRepoFiles"} */ __turbopack_context__.s({
    "cheapPreScan": (()=>cheapPreScan),
    "checkCodeSecurity": (()=>checkCodeSecurity),
    "debugEnvironment": (()=>debugEnvironment),
    "fetchRepoFiles": (()=>fetchRepoFiles),
    "handleScanRequest": (()=>handleScanRequest),
    "runSemgrepAnalysis": (()=>runSemgrepAnalysis),
    "scanRepoFiles": (()=>scanRepoFiles),
    "scanRepository": (()=>scanRepository),
    "scanVulnerability": (()=>scanVulnerability)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$p$2d$limit$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/p-limit/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/index.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/dist/chat_models.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
/**
 * High-ROI defaults (override via env)
 */ const GITHUB_API = process.env.NEXT_GITHUB_API || "https://api.github.com";
const GITHUB_TOKEN = process.env.NEXT_GITHUB_TOKEN || "";
const OPENAI_KEY = process.env.NEXT_OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES || 1024 * 1024); // 1MB
const MAX_FILES = Number(process.env.MAX_FILES || 100);
const BATCH_DOWNLOAD_CONCURRENCY = Number(process.env.BATCH_DOWNLOAD_CONCURRENCY || 8); // Increased for faster downloads
const LINES_PER_CHUNK = Number(process.env.LINES_PER_CHUNK || 200);
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ runSemgrepAnalysis(repoPath) {
    return new Promise((resolve, reject)=>{
        console.log(`🔍 Running enhanced Semgrep analysis on ${repoPath}...`);
        // Set up environment variables for the Python script
        const env = {
            ...process.env,
            OPENAI_API_KEY: OPENAI_KEY,
            PYTHONPATH: process.cwd()
        };
        const scriptPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'semgrep_scanner.py');
        // Spawn Python process
        const pythonProcess = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])('python3', [
            scriptPath,
            repoPath
        ], {
            env,
            cwd: process.cwd()
        });
        let stdout = '';
        let stderr = '';
        pythonProcess.stdout.on('data', (data)=>{
            stdout += data.toString();
        });
        pythonProcess.stderr.on('data', (data)=>{
            stderr += data.toString();
        });
        pythonProcess.on('close', (code)=>{
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
                for(let i = lines.length - 1; i >= 0; i--){
                    if (lines[i].includes('📋 SECURITY SCAN RESULTS') || lines[i].startsWith('[')) {
                        jsonStartIndex = lines[i].startsWith('[') ? i : i + 2;
                        break;
                    }
                }
                if (jsonStartIndex === -1) {
                    // Look for any JSON array in the output
                    for(let i = 0; i < lines.length; i++){
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
        pythonProcess.on('error', (error)=>{
            console.error('Failed to start Python process:', error);
            reject(error);
        });
        // Set timeout
        setTimeout(()=>{
            pythonProcess.kill();
            reject(new Error('Semgrep analysis timed out'));
        }, 120000); // 2 minutes timeout
    });
}
/* ----------------------------
   Pure AI-Powered Security Analysis (No Hardcoded Patterns)
   ---------------------------- */ async function analyzeCodeWithAI(snippet) {
    if (!OPENAI_KEY) {
        throw new Error("🚨 OpenAI API key required for AI security analysis. Please set NEXT_OPENAI_API_KEY in your environment.");
    }
    console.log(`🤖 Running pure AI security analysis on ${snippet.name}`);
    const model = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatOpenAI"]({
        model: OPENAI_MODEL,
        temperature: 0.1,
        openAIApiKey: OPENAI_KEY
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

VULNERABILITY CATEGORIES TO ASSESS:
🔴 CRITICAL: SQL Injection, Command Injection, Code Injection, Authentication Bypass
🟠 HIGH: XSS, Path Traversal, Hardcoded Secrets, Insecure Deserialization  
🟡 MEDIUM: Weak Crypto, CSRF, Information Disclosure, Input Validation
🟢 LOW: Security Misconfigurations, Best Practice Violations

For each vulnerability discovered, provide this EXACT JSON structure:
[
  {
    "severity": "low|medium|high|critical",
    "title": "Concise vulnerability name (max 50 chars)",
    "description": "Detailed technical explanation: What is the vulnerability? How can it be exploited? What's the impact? Include attack scenarios.",
    "startLine": line_number_where_vulnerability_starts,
    "endLine": line_number_where_vulnerability_ends,
    "fix": "Complete working code example showing the secure implementation. Include imports/dependencies if needed.",
    "confidence": confidence_score_0_to_1,
    "cwe": "CWE-XXX (if applicable)",
    "owasp": "OWASP Top 10 category (if applicable)",
    "attack_vector": "How an attacker would exploit this vulnerability",
    "business_impact": "Real-world consequences of successful exploitation"
  }
]

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON array
- If no vulnerabilities found, return: []
- NO markdown formatting, NO extra text
- Be thorough but precise
- Consider both obvious and subtle vulnerabilities
- Look for logic flaws specific to the application context`;
    try {
        const response = await model.invoke(enhancedSecurityPrompt);
        const aiResponse = response.content;
        // Clean and parse AI response
        let jsonStr = aiResponse.trim();
        // Remove any markdown formatting
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
        }
        // Parse the JSON response
        const aiVulnerabilities = JSON.parse(jsonStr);
        // Convert to our internal Vulnerability format
        const vulnerabilities = aiVulnerabilities.map((v)=>({
                severity: v.severity === 'critical' ? 'high' : v.severity || "medium",
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
            console.log(`🔍 Vulnerabilities in ${snippet.name}:`, vulnerabilities.map((v)=>v.title));
        }
        return vulnerabilities;
    } catch (parseError) {
        console.error(`❌ Failed to parse AI response for ${snippet.name}:`, parseError);
        throw new Error(`AI analysis failed: Invalid response format from OpenAI`);
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ fetchRepoFiles(owner, repo, branch = "main") {
    if (!GITHUB_TOKEN) {
        console.warn("⚠️ NO GITHUB TOKEN — returning demo files (for hackathon).");
        return [
            {
                name: "server.js",
                path: "server.js",
                content: `const express = require('express');\nconst app = express();\nconst password = "hardcoded123";\n// insecure sample...`,
                language: "js",
                size: 512
            }
        ];
    }
    // Step 1: get the SHA of the branch
    const branchResp = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(`${GITHUB_API}/repos/${owner}/${repo}/branches/${branch}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json"
        },
        timeout: 10000
    }).catch((e)=>{
        throw new Error(`Failed to fetch branch ${branch}: ${e?.response?.status || e.message}`);
    });
    const commitSha = branchResp.data?.commit?.commit?.tree?.sha || branchResp.data?.commit?.sha;
    if (!commitSha) {
        throw new Error("Could not locate branch commit SHA.");
    }
    // Step 2: get a recursive tree (single call)
    const treeResp = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${commitSha}?recursive=1`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json"
        },
        timeout: 20000
    });
    const items = treeResp.data?.tree || [];
    const ALLOWED_EXT = /\.(js|ts|py|java|php|rb|go|rs|jsx|tsx|mjs|cjs|env|config|conf|ini|xml|yaml|yml|json|md|txt)$/i;
    const IGNORED_PATHS = [
        /node_modules/,
        /\.gitignore/,
        /package-lock\.json/,
        /^dist\//,
        /^build\//,
        /\.DS_Store/
    ];
    const candidates = items.filter((it)=>it.type === "blob").filter((it)=>ALLOWED_EXT.test(it.path) || /\.env$/i.test(it.path) || /config/i.test(it.path)).filter((it)=>!IGNORED_PATHS.some((r)=>r.test(it.path))).slice(0, MAX_FILES);
    // Step 3: download files in limited concurrency
    const limit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$p$2d$limit$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(BATCH_DOWNLOAD_CONCURRENCY);
    const downloads = candidates.map((it)=>limit(async ()=>{
            try {
                if (it.size > MAX_FILE_SIZE) {
                    console.warn(`Skipping large file ${it.path} size=${it.size}`);
                    return null;
                }
                const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${it.path}`;
                const resp = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(rawUrl, {
                    timeout: 15000,
                    responseType: "text",
                    transformResponse: [
                        (v)=>v
                    ]
                });
                return {
                    name: it.path,
                    path: it.path,
                    content: resp.data,
                    language: it.path.split(".").pop()?.toLowerCase() || "txt",
                    size: it.size
                };
            } catch (err) {
                console.warn(`Failed to fetch ${it.path}: ${err?.message || err}`);
                return null;
            }
        }));
    const results = await Promise.all(downloads);
    const final = results.filter(Boolean);
    console.log(`Fetched ${final.length} files from ${owner}/${repo}`);
    return final;
}
/* ----------------------------
   chunkFileIntoRanges: split large files into chunks with line numbers
   ---------------------------- */ function chunkFileIntoRanges(snippet, linesPerChunk = LINES_PER_CHUNK) {
    const lines = snippet.content.split(/\r?\n/);
    const chunks = [];
    for(let i = 0; i < lines.length; i += linesPerChunk){
        const start = i + 1;
        const end = Math.min(i + linesPerChunk, lines.length);
        const text = lines.slice(i, end).join("\n");
        chunks.push({
            text,
            startLine: start,
            endLine: end,
            file: snippet.name
        });
    }
    return chunks;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ cheapPreScan(snippet) {
    console.log(`🔍 Starting AI security analysis for ${snippet.name}...`);
    // Use AI-powered analysis instead of hardcoded patterns
    return await analyzeCodeWithAI(snippet);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ scanRepoFiles(snippets, useEnhancedScan = true) {
    if (!OPENAI_KEY) {
        throw new Error("🚨 OpenAI API key required for security analysis. This scanner relies on AI intelligence, not hardcoded patterns.");
    }
    const startTime = Date.now();
    console.log(`🚀 OPTIMIZED: Starting performance-tuned security analysis of ${snippets.length} files...`);
    console.log(`�️ Starting intelligent security analysis of ${snippets.length} files...`);
    console.log(`🔧 Analysis engines: ${useEnhancedScan ? 'AI + Semgrep (Enhanced)' : 'AI Only'}`);
    // Quick pre-filter for obviously safe files to improve performance
    const relevantFiles = snippets.filter((s)=>{
        // Skip common non-security files
        if (/\.(md|txt|json|lock|gitignore|png|jpg|svg|ico|gif|woff|ttf|eot|pdf)$/i.test(s.name)) return false;
        // Skip oversized files (likely minified)
        if (s.size && s.size > MAX_FILE_SIZE) return false;
        return true;
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
    let semgrepPromise = Promise.resolve([]);
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
   ---------------------------- */ async function analyzeAllFilesWithAI(snippets) {
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
   ---------------------------- */ function filterCriticalFiles(snippets) {
    const SKIP_FILES = /\.(md|txt|json|lock|png|jpg|gif|ico|svg|woff|ttf|eot|pdf|zip|tar|gz|log|bak|tmp)$/i;
    const PRIORITY_FILES = /\.(js|ts|py|php|java|rb|go|jsx|tsx|vue|swift|kt|scala|cs|cpp|c|h|sql|sh|yaml|yml|xml|html)$/i;
    return snippets.filter((snippet)=>{
        // Skip obviously safe files
        if (SKIP_FILES.test(snippet.name)) return false;
        // Skip huge files (likely to be minified or generated)
        if (snippet.size && snippet.size > 100000) return false;
        // Skip tiny files unless they're priority types
        if (snippet.size && snippet.size < 50 && !PRIORITY_FILES.test(snippet.name)) return false;
        // Include if it's a priority file type
        if (PRIORITY_FILES.test(snippet.name)) return true;
        // Include if content suggests security relevance
        const securityKeywords = [
            'password',
            'secret',
            'key',
            'token',
            'auth',
            'eval(',
            'exec(',
            'SELECT ',
            'INSERT ',
            'DELETE ',
            'UPDATE '
        ];
        const hasSecurityKeywords = securityKeywords.some((keyword)=>snippet.content.toLowerCase().includes(keyword.toLowerCase()));
        return hasSecurityKeywords;
    });
}
/* ----------------------------
   Batch AI Analysis - Multiple files per API call
   ---------------------------- */ async function batchAnalyzeWithAI(snippets) {
    const BATCH_SIZE = 3; // Analyze 3 files per AI call for efficiency
    const batches = [];
    // Create batches of files
    for(let i = 0; i < snippets.length; i += BATCH_SIZE){
        batches.push(snippets.slice(i, i + BATCH_SIZE));
    }
    console.log(`🔄 Processing ${batches.length} batches (${BATCH_SIZE} files each)`);
    // Process batches with reduced concurrency for stability
    const limit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$p$2d$limit$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(2); // Reduced for better performance and rate limit compliance
    const allResults = [];
    const batchPromises = batches.map((batch, batchIndex)=>limit(async ()=>{
            try {
                console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length}`);
                const batchResults = await analyzeBatchWithAI(batch);
                return batchResults;
            } catch (error) {
                console.error(`❌ Batch ${batchIndex + 1} analysis failed:`, error);
                return [];
            }
        }));
    const allBatchResults = await Promise.all(batchPromises);
    return allBatchResults.flat();
}
/* ----------------------------
   Single Batch AI Analysis - Analyzes multiple files in one API call
   ---------------------------- */ async function analyzeBatchWithAI(batch) {
    if (!OPENAI_KEY) return [];
    const model = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatOpenAI"]({
        model: OPENAI_MODEL,
        temperature: 0.1,
        openAIApiKey: OPENAI_KEY
    });
    // Create combined prompt for multiple files
    const filesContent = batch.map((snippet, idx)=>`FILE_${idx + 1}: ${snippet.name}
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
        const aiResponse = response.content;
        // Clean and parse AI response
        let jsonStr = aiResponse.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
        }
        const batchResults = JSON.parse(jsonStr);
        const scanResults = [];
        // Convert batch results to ScanResult format
        const results = batchResults.results || batchResults;
        for (const [fileName, vulnerabilities] of Object.entries(results)){
            if (Array.isArray(vulnerabilities) && vulnerabilities.length > 0) {
                const formattedVulns = vulnerabilities.map((v)=>({
                        severity: v.severity === 'critical' ? 'high' : v.severity || "medium",
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
   ---------------------------- */ async function fallbackIndividualAnalysis(batch) {
    const results = [];
    for (const snippet of batch){
        try {
            const vulnerabilities = await analyzeCodeWithAI(snippet);
            if (vulnerabilities.length > 0) {
                results.push({
                    file: snippet.name,
                    vulnerabilities
                });
            }
        } catch (error) {
            console.error(`❌ Individual analysis failed for ${snippet.name}:`, error);
        }
    }
    return results;
}
/* ----------------------------
   Semgrep Analysis Engine - Professional static analysis
   ---------------------------- */ async function runFullSemgrepAnalysis(snippets) {
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
   ---------------------------- */ function mergeIntelligentFindings(aiResults, semgrepFindings) {
    const mergedResults = new Map();
    // Add all AI findings first
    for (const result of aiResults){
        mergedResults.set(result.file, result);
    }
    // Integrate Semgrep findings
    for (const semgrepFinding of semgrepFindings){
        // Find matching file
        const fileName = semgrepFinding.file.split('/').pop() || semgrepFinding.file;
        const matchingFile = Array.from(mergedResults.keys()).find((key)=>key.endsWith(fileName) || key === semgrepFinding.file) || fileName;
        // Convert Semgrep finding to Vulnerability format
        const semgrepVuln = {
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
            const existing = mergedResults.get(matchingFile);
            // Check for duplicates (same vulnerability type and line)
            const isDuplicate = existing.vulnerabilities.some((v)=>v.title === semgrepVuln.title && Math.abs((v.startLine || 0) - (semgrepVuln.startLine || 0)) <= 2);
            if (!isDuplicate) {
                existing.vulnerabilities.push(semgrepVuln);
            }
        } else {
            mergedResults.set(matchingFile, {
                file: matchingFile,
                vulnerabilities: [
                    semgrepVuln
                ]
            });
        }
    }
    return Array.from(mergedResults.values());
}
/* ----------------------------
   Utility functions for Semgrep integration
   ---------------------------- */ function mapSemgrepSeverity(severity) {
    const severityMap = {
        'ERROR': 'high',
        'WARNING': 'medium',
        'INFO': 'low',
        'HIGH': 'high',
        'MEDIUM': 'medium',
        'LOW': 'low'
    };
    return severityMap[severity.toUpperCase()] || 'medium';
}
function formatSemgrepTitle(issue) {
    return issue.replace(/_/g, ' ').replace(/\b\w/g, (l)=>l.toUpperCase()).replace(/\s+/g, ' ').trim();
}
/* ----------------------------
   Helper function to create temporary directory for Semgrep
   ---------------------------- */ async function createTempRepoDir(snippets) {
    const fs = await __turbopack_context__.r("[externals]/fs/promises [external] (fs/promises, cjs, async loader)")(__turbopack_context__.i);
    const os = await __turbopack_context__.r("[externals]/os [external] (os, cjs, async loader)")(__turbopack_context__.i);
    const path = await __turbopack_context__.r("[externals]/path [external] (path, cjs, async loader)")(__turbopack_context__.i);
    // Create temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'semgrep-scan-'));
    // Write all files to temp directory
    for (const snippet of snippets){
        const filePath = path.join(tempDir, snippet.name);
        const dirPath = path.dirname(filePath);
        // Ensure directory exists
        await fs.mkdir(dirPath, {
            recursive: true
        });
        // Write file content
        await fs.writeFile(filePath, snippet.content, 'utf8');
    }
    console.log(`📁 Created temporary repository at ${tempDir}`);
    return tempDir;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ debugEnvironment() {
    return {
        hasGithubToken: !!GITHUB_TOKEN,
        hasOpenAiKey: !!OPENAI_KEY,
        githubApi: GITHUB_API,
        openaiModel: OPENAI_MODEL,
        githubTokenPreview: GITHUB_TOKEN ? `${GITHUB_TOKEN.substring(0, 10)}...` : "Not set",
        openaiKeyPreview: OPENAI_KEY ? `${OPENAI_KEY.substring(0, 10)}...` : "Not set"
    };
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ checkCodeSecurity(code) {
    const snippet = {
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
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ scanVulnerability(code) {
    console.log("🔍 scanVulnerability called with code length:", code.length);
    console.log("🔑 Environment check - OPENAI_KEY exists:", !!OPENAI_KEY);
    console.log("🔑 Environment check - GITHUB_TOKEN exists:", !!GITHUB_TOKEN);
    const snippet = {
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
    const highestSeverity = vulnerabilities.reduce((highest, curr)=>{
        const severityOrder = {
            low: 1,
            medium: 2,
            high: 3
        };
        return severityOrder[curr.severity] > severityOrder[highest.severity] ? curr : highest;
    });
    // Generate better descriptions and secure code fixes
    const secureCodeFix = generateSecureCodeFix(code, highestSeverity);
    return {
        riskLevel: highestSeverity.severity,
        riskTitle: highestSeverity.title,
        riskDescription: getDetailedDescription(highestSeverity, code),
        correctCode: secureCodeFix
    };
}
function getDetailedDescription(vulnerability, originalCode) {
    const descriptions = {
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

File operations should validate and sanitize all path inputs to prevent directory traversal.`
    };
    return descriptions[vulnerability.title] || vulnerability.description;
}
function generateSecureCodeFix(originalCode, vulnerability) {
    const fixes = {
        "hardcoded_secrets": (code)=>{
            let fixedCode = code;
            const patterns = [
                {
                    pattern: /(API_KEY|SECRET|PASSWORD|TOKEN)\s*[:=]\s*["']([^"']+)["']/gi,
                    replacement: '$1 = process.env.$1 || ""'
                },
                {
                    pattern: /apiKey\s*[:=]\s*["']([^"']+)["']/gi,
                    replacement: 'apiKey = process.env.API_KEY || ""'
                },
                {
                    pattern: /password\s*[:=]\s*["']([^"']+)["']/gi,
                    replacement: 'password = process.env.PASSWORD || ""'
                }
            ];
            patterns.forEach(({ pattern, replacement })=>{
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
        "sql_string_interp": (code)=>{
            let fixedCode = code;
            fixedCode = fixedCode.replace(/SELECT.*FROM.*WHERE.*\$\{.*\}/gi, 'SELECT * FROM users WHERE id = ?');
            return `// ✅ Secure version - uses parameterized queries
${fixedCode}

// Example with proper parameterization:
// const query = 'SELECT * FROM users WHERE id = ? AND name = ?';
// const results = await db.query(query, [userId, userName]);`;
        },
        "eval_os_system": (code)=>{
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
        "weak_hash": (code)=>{
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
        "path_traversal": (code)=>{
            let fixedCode = code;
            fixedCode = fixedCode.replace(/(open\s*\(|fs\.readFileSync\s*\(|readFile\s*\()[^,)]+/gi, '$1path.resolve(SAFE_DIR, path.basename(filename))');
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
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ scanRepository(owner, repo) {
    const files = await fetchRepoFiles(owner, repo);
    return await scanRepoFiles(files, true); // Enable enhanced scanning
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ handleScanRequest(req, res) {
    try {
        const { owner, repo, branch, enhanced = true } = req.body || req.query;
        if (!owner || !repo) return res.status(400).json({
            error: "owner & repo required"
        });
        const files = await fetchRepoFiles(owner, repo, branch || "main");
        if (!files.length) return res.status(200).json({
            results: []
        });
        const results = await scanRepoFiles(files, enhanced);
        return res.status(200).json({
            results,
            scannedFiles: files.length,
            enhancedScanEnabled: enhanced && !!OPENAI_KEY
        });
    } catch (err) {
        console.error("scan error:", err?.message || err);
        return res.status(500).json({
            error: err?.message || "scan failed"
        });
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    runSemgrepAnalysis,
    fetchRepoFiles,
    cheapPreScan,
    scanRepoFiles,
    debugEnvironment,
    checkCodeSecurity,
    scanVulnerability,
    scanRepository,
    handleScanRequest
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(runSemgrepAnalysis, "40168f14f5cd1ca63582a4423880f230575c4a3cae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchRepoFiles, "70b085b60687018d99411dba45157e04a55b437dd6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cheapPreScan, "40d6c8da0a195ae774261ad30bff337848de60b2b6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(scanRepoFiles, "60445b9756b179db5fad13de7a32e58aea2087a7b1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(debugEnvironment, "008664ea3258e58a551eda3d9cf841ad4891efff1d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkCodeSecurity, "40347afb77295f1eaeb69af5c659c9a54cac5b9bcf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(scanVulnerability, "40d4d0d90f9d762d679ef2fb47a9e99b50374447c5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(scanRepository, "605bdb6d3aeb5fcdcb52c3b3298eefd8d0e826c987", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleScanRequest, "60ffd660851ac8d0da75b409e3f94752b88393ab2e", null);
}}),
"[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "008664ea3258e58a551eda3d9cf841ad4891efff1d": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["debugEnvironment"]),
    "40168f14f5cd1ca63582a4423880f230575c4a3cae": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runSemgrepAnalysis"]),
    "40347afb77295f1eaeb69af5c659c9a54cac5b9bcf": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkCodeSecurity"]),
    "40d4d0d90f9d762d679ef2fb47a9e99b50374447c5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scanVulnerability"]),
    "40d6c8da0a195ae774261ad30bff337848de60b2b6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cheapPreScan"]),
    "60445b9756b179db5fad13de7a32e58aea2087a7b1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scanRepoFiles"]),
    "605bdb6d3aeb5fcdcb52c3b3298eefd8d0e826c987": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scanRepository"]),
    "60ffd660851ac8d0da75b409e3f94752b88393ab2e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleScanRequest"]),
    "70b085b60687018d99411dba45157e04a55b437dd6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRepoFiles"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "008664ea3258e58a551eda3d9cf841ad4891efff1d": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["008664ea3258e58a551eda3d9cf841ad4891efff1d"]),
    "40168f14f5cd1ca63582a4423880f230575c4a3cae": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40168f14f5cd1ca63582a4423880f230575c4a3cae"]),
    "40347afb77295f1eaeb69af5c659c9a54cac5b9bcf": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40347afb77295f1eaeb69af5c659c9a54cac5b9bcf"]),
    "40d4d0d90f9d762d679ef2fb47a9e99b50374447c5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40d4d0d90f9d762d679ef2fb47a9e99b50374447c5"]),
    "40d6c8da0a195ae774261ad30bff337848de60b2b6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40d6c8da0a195ae774261ad30bff337848de60b2b6"]),
    "60445b9756b179db5fad13de7a32e58aea2087a7b1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60445b9756b179db5fad13de7a32e58aea2087a7b1"]),
    "605bdb6d3aeb5fcdcb52c3b3298eefd8d0e826c987": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["605bdb6d3aeb5fcdcb52c3b3298eefd8d0e826c987"]),
    "60ffd660851ac8d0da75b409e3f94752b88393ab2e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60ffd660851ac8d0da75b409e3f94752b88393ab2e"]),
    "70b085b60687018d99411dba45157e04a55b437dd6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70b085b60687018d99411dba45157e04a55b437dd6"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[...slug]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/[...slug]/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/[...slug]/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/[...slug]/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/[...slug]/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/[...slug]/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/[...slug]/page.tsx", "default");
}}),
"[project]/src/app/[...slug]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f5b2e2e2e$slug$5d2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/[...slug]/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f5b2e2e2e$slug$5d2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/[...slug]/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f5b2e2e2e$slug$5d2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/[...slug]/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/[...slug]/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__bfde5dda._.js.map