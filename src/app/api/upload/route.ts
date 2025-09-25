import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

/**
 * API route to handle ZIP file uploads
 * Extracts the ZIP file and returns the processed file contents
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data with timeout and size limits
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('Failed to parse form data:', formError);
      return NextResponse.json(
        { error: 'Invalid form data. Please try uploading the file again.' },
        { status: 400 }
      );
    }
    
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please select a ZIP file to upload.' },
        { status: 400 }
      );
    }
    
    if (!file.name) {
      return NextResponse.json(
        { error: 'Invalid file. File name is missing.' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json(
        { error: `Invalid file type. Only ZIP files are supported. Received: ${file.name}` },
        { status: 400 }
      );
    }

    // Security: Check file size (50MB limit as stated in UI)
    const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Empty file detected. Please select a valid ZIP file.' },
        { status: 400 }
      );
    }
    
    if (file.size > MAX_ZIP_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const maxSizeMB = MAX_ZIP_SIZE / (1024 * 1024);
      return NextResponse.json(
        { error: `File too large (${fileSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB.` },
        { status: 413 }
      );
    }

    // Convert file to buffer with error handling
    let bytes;
    let buffer;
    try {
      bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (bufferError) {
      console.error('Failed to read file buffer:', bufferError);
      return NextResponse.json(
        { error: 'Failed to read uploaded file. The file may be corrupted.' },
        { status: 400 }
      );
    }

    // Create temporary directory
    const tempDir = path.join(os.tmpdir(), `git-scan-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Extract ZIP file with comprehensive error handling
      let zip;
      try {
        zip = new AdmZip(buffer);
      } catch (zipError) {
        console.error('Failed to create ZIP instance:', zipError);
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        return NextResponse.json(
          { error: 'Invalid ZIP file format. Please ensure the file is a valid ZIP archive.' },
          { status: 400 }
        );
      }
      
      try {
        zip.extractAllTo(tempDir, true);
      } catch (extractError: any) {
        console.error('Failed to extract ZIP file:', extractError);
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        
        if (extractError.message?.includes('password') || extractError.message?.includes('encrypted')) {
          return NextResponse.json(
            { error: 'Password-protected ZIP files are not supported. Please upload an unprotected ZIP file.' },
            { status: 400 }
          );
        } else if (extractError.message?.includes('corrupted') || extractError.message?.includes('invalid')) {
          return NextResponse.json(
            { error: 'ZIP file appears to be corrupted. Please try re-creating the ZIP file.' },
            { status: 400 }
          );
        } else {
          return NextResponse.json(
            { error: 'Failed to extract ZIP file. Please check that the file is a valid ZIP archive.' },
            { status: 400 }
          );
        }
      }

      // Process extracted files
      let files;
      try {
        files = await processExtractedFiles(tempDir);
      } catch (processError) {
        console.error('Failed to process extracted files:', processError);
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        return NextResponse.json(
          { error: 'Failed to process extracted files. Please ensure the ZIP contains valid code files.' },
          { status: 500 }
        );
      }
      
      if (!files || files.length === 0) {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        return NextResponse.json(
          { error: 'No supported code files found in ZIP. Please include files with extensions like .js, .ts, .py, .java, .php, etc.' },
          { status: 400 }
        );
      }

      // Clean up temporary directory
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});

      // Generate safe project name
      const projectName = file.name.replace(/\.zip$/i, '').replace(/[^a-zA-Z0-9-_]/g, '-');

      return NextResponse.json({
        success: true,
        files: files,
        projectName: projectName,
        fileCount: files.length
      });

    } catch (error: any) {
      console.error('Unexpected error during ZIP processing:', error);
      // Clean up on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      throw error;
    }

  } catch (error: any) {
    console.error('ZIP upload error:', error);
    
    // Handle specific error types with user-friendly messages
    if (error.code === 'ENOSPC') {
      return NextResponse.json(
        { error: 'Server storage full. Please try again later or contact support.' },
        { status: 507 }
      );
    } else if (error.code === 'EMFILE' || error.code === 'ENFILE') {
      return NextResponse.json(
        { error: 'Server is busy processing files. Please try again in a moment.' },
        { status: 503 }
      );
    } else if (error.code === 'EACCES') {
      return NextResponse.json(
        { error: 'Server permission error. Please contact support.' },
        { status: 500 }
      );
    } else if (error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Upload timeout. Please try with a smaller ZIP file or check your connection.' },
        { status: 408 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to process ZIP file. Please try again or contact support if the problem persists.' },
        { status: 500 }
      );
    }
  }
}

/**
 * Recursively process extracted files similar to fetchRepoFiles function
 */
async function processExtractedFiles(dirPath: string): Promise<CodeSnippet[]> {
  // Same file filtering logic as the original GitHub fetcher
  const ALLOWED_FILES = [
    // Code files (extensions matter)
    /\.(js|ts|py|jsx|tsx|mjs|cjs)$/i, // Common script files
    /\.(java|php|rb|go|rs)$/i, // Additional languages

    // Config files (both named and extensions)
    /^dockerfile$/i, // Docker configuration
    /\.(env|config|conf|ini|xml|yaml|yml)$/i, // Common config formats
    /^(package\.json|tsconfig\.json|.*config\.js)$/i, // Node.js configs

    /\.(md|txt)$/i, // Readmes and docs

    /^(makefile|gradle|build\.gradle)$/i, // Build automation
  ];

  // Files and paths we want to explicitly ignore
  const IGNORED_FILES = [
    /node_modules/, // No need to analyze dependencies
    /\.gitignore/, // Not useful for code analysis
    /package-lock\.json|yarn\.lock/, // Lock files
    /\.DS_Store/, // macOS cruft
    /(dist|build|coverage)\//, // Build/output directories
    /\.(spec|test)\.[jt]s$/, // Test files (optional exclusion)
  ];

  const codeSnippets: CodeSnippet[] = [];

  async function walkDirectory(currentPath: string, relativePath: string = '') {
    const items = await fs.readdir(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);
      const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;
      
      // Security: Prevent zip slip attacks (path traversal)
      if (itemRelativePath.includes('..') || itemRelativePath.startsWith('/')) {
        console.warn(`⚠️ Suspicious path detected, skipping: ${itemRelativePath}`);
        continue;
      }

      if (item.isDirectory()) {
        // Recursively process directories
        await walkDirectory(fullPath, itemRelativePath);
      } else if (item.isFile()) {
        // Check if file should be processed
        const isAllowed = ALLOWED_FILES.some((pattern) => pattern.test(item.name));
        const isIgnored = IGNORED_FILES.some((pattern) => pattern.test(itemRelativePath));

        if (isAllowed && !isIgnored) {
          try {
            // Check file size before reading
            const stats = await fs.stat(fullPath);
            if (stats.size > 5 * 1024 * 1024) { // Skip files larger than 5MB
              console.warn(`Skipping large file ${itemRelativePath} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
              continue;
            }
            
            const content = await fs.readFile(fullPath, 'utf-8');
            const extension = item.name.split('.').pop()?.toLowerCase() || 'text';
            
            // Basic validation of file content
            if (content.length === 0) {
              console.warn(`Skipping empty file: ${itemRelativePath}`);
              continue;
            }

            codeSnippets.push({
              name: itemRelativePath,
              path: itemRelativePath,
              content: content,
              language: extension,
              size: stats.size
            });
          } catch (error: any) {
            console.error(`Failed to read file ${itemRelativePath}:`, error);
            // Don't fail the entire process for individual file errors
            continue;
          }
        }
      }
    }
  }

  await walkDirectory(dirPath);
  return codeSnippets;
}