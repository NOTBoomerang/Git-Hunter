#!/bin/bash

# Enhanced Security Scanner Setup Script
echo "🛡️ Setting up Enhanced Security Scanner (Semgrep + OpenAI)..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install --upgrade pip
pip3 install semgrep openai python-dotenv

# Make the scanner executable
chmod +x semgrep_scanner.py

# Check if Semgrep is working
echo "🔍 Testing Semgrep installation..."
if command -v semgrep &> /dev/null; then
    echo "✅ Semgrep installed successfully"
    semgrep --version
else
    echo "❌ Semgrep installation failed"
    echo "📝 Please run: pip3 install semgrep"
fi

# Check OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️ OPENAI_API_KEY not set"
    echo "📝 Please add OPENAI_API_KEY to your .env.local file"
else
    echo "✅ OpenAI API key is configured"
fi

echo "🎉 Setup complete! You can now use enhanced security scanning."
echo ""
echo "Usage:"
echo "  Basic mode:  Enhanced analysis will be used automatically"
echo "  Manual run:  python3 semgrep_scanner.py [target_directory]"
echo ""
echo "Environment variables to set in .env.local:"
echo "  OPENAI_API_KEY=your_openai_api_key_here"
echo "  NEXT_GITHUB_TOKEN=your_github_token_here"
