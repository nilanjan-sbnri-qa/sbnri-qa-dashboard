# Custom Commands Registry

This file acts as a resource mapping custom, single-word commands to complex multi-step tasks.

## Registered Commands

### `Start_QA`
**Description:** Initializes the entire QA Dashboard ecosystem.
**Actions Performed sequentially:**
1. Navigates to the QA backend directory (`c:\Users\abc\Desktop\QA Team\qa-backend`) and runs `node index.js`.
2. Navigates to the QA frontend directory (`c:\Users\abc\Desktop\QA Team\dashboard`) and runs `npm run dev`.

### `Stop_QA`
**Description:** Terminates all running instances of the QA Dashboard ecosystem servers.
**Actions Performed sequentially:**
1. Since servers are run in the user's IDE terminal, instruct the user to press `Ctrl+C` in their active terminal panes. OR, if a forceful stop is required, run `Stop-Process -Name "node" -Force` in a PowerShell terminal.

*(Future commands will be added here as needed)*
