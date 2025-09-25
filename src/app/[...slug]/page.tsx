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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import {
  checkCodeSecurity,
  fetchRepoFiles,
  scanVulnerability,
} from "../actions";
import RepoHeader from "@/components/repo-header";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import VulnerabilityCard from "@/components/vulnerability-card";

export default function Page() {
  const params = useParams<{ slug: Array<string> }>();
  const { slug } = params;

  const [owner, repo] = slug;
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
      
      const files: CodeSnippet[] = await fetchRepoFiles(owner, repo);
      
      if (files.length === 0) {
        setLoading(false);
        return;
      }
      
      setCodeSnippets(
        files.map((file) => ({ ...file, isOpen: false, isLoading: true }))
      );
      setLoading(false);
      
      // Analyze files for security vulnerabilities
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
    } catch (err: any) {
      console.error('Error loading repository:', err);
      setError(err.message || 'Failed to load repository');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAndAnalyseFiles();
  }, [owner, repo]);

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
      <RepoHeader owner={owner} repo={repo} />
      
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
            <h3 className="text-red-800 font-semibold mb-2">Failed to Load Repository</h3>
            <p className="text-red-600 text-center mb-4">{error}</p>
            
            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
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
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Back to Home
              </Button>
            </div>
            
            {/* Helpful tips based on error type */}
            <div className="bg-red-100 p-4 rounded-lg w-full">
              <p className="text-red-700 text-sm font-medium mb-2">💡 Common Solutions:</p>
              <ul className="text-red-600 text-sm space-y-1">
                {error.includes('GitHub token') && (
                  <li>• Add <code>NEXT_GITHUB_TOKEN=your_token_here</code> to your <code>.env.local</code> file</li>
                )}
                {error.includes('not found') && (
                  <>
                    <li>• Check the repository URL spelling</li>
                    <li>• Ensure the repository exists and is publicly accessible</li>
                  </>
                )}
                {error.includes('Access denied') && (
                  <>
                    <li>• Make sure the repository is public, or</li>
                    <li>• Verify your GitHub token has the necessary permissions</li>
                  </>
                )}
                {error.includes('Network error') && (
                  <>
                    <li>• Check your internet connection</li>
                    <li>• Try again in a few moments</li>
                  </>
                )}
                {error.includes('OpenAI') && (
                  <>
                    <li>• Add <code>NEXT_OPENAI_API_KEY=your_api_key</code> to your <code>.env.local</code> file</li>
                    <li>• Ensure you have OpenAI API credits available</li>
                  </>
                )}
                {!error.includes('GitHub token') && !error.includes('not found') && !error.includes('Access denied') && !error.includes('Network error') && !error.includes('OpenAI') && (
                  <>
                    <li>• Check your internet connection</li>
                    <li>• Verify the repository URL is correct</li>
                    <li>• Try refreshing the page</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ) : codeSnippets.length === 0 ? (
          <div className="p-6 bg-gray-100 rounded-xl flex flex-col items-center">
            <div className="text-gray-400 mb-3 text-4xl">ⓘ</div>
            <p className="text-gray-500 font-medium">No code files found</p>
            <p className="text-gray-400 text-sm mt-2">This repository might not contain supported file types</p>
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
                                  // const formattedCode =
                                  //   snippet.content?.replaceAll(/[\s\n]/g, "");

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
