# Mistakes & Corrections Log

This file tracks mistakes made by the AI and the user's corrections to ensure they are not repeated in the future.

## 1. Starting the QA Dashboard Services
- **Mistake:** When asked to "start the PR dashboard", the AI only started the frontend Vite server (`QA Team/dashboard`) and forgot that the dashboard relies on a backend Node.js server (`QA Team/qa-backend`) to function properly.
- **2026-02-25:** The user pointed out that the `cat > file` command is not supported on Windows PowerShell in the way I was attempting to use it without specifying an encoding or handling multiline input correctly. I should use `Set-Content` or simply the `write_to_file` tool to create new scripts.
- **2026-02-25:** The user explicitly requested that whenever I need the servers to run, I should instruct them to open a split terminal *in their IDE* (e.g., VS Code) so they can directly check the output and manage the processes. I must not run long-lived servers backgrounded to my own private execution environment, nor should I spawn external CMD popups unless specifically asked.
- **Correction:** ALWAYS start both the frontend AND the relevant backend server when initializing the project. Never assume the frontend holds everything.
- **Date Recorded:** 2026-02-25
- [ ] Prepare dashboard to poll for PRs (pending GitHub repo access)

## 2. Ignoring User Confirmations
- **Mistake:** I repeatedly told the user to add SMTP environment variables in the Render dashboard, ignoring that they had already confirmed they uploaded them in a `.env` file.
- **Correction:** Render does not process uploaded `.env` files for Node services. Environment variables MUST be entered manually into the Render UI. However, I should trust the user when they say they performed an action and clarify the technical requirement rather than repeating the same instruction blindly.
- **Date Recorded:** 2026-02-26

## 3. Free Tier SMTP Blocking
- **Mistake:** I attempted to configure the live backend using `nodemailer` and an external SMTP server, failing to warn the user that Render's Free Tier blocks standard outbound email ports (465/587) to prevent spam.
- **Correction:** When deploying on free cloud providers (Render, Heroku, etc.), automatically utilize HTTP-based Email APIs (like Resend or SendGrid) instead of native SMTP configurations.
- **Date Recorded:** 2026-02-26

## 4. Corporate DNS Restrictions
- **Mistake:** I assumed the email link failing to open securely was a routing bug.
- **Correction:** We discovered the office network uses the "Whalebone" DNS filter, which intercepts newly registered `github.io` domains and blocks email wrapper tracking links. These environmental factors must be considered during internal tool deployment on corporate networks.
- **Date Recorded:** 2026-02-26

## 5. Artifact Storage Location
- **Mistake:** I saved the user-requested `.md` context files (like `dashboard.md`, `task.md`, etc.) in my hidden internal `brain` directory instead of the actual project folder.
- **Correction:** Always save user-requested `.md` context/tracking documents directly inside the `QA Team` project directory so the user can view them in their IDE and the context is preserved locally for them.
- **Date Recorded:** 2026-02-26
