import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/error-boundary";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "GitHunter - AI-Powered Security Scanner",
  description: "Scan GitHub repositories and ZIP files for vulnerabilities, misconfigurations, and exposed secrets using AI-powered analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ToastProvider>
          <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
