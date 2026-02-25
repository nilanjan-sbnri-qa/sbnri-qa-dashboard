# QA Dashboard Context (Frontend & Backend)

## Progress Summary
This file tracks the progress and state of the SBNRI QA Dashboard (`QA Team/dashboard` and `QA Team/qa-backend`).

### Key Achievements:
1. **Frontend Deployment**: Deployed the Vite + React frontend dashboard to GitHub Pages (`https://nilanjan-sbnri-qa.github.io/sbnri-qa-dashboard`). Set up a manual deployment script to bypass Windows `ENAMETOOLONG` path errors during the automated `gh-pages` build process.
2. **Backend Deployment**: Successfully hosted the Express.js Node backend on Render.com's free tier. 
3. **API Routing**: Updated the frontend to point dynamic API calls (Login, Password Change, User Invites) to the live `https://sbnri-qa-dashboard.onrender.com` backend URL.
4. **Resend Email API Integration**: Replaced the native `nodemailer` SMTP implementation with the HTTP-based **Resend API**. This was necessary because Render's free tier aggressively blocks outbound traffic on SMTP ports (465/587) to prevent spam.
5. **Deep Linking (Magic Links)**: Modified the "Launch QA Dashboard" email button to append the generated User ID and Password securely as URL parameters. Updated the React frontend `useEffect` hook to automatically detect these parameters, pre-fill the login form, and instantly scrub the credentials from the browser address bar for enhanced security UX.
6. **PR Search Functionality**: Implemented a responsive search bar on the dashboard that filters the active Pull Request list by Title, Author, or PR ID.
7. **UI Polish**: 
   - Replaced placeholder emoji icons with professional Android/iOS/Backend SVG icons.
   - Updated the invite button loading states to sequence through "Generate & Email Credential", "Generating Credential...", and "Sending Credential..." to provide transparent feedback.

### Known Limitations/Next Steps:
- **Whalebone Corporate Firewall**: The `github.io` domain is newly registered and flagged by Whalebone. Proceed past the "Insecure" warning manually or test on cellular data until SBNRI IT points a trusted `qa.sbnri.com` URL to the dashboard.
- **Render Cold Starts**: Because the backend is on Render's free tier, the Node.js server goes to sleep after 15 minutes of inactivity. First logins of the day may take up to 60 seconds to process while the server re-initializes. Subsequent logins will be instantaneous.
