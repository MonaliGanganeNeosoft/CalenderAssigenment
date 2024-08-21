const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { ensureAuthenticated } = require("../controllers/authController");

const router = express.Router();

router.get("/api/events", ensureAuthenticated, getEvents);
router.post("/api/events", ensureAuthenticated, createEvent);
router.put("/api/events/:googleEventId", ensureAuthenticated, updateEvent);
router.delete("/events/:googleEventId", ensureAuthenticated, deleteEvent);

module.exports = router;
