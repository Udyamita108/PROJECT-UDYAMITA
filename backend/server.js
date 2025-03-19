// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
// const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// app.post("/auth/github", async (req, res) => {
//     const { code } = req.body;

//     try {
//         // Exchange code for access token
//         const tokenRes = await axios.post(
//             "https://github.com/login/oauth/access_token",
//             {
//                 client_id: CLIENT_ID,
//                 client_secret: CLIENT_SECRET,
//                 code,
//             },
//             { headers: { Accept: "application/json" } }
//         );

//         const accessToken = tokenRes.data.access_token;

//         // Fetch user data
//         const userRes = await axios.get("https://api.github.com/user", {
//             headers: { Authorization: `token ${accessToken}` },
//         });

//         res.json(userRes.data);
//     } catch (error) {
//         console.error("OAuth Error:", error);
//         res.status(500).json({ error: "OAuth failed" });
//     }
// });

// app.listen(5000, () => console.log("Server running on port 5000"));



// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;
// const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
// const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// // Validate required env variables
// if (!CLIENT_ID || !CLIENT_SECRET) {
//     console.error("⚠️ Missing GitHub OAuth environment variables!");
//     process.exit(1);
// }

// app.post("/auth/github", async (req, res) => {
//     const { code } = req.body;
    
//     if (!code) {
//         return res.status(400).json({ error: "Authorization code is required" });
//     }

//     try {
//         // Exchange code for access token
//         const tokenRes = await axios.post(
//             "https://github.com/login/oauth/access_token",
//             {
//                 client_id: CLIENT_ID,
//                 client_secret: CLIENT_SECRET,
//                 code,
//             },
//             { headers: { Accept: "application/json" } }
//         );

//         const accessToken = tokenRes.data.access_token;
//         if (!accessToken) {
//             throw new Error("Failed to retrieve access token");
//         }

//         // Fetch user data
//         const userRes = await axios.get("https://api.github.com/user", {
//             headers: { Authorization: `token ${accessToken}` },
//         });

//         res.json({
//             success: true,
//             user: userRes.data,
//         });
//     } catch (error) {
//         console.error("OAuth Error:", error.response?.data || error.message);
//         res.status(500).json({
//             success: false,
//             error: "OAuth failed. Please try again.",
//         });
//     }
// });

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Allow large payloads for webhooks

const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("⚠️ Missing GitHub OAuth environment variables!");
    process.exit(1);
}

// GitHub OAuth Authentication
app.post("/auth/github", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
    }

    try {
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
            throw new Error("Failed to retrieve access token");
        }

        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${accessToken}` },
        });

        res.json({
            success: true,
            user: userRes.data,
        });
    } catch (error) {
        console.error("OAuth Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: "OAuth failed" });
    }
});

// GitHub Webhook Handling
app.post("/webhook", (req, res) => {
    const event = req.headers["x-github-event"];
    
    console.log(`🔔 Received GitHub webhook: ${event}`, req.body);

    if (event === "push") {
        console.log(`📌 Push event detected by ${req.body.pusher?.name}`);
    }

    res.sendStatus(200);
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

