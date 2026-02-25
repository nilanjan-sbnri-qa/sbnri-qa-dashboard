# Product Requirements Document (PRD)

**Project Name:** SBNRI Mobile App Test Automation & AI Augmentation
**Document Owner:** QA/Automation Team
**Target Platforms:** Android, iOS, Backend API Services

## 1. Objective
To design, implement, and maintain a robust automated testing infrastructure for the SBNRI B2C mobile application. By integrating industry-standard automation tools (Appium, Postman) with advanced AI agents (Google Antigravity, GSD, Ralph Loop, CodeRabbit), the project aims to eliminate manual testing errors, reduce regression cycles, and ensure UI/UX fidelity according to Figma designs.

## 2. Scope
### **In Scope:**
*   **Backend API Validation:** Automate functional, integration, and load testing for the APIs powering the SBNRI mobile applications.
*   **Mobile UI Automation:** Automated functional testing of end-to-end user journeys (e.g., Onboarding, KYC, Mutual Fund Discovery, Transactions) across Android and iOS.
*   **AI-Augmented Workflows:** Utilizing AI tools for script generation, code review, test maintenance, and self-healing analysis.
*   **Continuous Integration:** Integrating all testing suites into a CI/CD pipeline for automated execution on Pull Requests and Merges.

### **Out of Scope (for Phase 1):**
*   Performance testing of the actual mobile device hardware (battery drain, memory leaks).
*   Automated accessibility (a11y) testing.

## 3. Technology Stack & Architecture
| Component | Primary Tool(s) | Purpose |
| :--- | :--- | :--- |
| **Mobile UI Automation** | **Appium** (WebDriverIO / Python / Java) | Cross-platform functional testing representing real user interactions on physical/virtual devices. |
| **API Testing** | **Postman + Newman** | Creating collections, scripting assertions, and executing headless API tests in CI/CD. |
| **AI Coding Agent** | **Google Antigravity + GSD** | Rapidly generate boilerplate code, write Page Object Models, and create Postman scripts from swagger docs. *GSD (Get Shit Done)* tooling will execute local commands and orchestrate project setup. |
| **Continuous Feedback** | **Ralph Loop** | Running Antigravity in an autonomous loop to analyze test failures, read logs, and propose fixes dynamically without human intervention. |
| **Code Quality / PRs** | **CodeRabbit** | AI-driven code reviews on pull requests to catch logic errors before tests even run. |

## 4. Key Functional Requirements

### 4.1 API Automation (Postman + Newman)
*   **REQ-API-01:** All critical APIs (Auth, Portfolio, Orders) must have corresponding Postman collections.
*   **REQ-API-02:** Tests must include data-driven scenarios (valid inputs, invalid inputs, edge cases).
*   **-REQ-API-03:** Newman must be configured to execute tests in the CI/CD pipeline and block deployments if failure rates exceed 0%.
*   **REQ-API-04:** Use Antigravity to parse backend API documentation and auto-generate the base Postman collections and assertions.

### 4.2 Mobile UI Automation (Appium)
*   **REQ-UI-01:** Tests must follow the **Page Object Model (POM)** design pattern to ensure maintainability.
*   **REQ-UI-02:** Developers must instrument the Android and iOS codebases with stable, unique locators (`accessibility_id`, `content-desc`, `testID`) to avoid brittle XPath queries.
*   **REQ-UI-03:** Cross-Platform Execution: A single test script logic should execute cleanly on both Android and iOS drivers where UI parity exists.
*   **REQ-UI-04:** *Figma to Production Validation:* Integrate a visual regression tool (like Applitools or Percy) alongside Appium to compare the rendered app against baseline Figma snapshots to catch CSS/Layout regressions.

### 4.3 AI-Augmented Operations (Antigravity & Ralph Loop)
*   **REQ-AI-01 (CodeRabbit):** CodeRabbit must review all incoming PRs against custom security and formatting rules specific to the SBNRI codebase.
*   **REQ-AI-02 (Ralph Loop):** When a CI pipeline fails (e.g., Newman reports a 500 error, or Appium fails to find a button), the Ralph Loop should trigger Antigravity to:
    1. Ingest the failed logs and Appium screenshots.
    2. Identify the root cause (e.g., "The 'Submit' button locator changed from `btn-sub` to `btn-submit`").
    3. Generate a patch/PR to fix the test script automatically.

## 5. Implementation Roadmap

*   **Phase 1 - The Foundation (Weeks 1-2):**
    *   Set up CodeRabbit on the repository.
    *   Use Antigravity to scaffold the base project directories for Postman and Appium.
    *   Document the Top 5 most critical APIs and Top 3 User Journeys.
*   **Phase 2 - API Fortification (Weeks 3-4):**
    *   Complete Postman collections for critical paths.
    *   Integrate Newman into the CI/CD pipeline (GitHub Actions/GitLab CI).
*   **Phase 3 - UI Automation (Weeks 5-8):**
    *   Implement Appium capabilities for local Android emulators and iOS simulators.
    *   Write POM classes for the core screens (Login, Dashboard, Invest).
    *   Automate the Top 3 User Journeys.
*   **Phase 4 - AI Loop & Visuals (Weeks 9-10):**
    *   Integrate visual testing (Figma baselines).
    *   Configure the Ralph Loop architecture for auto-triage of test failures.

## 6. Success Metrics
To evaluate the success of this initiative, we will measure:
1.  **Production Incident Rate:** Target >80% reduction in user-reported UI/functional bugs.
2.  **Test Coverage:** 100% of Tier-1 Critical APIs covered; 80% of primary UI user flows covered.
3.  **Release Velocity:** Reduce manual regression testing time from *X days* to *< 2 hours* (Automated pipeline execution time).
4.  **AI Resolution Rate:** Provide metrics on how many test breakages were successfully auto-fixed by the Ralph Loop/Antigravity integration.
