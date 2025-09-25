# Hunter-AI Security Scanner

## Prerequisites
- Node.js (v18+ recommended)
- Python 3.8+
- Git
- Semgrep (Python package)

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/NOTBoomerang/Git-Hunter.git
   cd Git-Hunter
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   ```bash
   pip install semgrep
   # If you use a virtual environment:
   # python3 -m venv venv && source venv/bin/activate && pip install semgrep
   ```

4. **Set up environment variables:**
   - Create a `.env.local` file in the project root.
   - Add your API keys (do NOT commit this file):
     ```env
     NEXT_GITHUB_TOKEN=your_github_token
     NEXT_OPENAI_API_KEY=your_openai_key
     OPENAI_MODEL=gpt-3.5-turbo
     ```

## Running the App
1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

2. **Scan a repository:**
   - Use the web UI to enter a GitHub repo URL and start a scan.
   - Or use the API endpoint:
     ```bash
     curl -X POST http://localhost:3000/api/scan \
       -d '{"owner":"OWNER","repo":"REPO"}'
     ```

## Notes
- **Do NOT commit secrets or API keys.**
- If you see push protection errors, remove secrets from your code and `.env.local`.
- Semgrep is used for static analysis; OpenAI is used for AI-powered vulnerability detection.

## Troubleshooting
- If you see SSL errors, update your system certificates or temporarily disable SSL verification (not recommended for production).
- If you see push protection errors, remove all secrets from your commits before pushing.

## License
MIT
