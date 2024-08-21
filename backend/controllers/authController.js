// const { google } = require("googleapis");
// require("dotenv").config();

// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URL
// );

// exports.getGoogleAuthUrl = (req, res) => {
//   const scopes = ["https://www.googleapis.com/auth/calendar"];
//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: scopes,
//   });
//   res.redirect(url);
// };

// exports.handleGoogleRedirect = async (req, res) => {
//   const code = req.query.code;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     // Save tokens securely (e.g., in a database)
//     process.env.ACCESS_TOKEN = tokens.access_token;
//     process.env.REFRESH_TOKEN = tokens.refresh_token;

//     res.send("Authentication successful! You can close this tab.");
//   } catch (error) {
//     console.error("Error during authentication:", error.message);
//     res.status(500).send("Error during authentication");
//   }
// };

// exports.ensureAuthenticated = async (req, res, next) => {
//   if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
//     await refreshAccessToken();
//   }
//   oauth2Client.setCredentials({
//     access_token: process.env.ACCESS_TOKEN,
//     refresh_token: process.env.REFRESH_TOKEN,
//   });
//   next();
// };

// async function refreshAccessToken() {
//   try {
//     const { credentials } = await oauth2Client.refreshAccessToken();
//     oauth2Client.setCredentials(credentials);
//     process.env.ACCESS_TOKEN = credentials.access_token;
//   } catch (error) {
//     console.error("Error refreshing access token:", error.message);
//   }
// }

const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

exports.getGoogleAuthUrl = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Generated Google Auth URL:", url);
  res.redirect(url);
};

exports.handleGoogleRedirect = async (req, res) => {
  const code = req.query.code;
  console.log("Received authorization code:", code);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Log the tokens (be careful with this in production)
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);

    // Save tokens securely (e.g., in a database)
    process.env.ACCESS_TOKEN = tokens.access_token;
    process.env.REFRESH_TOKEN = tokens.refresh_token;

    res.send("Authentication successful! You can close this tab.");
  } catch (error) {
    console.error("Error during authentication:", error.message);
    res.status(500).send("Error during authentication");
  }
};

exports.ensureAuthenticated = async (req, res, next) => {
  if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
    console.log("No access token found. Attempting to refresh...");
    await refreshAccessToken();
  } else {
    console.log("Access token found.");
  }

  // Log current credentials
  console.log("Current Access Token:", oauth2Client.credentials.access_token);
  console.log("Current Refresh Token:", oauth2Client.credentials.refresh_token);

  oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
  });

  next();
};

async function refreshAccessToken() {
  try {
    console.log("Refreshing access token...");
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    // Log the refreshed token
    console.log("Refreshed Access Token:", credentials.access_token);

    // Update environment variable (not recommended for production)
    process.env.ACCESS_TOKEN = credentials.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
  }
}
