# Start Dashboard Services

Use this file to conveniently start or stop both the UI and the Backend sequentially.

## 1. Stop Existing Services (Optional)
If your ports are currently busy or you need a fresh start, run this to clear out any hanging `node` / `vite` processes first:
```powershell
Get-Process node, nodejs -ErrorAction SilentlyContinue | Stop-Process -Force
```

## 2. Start the API Backend
This handles emails and authentication.
```powershell
cd 'c:\Users\abc\Desktop\QA Team\qa-backend'
node index.js
```
*(Runs on port 3000)*

## 3. Start the UI Dashboard
This runs the frontend Vite react app.
```powershell
cd 'c:\Users\abc\Desktop\QA Team\dashboard'
npm run dev
```
*(Runs on port 5173)*

## 4. (Optional) Run PR Analyzer
If you need to analyze a GitHub Pull Request:
```powershell
cd 'c:\Users\abc\Desktop\QA Team\backend-pr-analyzer'
node index.js
```
*(Requires `.env` variables like `GEMINI_API_KEY`, `GITHUB_TOKEN`, and `PR_NUMBER`)*
