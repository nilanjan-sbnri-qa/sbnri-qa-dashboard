# Mistakes & Corrections Log

This file tracks mistakes made by the AI and the user's corrections to ensure they are not repeated in the future.

## 1. Starting the QA Dashboard Services
- **Mistake:** When asked to "start the PR dashboard", the AI only started the frontend Vite server (`QA Team/dashboard`) and forgot that the dashboard relies on a backend Node.js server (`QA Team/qa-backend`) to function properly.
- **Correction:** ALWAYS start both the frontend AND the relevant backend server when initializing the project. Never assume the frontend holds everything.
- **Date Recorded:** 2026-02-25
