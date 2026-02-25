# SBNRI Automation - Conversation & Knowledge Base

*Date:* 2026-02-22

## Current Status & Strategy
The user is automating the SBNRI B2C Mutual Fund application (Android & iOS). 
*   **API Tests:** We are using **Postman + Newman**. The user currently has the API requests in Postman but *no Swagger/OpenAPI documentation*. 
*   **Mobile UI:** We are using **Appium** to test against Figma UI designs and verify functionality.
*   **AI Stack:** Google Antigravity, GSD, Ralph Loop, CodeRabbit.

## Key Decisions & Questions

### 1. Does the QA team need access to the backend codebase?
**No.** We only need the Postman collections and a Staging/QA environment. We will build the tests directly against the staging APIs.

### 2. Does the QA team need access to the frontend mobile codebase?
**Highly Recommended / Practically Required.** While Appium can inspect a compiled `.apk`/`.ipa`, the tests will remain brittle unless we have access to the mobile repository (React Native/Swift/Kotlin) to inject permanent testing locators (e.g., `accessibility_id`). Codebase access is also required to run Ralph Loop for auto-fixing broken locators dynamically.

### 3. How do we build API tests without API Documentation?
**"Documentation by Automation" Strategy:**
Since the requests already exist in Postman, we are bypassing formal documentation and injecting JavaScript directly into the Postman "Tests" tab.
1. Add status and payload assertions (e.g., Status 200, checks on JSON nodes).
2. Extract variables (like `auth_token`) so requests chain together.
3. Once working locally, export the `.json` collection and configure Newman in the CI/CD pipeline to execute it automatically.
4. *Optional Phase 2:* Auto-generate web docs using Postman's built-in feature based on the fully automated collection.

## Next Steps
The user will provide a sample JSON response of a critical API (e.g., Login, Portfolio Fetch, or Mutual Fund execution). AntiGravity will then generate the corresponding Postman test assertion scripts.

## Latest Updates (2026-02-22)
*   **Support Queries as Test Scenarios:** We reviewed `response.json` (containing real Jira/Slack support tickets with issues like KYC updates, Portfolio mismatches, SIP failures, payment errors) to potentially build our automated end-to-end test scenarios based on actual user issues.
*   **Context Strategy:** From now on, the agent will read this `Conversation Context` file to quickly recall past interactions, and we will continuously append the latest conversation summaries here.
*   **API Automation Plan:** Decided to tackle API automation (Postman) first.
    *   **Proposed Structure:** Organize by logical domains: `01_Auth_Flows`, `02_User_KYC`, `03_Portfolio_Management`, `04_Transactions_SIP`.
    *   **Pending User Feedback:** Waiting on details regarding Staging/QA Base URLs, Authentication flow (Bearer token vs OTP bypass), and the availability of dedicated Test Users (NRI/RI) for safe test execution.

## Latest Updates (2026-02-23)
*   **User Access Limitations:** The user confirmed they will only receive view-only access to the SBNRI backend repository. 
*   **Pivoted CI/CD Strategy:** Adapted Phase 1 to rely on an external "Polling Script" architecture instead of internal GitHub Actions, allowing us to read Pull Requests externally without write access.
*   **Dashboard UI Completed:** Built the SBNRI PR Tracking Dashboard (`localhost:5173`) using React + Vite + Tailwind CSS. The UI displays dummy testing data, a PR table, and Official Platform Logos.
*   **QA Backend & Authentication:** Scaffolding complete for the Node.js Express server (`qa-backend`). Implemented an invite-only internal portal.
*   **Live Email Integration:** Configured Nodemailer with a production App Password (`nilanjan@sbnri.com`). The dashboard successfully generates secure User IDs and Passwords for invited QA staff and emails them live.

*Waiting on Staging Base URL and Auth sequence to officially begin Phase 2: Postman API Testing.*

*   **Final Organization:** All automation components (`dashboard`, `qa-backend`, `backend-pr-analyzer`, `Postman_API_Automation`, `Appium_Mobile_Automation`) have been successfully consolidated into the `QA Team` master directory on the Desktop. Background processes have been terminated to close out the session.

## Latest Updates (2026-02-26)
*   **Frontend Deployment:** Deployed Vite + React frontend to GitHub Pages manually. 
*   **Backend Deployment:** Hosted Express.js Node backend on Render.com free tier.
*   **Dynamic API Routing:** Configured frontend to use live Render URL instead of localhost.
*   **Email API Switch:** Replaced `nodemailer` SMTP with Resend HTTP API to bypass Render's strict out-bound port blocking.
*   **Deep Linking:** Added URL parameters to the invite button link to automatically pre-fill credentials in the frontend using `useEffect`.
*   **Dashboard Features:** Implemented PR Search Functionality (Title, Author, PR ID filtering) and polished UI icons & loading states.
*   **Known Limitations:** Whalebone Corporate DNS filter blocking new `github.io` domain (requires bypass or whitelist). Render cold starts can take 60s for the first request.
