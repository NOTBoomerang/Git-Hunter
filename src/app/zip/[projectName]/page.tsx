"use client";

import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  ChevronDown,
  ChevronUp,
  LoaderCircleIcon,
  ShieldAlert,
  ShieldCheckIcon,
  FileArchive,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  checkCodeSecurity,
  scanVulnerability,
} from "../../actions";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import VulnerabilityCard from "@/components/vulnerability-card";

export default function ZipAnalysisPage() {
  const params = useParams<{ projectName: string }>();
  const router = useRouter();
  const { projectName } = params;

  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [vulnerabilityCardInfo, setVulnerabilityCardInfo] = useState<
    Omit<VulnerabilityCardProps, "setOpenCard">
  >({
    correctCode: "",
    riskDescription: "",
    riskLevel: "",
    riskTitle: "",
    vulnerabilityCardLoading: true,
    codeLanguage: "",
    codeFileName: "",
  });
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState<
    number | null
  >(null);

  const loadAndAnalyseFiles = async () => {
    try {
      setError(null);
      setLoading(true);
      setIsRetrying(false);
      
      // Get uploaded files from localStorage
      const uploadedFilesData = localStorage.getItem('uploadedFiles');
      const storedProjectName = localStorage.getItem('projectName');

      if (!uploadedFilesData || !storedProjectName) {
        setError('No upload data found. Please upload a ZIP file again.');
        setLoading(false);
        return;
      }
      
      if (storedProjectName !== projectName) {
        setError('Project name mismatch. Please upload the ZIP file again.');
        setLoading(false);
        return;
      }

      let files: CodeSnippet[];
      try {
        files = JSON.parse(uploadedFilesData);
      } catch (parseError) {
        console.error('Failed to parse uploaded files data:', parseError);
        setError('Invalid upload data format. Please upload the ZIP file again.');
        setLoading(false);
        return;
      }
      
      if (!Array.isArray(files) || files.length === 0) {
        setError('No valid files found in upload data. Please upload a ZIP file with code files.');
        setLoading(false);
        return;
      }
        
      setCodeSnippets(
        files.map((file) => ({ ...file, isOpen: false, isLoading: true }))
      );
      setLoading(false);

      // Analyze each file for security vulnerabilities
      for (const [fileIndex, file] of files.entries()) {
        try {
          const { isSecure } = await checkCodeSecurity(
            file.content.replaceAll(/[\s\n]/g, "")
          );
          setCodeSnippets((prev) =>
            prev.map((prevFile, prevIndex) =>
              prevIndex !== fileIndex
                ? { ...prevFile }
                : { ...prevFile, isSecure, isLoading: false }
            )
          );
        } catch (securityError: any) {
          console.error(`Error analyzing ${file.name}:`, securityError);
          
          // Show warning for analysis failures but continue
          setCodeSnippets((prev) =>
            prev.map((prevFile, prevIndex) =>
              prevIndex !== fileIndex
                ? { ...prevFile }
                : { 
                    ...prevFile, 
                    isSecure: true, 
                    isLoading: false,
                    message: `Analysis failed: ${securityError.message || 'Unknown error'}`
                  }
            )
          );
        }
      }

      // Clean up localStorage after successful processing
      localStorage.removeItem('uploadedFiles');
      localStorage.removeItem('projectName');

    } catch (err: any) {
      console.error('Error loading ZIP files:', err);
      setError(err.message || 'Failed to load ZIP file data');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAndAnalyseFiles();
  }, [projectName, router]);

  const toggleSnippet = (index: number) => {
    setCodeSnippets((prev) =>
      prev.map((snippet, i) =>
        i === index
          ? {
              ...snippet,
              isOpen: !snippet.isOpen,
            }
          : snippet
      )
    );
  };

  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileArchive className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              {decodeURIComponent(projectName)}
            </h1>
          </div>
        </div>
        <p className="text-slate-600">
          Security analysis results for uploaded ZIP file
        </p>
      </div>

      {/* Code snippets and other content */}
      <div
        className={cn("mx-auto px-10 transition-all duration-300 ease-in-out", {
          "max-w-7xl": openCard,
          "max-w-4xl": !openCard,
        })}
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center max-w-2xl mx-auto">
            <div className="text-red-400 mb-3 text-4xl">⚠️</div>
            <h3 className="text-red-800 font-semibold mb-2">Failed to Load ZIP Files</h3>
            <p className="text-red-600 text-center mb-4">{error}</p>
            
            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
              {/* Only show retry if it's not a data issue */}
              {!error.includes('No upload data') && !error.includes('Project name mismatch') && !error.includes('Invalid upload data') && (
                <Button 
                  onClick={() => {
                    setIsRetrying(true);
                    loadAndAnalyseFiles();
                  }} 
                  disabled={isRetrying}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isRetrying ? (
                    <>
                      <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    'Try Again'
                  )}
                </Button>
              )}
              
              <Button 
                onClick={() => router.push('/')}
                variant={error.includes('No upload data') || error.includes('Project name mismatch') || error.includes('Invalid upload data') ? "default" : "outline"}
                className={error.includes('No upload data') || error.includes('Project name mismatch') || error.includes('Invalid upload data') ? "" : "border-red-300 text-red-700 hover:bg-red-50"}
              >
                Upload New ZIP File
              </Button>
            </div>
            
            {/* Helpful tips based on error type */}
            <div className="bg-red-100 p-4 rounded-lg w-full">
              <p className="text-red-700 text-sm font-medium mb-2">💡 What to do:</p>
              <ul className="text-red-600 text-sm space-y-1">
                {error.includes('No upload data') && (
                  <>
                    <li>• Upload data has expired or was not found</li>
                    <li>• Please return to the home page and upload your ZIP file again</li>
                  </>
                )}
                {error.includes('Project name mismatch') && (
                  <>
                    <li>• The URL doesn't match the uploaded project</li>
                    <li>• Please upload your ZIP file again</li>
                  </>
                )}
                {error.includes('Invalid upload data') && (
                  <>
                    <li>• Upload data is corrupted or invalid</li>
                    <li>• Please try uploading your ZIP file again</li>
                  </>
                )}
                {error.includes('No valid files') && (
                  <>
                    <li>• The ZIP file doesn't contain supported code files</li>
                    <li>• Make sure your ZIP contains .js, .ts, .py, .php, .java, or other code files</li>
                  </>
                )}
                {error.includes('OpenAI') && (
                  <>
                    <li>• OpenAI API configuration issue</li>
                    <li>• Contact support if the problem persists</li>
                  </>
                )}
                {!error.includes('No upload data') && !error.includes('Project name mismatch') && !error.includes('Invalid upload data') && !error.includes('No valid files') && !error.includes('OpenAI') && (
                  <>
                    <li>• Try refreshing the page or uploading again</li>
                    <li>• Check that your ZIP file is not corrupted</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ) : codeSnippets.length === 0 ? (
          <div className="p-6 bg-gray-100 rounded-xl flex flex-col items-center">
            <div className="text-gray-400 mb-3 text-4xl">ⓘ</div>
            <p className="text-gray-500 font-medium">No code files found</p>
            <p className="text-gray-400 text-sm mt-2">The ZIP file might not contain supported file types</p>
          </div>
        ) : (
          <div className="flex w-full justify-between gap-4">
            <div
              className={cn("space-y-2 w-full", {
                "w-1/2": openCard,
              })}
            >
              {codeSnippets.map((snippet, index) => (
                <div
                  key={index}
                  className={cn(
                    "group rounded-lg border transition-all hover:border-gray-300 relative",
                    selectedSnippetIndex === index ? "bg-gray-100" : "bg-white"
                  )}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSnippet(index)}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {snippet.isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 cursor-pointer" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                          <span className="text-sm">📄</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-800 text-sm">
                            {snippet.name.split("/").pop()}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-1">
                            {/* File name */}
                            {snippet.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {snippet.isLoading ? (
                        // When loading
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <LoaderCircleIcon className="h-5 w-5 text-gray-600 animate-spin" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Queued for security scan...</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                disabled={
                                  vulnerabilityCardInfo.vulnerabilityCardLoading &&
                                  openCard
                                }
                                variant={"outline"}
                                className={cn("h-10 w-10", {
                                  "cursor-pointer": !snippet.isSecure,
                                })}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (snippet.isSecure) return;

                                  setVulnerabilityCardInfo(() => ({
                                    vulnerabilityCardLoading: true,
                                    correctCode: "",
                                    riskDescription: "",
                                    riskLevel: "",
                                    riskTitle: "",
                                    codeLanguage: "",
                                  }));
                                  setSelectedSnippetIndex(index);
                                  setOpenCard(true);

                                  try {
                                    const scanVulnerabilityResponse =
                                      await scanVulnerability(snippet.content);

                                    setVulnerabilityCardInfo((prev) => ({
                                      ...prev,
                                      ...scanVulnerabilityResponse,
                                      codeLanguage: snippet.language,
                                      codeFileName: snippet.name,
                                      vulnerabilityCardLoading: false,
                                    }));
                                  } catch (analysisError: any) {
                                    console.error('Vulnerability analysis failed:', analysisError);
                                    setVulnerabilityCardInfo((prev) => ({
                                      ...prev,
                                      riskLevel: "error" as RiskLevel,
                                      riskTitle: "Analysis Failed",
                                      riskDescription: `Unable to analyze this file: ${analysisError.message || 'Unknown error occurred'}. This might be due to API limits, network issues, or file complexity.`,
                                      correctCode: `// Analysis failed for ${snippet.name}\n// Error: ${analysisError.message || 'Unknown error'}\n\n${snippet.content}`,
                                      codeLanguage: snippet.language,
                                      codeFileName: snippet.name,
                                      vulnerabilityCardLoading: false,
                                    }));
                                  }
                                }}
                              >
                                {snippet.isSecure ? (
                                  <ShieldCheckIcon
                                    className={cn("text-green-500")}
                                  />
                                ) : (
                                  <ShieldAlert className="text-red-500" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent forceMount>
                              {snippet.isSecure ? (
                                <p>No vulnerabilities found</p>
                              ) : (
                                <p>Click to review.</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {snippet.isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div
                          className={cn("border-t w-full", {
                            "max-w-xl": openCard,
                          })}
                        >
                          <SyntaxHighlighter
                            language={snippet.language || "plaintext"}
                            style={atomOneLight}
                            className="p-4 text-sm !font-mono !bg-gray-50 "
                            showLineNumbers
                            wrapLongLines
                            lineNumberStyle={{ color: "#9CA3AF" }}
                          >
                            {/* Code snippet */}
                            {snippet.content}
                          </SyntaxHighlighter>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            {openCard && (
              <VulnerabilityCard
                riskLevel={vulnerabilityCardInfo.riskLevel}
                riskTitle={vulnerabilityCardInfo.riskTitle}
                riskDescription={vulnerabilityCardInfo.riskDescription}
                correctCode={vulnerabilityCardInfo.correctCode}
                setOpenCard={setOpenCard}
                vulnerabilityCardLoading={
                  vulnerabilityCardInfo.vulnerabilityCardLoading
                }
                codeLanguage={vulnerabilityCardInfo.codeLanguage}
                codeFileName={vulnerabilityCardInfo.codeFileName}
                setSelectedSnippetIndex={setSelectedSnippetIndex}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}