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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'Only ZIP files are allowed' },
        { status: 400 }
      );
    }

    // Security: Check file size (50MB limit as stated in UI)
    const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_ZIP_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_ZIP_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary directory
    const tempDir = path.join(os.tmpdir(), `git-scan-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Extract ZIP file
      const zip = new AdmZip(buffer);
      zip.extractAllTo(tempDir, true);

      // Process extracted files
      const files = await processExtractedFiles(tempDir);

      // Clean up temporary directory
      await fs.rm(tempDir, { recursive: true, force: true });

      return NextResponse.json({
        success: true,
        files: files,
        projectName: file.name.replace('.zip', ''),
      });

    } catch (error) {
      // Clean up on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      throw error;
    }

  } catch (error) {
    console.error('ZIP upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process ZIP file' },
      { status: 500 }
    );
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
            const content = await fs.readFile(fullPath, 'utf-8');
            const extension = item.name.split('.').pop()?.toLowerCase() || 'text';

            codeSnippets.push({
              name: itemRelativePath,
              content: content,
              language: extension,
            });
          } catch (error) {
            console.error(`Failed to read file ${itemRelativePath}:`, error);
          }
        }
      }
    }
  }

  await walkDirectory(dirPath);
  return codeSnippets;
}