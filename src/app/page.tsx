"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, GithubIcon, Upload, FileArchive, LoaderCircleIcon } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.startsWith("https://github.com/")) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    // Extract repo name from URL
    const repoPath = repoUrl.replace("https://github.com/", "");

    // Validate that we have both username and repository
    if (!repoPath) {
      setError("Invalid repository URL format");
      return;
    }

    setError("");
    window.location.href = `/${repoPath}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setUploadError('Please select a ZIP file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setUploadError('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Store the uploaded files data in localStorage for the analysis page
      localStorage.setItem('uploadedFiles', JSON.stringify(result.files));
      localStorage.setItem('projectName', result.projectName);
      
      // Navigate to analysis page
      window.location.href = `/zip/${result.projectName}`;

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-indigo-100/60" />
      {/* Grid Background */}
      <GridBackground />
      <div className="absolute inset-0 bg-[radial-gradient(at_center_40%_20%,#6366f115_0%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full mix-blend-soft-light filter blur-[120px] opacity-40" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-soft-light filter blur-[120px] opacity-40" />

      <div className="relative z-20 w-full max-w-lg space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            Git Hunter
            <span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Analyze vulnerabilities in GitHub repositories or ZIP files
          </p>
          <div className="text-center">
            <a 
              href="/demo/vulnerable-app" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
            >
              🚀 Try Demo Mode (no API keys required)
            </a>
          </div>
        </div>



        {/* Tabbed Interface */}
        <Tabs defaultValue="github" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/95 backdrop-blur-lg">
            <TabsTrigger value="github" className="flex items-center gap-2">
              <GithubIcon className="h-4 w-4" />
              GitHub URL
            </TabsTrigger>
            <TabsTrigger value="zip" className="flex items-center gap-2">
              <FileArchive className="h-4 w-4" />
              ZIP Upload
            </TabsTrigger>
          </TabsList>

          {/* GitHub URL Tab */}
          <TabsContent value="github" className="mt-6">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center bg-white/95 backdrop-blur-lg rounded-xl shadow-xl ring-2 ring-slate-200/50 focus-within:ring-slate-300 transition-all">
                <GithubIcon className="h-5 w-5 text-slate-400 ml-4" />
                <Input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 py-5 px-4 text-base placeholder-slate-400 text-slate-900"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-indigo-600 text-white rounded-xl m-1.5 hover:bg-indigo-700 transition-colors"
                  disabled={!repoUrl}
                >
                  <ArrowRight size={20} />
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50/80 px-4 py-2.5 rounded-lg backdrop-blur-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
            </form>
          </TabsContent>

          {/* ZIP Upload Tab */}
          <TabsContent value="zip" className="mt-6">
            <div className="w-full">
              {/* File Upload Area */}
              <div 
                className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl ring-2 ring-slate-200/50 hover:ring-slate-300 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-4 px-6 py-8">
                  {isUploading ? (
                    <>
                      <LoaderCircleIcon className="h-8 w-8 text-indigo-600 animate-spin" />
                      <div className="text-center">
                        <p className="text-slate-700 font-medium">Processing ZIP file...</p>
                        <p className="text-slate-500 text-sm mt-1">Please wait while we extract and analyze your files</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-indigo-50 p-4">
                        <Upload className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-slate-700 font-medium">Upload ZIP file</p>
                        <p className="text-slate-500 text-sm mt-1">Click to select a ZIP file (max 50MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />

              {/* Upload Error Message */}
              {uploadError && (
                <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50/80 px-4 py-2.5 rounded-lg backdrop-blur-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span className="text-sm font-medium">{uploadError}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
