const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory user store for demo purposes (Will migrate to DB later)
const validUsers = {
    'admin': 'admin2026',
};

// Tracks which users need to change their generated password on first login
const requirePasswordChange = {};

// Configure Email Transporter
let transporter;

async function setupTransporter() {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Use real SMTP if provided in .env
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log('Real SMTP Mailer configured.');
    } else {
        // Automatically generate a magical fake "Ethereal" email account just to prove the email flow works visually today without requiring your real password right now.
        console.log('Generating Ethereal Test Email Account...');
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('Ethereal Test Mailer configured globally.');
    }
}

// Setup Transporter once
setupTransporter();

// Authentication Endpoint
app.post('/api/login', (req, res) => {
    const { userId, password } = req.body;
    console.log(`\n--- Login Attempt ---`);
    console.log(`User: ${userId}, Password: ${password}`);
    console.log(`Stored Pass: ${validUsers[userId]}`);
    console.log(`Require Change Flag: ${requirePasswordChange[userId]}`);

    if (validUsers[userId] && validUsers[userId] === password) {
        if (requirePasswordChange[userId]) {
            console.log(`-> Refused login: Password change required for ${userId}.`);
            return res.json({ success: true, requirePasswordChange: true, message: "Password change required." });
        }
        console.log(`-> Authenticated successfully for ${userId}.`);
        return res.json({ success: true, message: "Authenticated successfully" });
    }
    console.log(`-> Invalid internal password for ${userId}.`);
    return res.status(401).json({ success: false, message: "Invalid internal password." });
});

// Invite / Email Endpoint
app.post('/api/invite', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    if (!email.toLowerCase().endsWith('@sbnri.com')) {
        return res.status(403).json({ success: false, message: "Security Restricted: Invites can only be sent to @sbnri.com domains." });
    }

    // 1. Generate Secure Random Credentials
    const newUserId = email.split('@')[0];
    const newPassword = crypto.randomBytes(4).toString('hex'); // e.g. "a1b2c3d4"

    // 2. Save to our database/memory
    validUsers[newUserId] = newPassword;
    requirePasswordChange[newUserId] = true; // Force password change on first login
    console.log(`Generated user: ${newUserId} | ${newPassword} (Change Required)`);

    // 3. Send the Email
    try {
        if (process.env.RESEND_API_KEY) {
            console.log("Using Resend HTTP API to bypass Render SMTP block...");

            const emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #4f46e5; text-align: center;">Welcome to the SBNRI QA Center!</h2>
                    <p>You have been invited to access our internal PR analysis and automated test orchestration dashboard.</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 16px;"><strong>Your Internal User ID:</strong> <span style="font-family: monospace; color: #1e293b;">${newUserId}</span></p>
                        <p style="margin: 12px 0 0; font-size: 16px;"><strong>Your Live Password:</strong> <span style="font-family: monospace; color: #1e293b; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${newPassword}</span></p>
                    </div>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="https://nilanjan-sbnri-qa.github.io/sbnri-qa-dashboard?userId=${newUserId}&password=${newPassword}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Launch QA Dashboard</a>
                    </p>
                    <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;">Confidential Internal Access Only. Do not share these credentials.</p>
                </div>
            `;

            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: "SBNRI QA Center <onboarding@resend.dev>",
                    to: email,
                    subject: "Your Invite to the SBNRI QA Dashboard",
                    html: emailHtml
                })
            });

            const resendData = await resendResponse.json();

            if (!resendResponse.ok) {
                console.error("Resend API Error:", resendData);
                throw new Error(resendData.message || "Resend API Request Failed");
            }

            console.log("Message successfully sent via Resend API:", resendData.id);
            res.json({
                success: true,
                message: "Invite email sent via Resend HTTP API!"
            });

        } else {
            console.log("No RESEND_API_KEY found. Falling back to SMTP...");
            let info = await transporter.sendMail({
                from: '"SBNRI QA Center" <qa@sbnri.com>',
                to: email,
                subject: "Your Invite to the SBNRI QA Dashboard",
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #4f46e5; text-align: center;">Welcome to the SBNRI QA Center!</h2>
                        <p>You have been invited to access our internal PR analysis and automated test orchestration dashboard.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
                            <p style="margin: 0; font-size: 16px;"><strong>Your Internal User ID:</strong> <span style="font-family: monospace; color: #1e293b;">${newUserId}</span></p>
                            <p style="margin: 12px 0 0; font-size: 16px;"><strong>Your Live Password:</strong> <span style="font-family: monospace; color: #1e293b; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${newPassword}</span></p>
                        </div>
                        <p style="text-align: center; margin-top: 30px;">
                            <a href="https://nilanjan-sbnri-qa.github.io/sbnri-qa-dashboard?userId=${newUserId}&password=${newPassword}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Launch QA Dashboard</a>
                        </p>
                        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;">Confidential Internal Access Only. Do not share these credentials.</p>
                    </div>
                `
            });

            console.log("Message sent to:", email);
            console.log("Message ID: %s", info.messageId);

            // Ethereal gives us a fake webmail inbox URL to see the email
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                console.log("Preview URL: %s", previewUrl);
            }

            res.json({
                success: true,
                message: "Invite email sent!",
                previewUrl // We send this back to the frontend just so the user can see the email in testing
            });
        }
    } catch (e) {
        console.error("Error sending email:", e);
        res.status(500).json({ success: false, message: "Failed to send the email." });
    }
});

// Change Password Endpoint
app.post('/api/change-password', (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters long." });
    }

    if (validUsers[userId] && validUsers[userId] === oldPassword) {
        validUsers[userId] = newPassword;
        delete requirePasswordChange[userId]; // Clear the flag
        console.log(`User ${userId} successfully changed their password.`);
        return res.json({ success: true, message: "Password updated successfully." });
    }

    return res.status(401).json({ success: false, message: "Invalid current password." });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`QA Backend Server running on port ${PORT}`));
