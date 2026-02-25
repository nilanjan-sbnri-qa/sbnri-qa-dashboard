require('dotenv').config();
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER; // e.g. "sbnri-tech"
const REPO_NAME = process.env.REPO_NAME; // e.g. "backend-monolith"
const PR_NUMBER = process.env.PR_NUMBER;

async function analyzePR() {
    try {
        console.log(`Fetching PR #${PR_NUMBER} from ${REPO_OWNER}/${REPO_NAME}...`);

        // 1. Fetch the git diff from GitHub API
        const response = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${PR_NUMBER}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3.diff'
                }
            }
        );
        const diffData = response.data;
        console.log(`Successfully fetched Diff. Analyzing...`);

        // 2. Pass Diff to Gemini to suggest Postman Collections
        const prompt = `
            You are a QA automation expert. Below is a git diff from a Pull Request in our backend repository.
            Based on the files and codebase logic changed, suggest which API test collections the QA engineer MUST run to verify this PR.
            
            Our existing collections are:
            * 01_Auth_Flows
            * 02_User_KYC
            * 03_Portfolio_Management
            * 04_Transactions_SIP
            
            Diff:
            ${diffData.substring(0, 15000)} // truncate to avoid token limits if massive
            
            Output a markdown checklist of collections to run and a 1-sentence reason why.
        `;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ parts: [{ text: prompt }] }],
        });

        console.log("\n=================================");
        console.log("🤖 Recommended QA Test Checklist");
        console.log("=================================\n");
        console.log(result.text);

        // Phase 2 Extension: We could auto-post this result back to the GitHub PR as a comment.

    } catch (error) {
        console.error("Error analyzing PR:", error.message);
    }
}

// Execute
if (!PR_NUMBER) {
    console.error("Please provide a PR_NUMBER environment variable");
    process.exit(1);
}
analyzePR();
