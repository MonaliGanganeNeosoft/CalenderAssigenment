const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

exports.oauth2Client = oauth2Client; // Export the oauth2Client
