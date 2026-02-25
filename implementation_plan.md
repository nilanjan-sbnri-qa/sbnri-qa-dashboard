# SBNRI Dashboard Styling Overhaul

## Goal
Update the internal QA Dashboard (`App.jsx`) to closely match the official SBNRI brand aesthetics observed on `https://sbnri.com/p/banking`.

## Proposed Changes

### Dashboard Frontend
#### [MODIFY] [App.jsx](file:///c:/Users/abc/Desktop/QA%20Team/dashboard/src/App.jsx)
- **Colors:**
  - Replace the generic indigo/slate theme with SBNRI brand colors.
  - Primary Brand Color: Deep Blue/Navy (`#0B2B5B` or Tailwind `blue-900`/`slate-900`) combined with a vibrant accent (often Gold/Orange or a specific vibrant blue depending on exact SBNRI brand standards, but based on the site, a clean, high-contrast Navy & White aesthetic is prominent). We will update gradients from `from-indigo-600 to-cyan-500` to a more professional, trustworthy financial blue palette.
  - Backgrounds: Keep clean white (`bg-white`) and soft grays (`bg-slate-50`) for maximum readability, typical of modern banking interfaces.
- **Typography & Layout:**
  - Ensure headings feel institutional yet modern.
  - Standardize button pill radiuses or sharp edges to match the SBNRI "Start Process Now" button style.
  - Update the "Action Needed" and Status indicators to use slightly more muted, professional financial alert colors rather than neon tones.

#### [MODIFY] [index.css](file:///c:/Users/abc/Desktop/QA%20Team/dashboard/src/index.css)
- Add a specific Google Font import if the SBNRI website uses a distinct sans-serif (like Inter, Roboto, or similar clean sans-serif) to ensure the typography matches perfectly.

## Require Password Change on First Login

### Proposed Changes

#### [MODIFY] [qa-backend/index.js](file:///c:/Users/abc/Desktop/QA%20Team/qa-backend/index.js)
- **State Management:**
  - Introduce a `requirePasswordChange` in-memory object to track which users must reset their password.
- **API `POST /api/invite`:**
  - When generating a new user, set `requirePasswordChange[newUserId] = true`.
- **API `POST /api/login`:**
  - If credentials are valid but `requirePasswordChange[userId]` is true, return `{ success: true, requirePasswordChange: true }`.
- **API `POST /api/change-password`:**
  - Create a new endpoint that accepts `userId`, `oldPassword`, and `newPassword`.
  - Validate old credentials. Update `validUsers[userId] = newPassword` and delete the flag from `requirePasswordChange`.

#### [MODIFY] [dashboard/src/App.jsx](file:///c:/Users/abc/Desktop/QA%20Team/dashboard/src/App.jsx)
- **State Additions:**
  - `requirePasswordChange` (boolean)
  - `newPasswordInput` and `confirmPasswordInput` (strings)
- **Login Flow:**
  - Update `handleLogin` to check for `data.requirePasswordChange`. If true, set the state and show the change password UI instead of proceeding to the dashboard.
- **Change Password UI:**
  - Create a new form conditionally rendered when `requirePasswordChange` is true. Contains inputs for the new password and confirmation.
  - Implement a `handleChangePassword` function to submit the new password to the backend and authenticate the user upon success.

## Verification Plan

### Manual Verification
1. I will run the Vite development server.
2. I will ask the user to open `http://localhost:5173` in their browser.
3. The user will confirm if the new SBNRI navy/financial themes and updated typography visually match their expectations of the company's brand identity.
4. The user will test the invite flow, receive the temporary password, and verify they are forced to change it upon first login.
