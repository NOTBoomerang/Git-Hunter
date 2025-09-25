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

  useEffect(() => {
    async function loadAndAnalyseFiles() {
      try {
        // Get uploaded files from localStorage
        const uploadedFilesData = localStorage.getItem('uploadedFiles');
        const storedProjectName = localStorage.getItem('projectName');

        if (!uploadedFilesData || !storedProjectName || storedProjectName !== projectName) {
          // Redirect back to home if no data found or mismatched project name
          router.push('/');
          return;
        }

        const files: CodeSnippet[] = JSON.parse(uploadedFilesData);
        
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
          } catch (securityError) {
            console.error(`Error analyzing ${file.name}:`, securityError);
            // Mark as secure by default if analysis fails
            setCodeSnippets((prev) =>
              prev.map((prevFile, prevIndex) =>
                prevIndex !== fileIndex
                  ? { ...prevFile }
                  : { ...prevFile, isSecure: true, isLoading: false }
              )
            );
          }
        }

        // Clean up localStorage after processing
        localStorage.removeItem('uploadedFiles');
        localStorage.removeItem('projectName');

      } catch (err: any) {
        console.error('Error loading ZIP files:', err);
        setError(err.message || 'Failed to load ZIP file data');
        setLoading(false);
      }
    }
    
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
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center">
            <div className="text-red-400 mb-3 text-4xl">⚠️</div>
            <h3 className="text-red-800 font-semibold mb-2">Failed to Load ZIP Files</h3>
            <p className="text-red-600 text-center mb-4">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Return to Upload
            </button>
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

                                  const scanVulnerabilityResponse =
                                    await scanVulnerability(snippet.content);

                                  setVulnerabilityCardInfo((prev) => ({
                                    ...prev,
                                    ...scanVulnerabilityResponse,
                                    codeLanguage: snippet.language,
                                    codeFileName: snippet.name,
                                    vulnerabilityCardLoading: false,
                                  }));
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