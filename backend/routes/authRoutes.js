const express = require("express");
const {
  getGoogleAuthUrl,
  handleGoogleRedirect,
} = require("../controllers/authController");

const router = express.Router();

router.get("/google", getGoogleAuthUrl);
router.get("/google/redirect", handleGoogleRedirect);

module.exports = router;
