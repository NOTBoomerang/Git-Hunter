import type { Metadata } from "next";
import "./globals.css";

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
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
