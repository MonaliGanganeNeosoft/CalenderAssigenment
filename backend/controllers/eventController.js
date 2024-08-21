// const { google } = require("googleapis");
// const Event = require("../models/eventModel");
// require("dotenv").config();

// exports.getEvents = async (req, res) => {
//   try {
//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });
//     const response = await calendar.events.list({
//       calendarId: "primary",
//       timeMin: new Date().toISOString(),
//       singleEvents: true,
//       orderBy: "startTime",
//     });
//     res.json(response.data.items);
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     res.status(500).send("Error fetching events");
//   }
// };

// exports.createEvent = async (req, res) => {
//   const {
//     title,
//     startTime,
//     endTime,
//     description,
//     participants,
//     duration,
//     sessionNotes,
//   } = req.body;

//   const participantEmails = participants
//     .split(",")
//     .map((email) => email.trim());
//   if (!validateEmails(participantEmails)) {
//     return res
//       .status(400)
//       .send("Error creating event: Invalid attendee email.");
//   }

//   try {
//     const event = {
//       summary: title,
//       start: {
//         dateTime: new Date(startTime).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       end: {
//         dateTime: new Date(endTime).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       description: description,
//       attendees: participantEmails.map((email) => ({ email })),
//     };

//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });
//     const response = await calendar.events.insert({
//       calendarId: "primary",
//       resource: event,
//     });

//     const newEvent = new Event({
//       googleEventId: response.data.id,
//       title,
//       startTime: new Date(startTime),
//       endTime: new Date(endTime),
//       description,
//       participants: participantEmails,
//       duration,
//       sessionNotes,
//     });

//     await newEvent.save();

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error creating event:", error.message);
//     res.status(500).send("Error creating event");
//   }
// };

// exports.updateEvent = async (req, res) => {
//   const { googleEventId } = req.params;
//   const {
//     title,
//     startTime,
//     endTime,
//     description,
//     participants,
//     duration,
//     sessionNotes,
//   } = req.body;

//   const participantEmails = participants
//     .split(",")
//     .map((email) => email.trim());
//   if (!validateEmails(participantEmails)) {
//     return res
//       .status(400)
//       .send("Error updating event: Invalid attendee email.");
//   }

//   try {
//     const event = {
//       summary: title,
//       start: {
//         dateTime: new Date(startTime).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       end: {
//         dateTime: new Date(endTime).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       description: description,
//       attendees: participantEmails.map((email) => ({ email })),
//     };

//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });
//     await calendar.events.update({
//       calendarId: "primary",
//       eventId: googleEventId,
//       resource: event,
//     });

//     const updatedEvent = await Event.findOneAndUpdate(
//       { googleEventId },
//       {
//         title,
//         startTime: new Date(startTime),
//         endTime: new Date(endTime),
//         description,
//         participants: participantEmails,
//         duration,
//         sessionNotes,
//       },
//       { new: true }
//     );

//     if (!updatedEvent) {
//       return res.status(404).send("Event not found");
//     }

//     res.json(updatedEvent);
//   } catch (error) {
//     console.error("Error updating event:", error.message);
//     res.status(500).send("Error updating event");
//   }
// };

// exports.deleteEvent = async (req, res) => {
//   const { googleEventId } = req.params;

//   try {
//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });
//     await calendar.events.delete({
//       calendarId: "primary",
//       eventId: googleEventId,
//     });

//     const result = await Event.deleteOne({ googleEventId });

//     if (result.deletedCount === 0) {
//       return res.status(404).send("Event not found");
//     }

//     res.send("Event deleted successfully");
//   } catch (error) {
//     console.error("Error deleting event:", error.message);
//     res.status(500).send("Error deleting event");
//   }
// };

// function validateEmails(emails) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emails.every((email) => emailRegex.test(email));
// }

const { oauth2Client } = require("../config/auth"); // Import oauth2Client
const { google } = require("googleapis");
const Event = require("../models/eventModel");
const mongoose = require("mongoose");

// Ensure tokens are set before making API calls
const setOAuth2Credentials = () => {
  if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      access_token: process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
    });
    console.log("OAuth2 credentials set.");
  } else {
    console.error("OAuth2 credentials are not set.");
  }
};

exports.getEvents = async (req, res) => {
  setOAuth2Credentials(); // Ensure credentials are set
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    res.json(response.data.items);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).send("Error fetching events");
  }
};
exports.createEvent = async (req, res) => {
  // Set OAuth2 credentials
  oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const {
    title,
    startTime,
    endTime,
    description,
    participants,
    duration,
    sessionNotes,
  } = req.body;

  const participantEmails = participants
    .split(",")
    .map((email) => email.trim());
  if (!validateEmails(participantEmails)) {
    return res
      .status(400)
      .send("Error creating event: Invalid attendee email.");
  }

  try {
    const event = {
      summary: title,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      description: description,
      attendees: participantEmails.map((email) => ({ email })),
    };

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    // Explicitly set the MongoDB ObjectId
    const newEvent = new Event({
      _id: new mongoose.Types.ObjectId(), // Correctly create a new MongoDB ObjectId
      googleEventId: response.data.id,
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      description,
      participants: participantEmails,
      duration,
      sessionNotes,
    });

    await newEvent.save();

    res.json(response.data);
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).send("Error creating event");
  }
};

function validateEmails(emails) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every((email) => emailRegex.test(email));
}
// exports.createEvent = async (req, res) => {
//   setOAuth2Credentials(); // Ensure credentials are set
//   const {
//     title,
//     startTime,
//     endTime,
//     description,
//     participants,
//     duration,
//     sessionNotes,
//   } = req.body;

//   const participantEmails = participants
//     .split(",")
//     .map((email) => email.trim());
//   if (!validateEmails(participantEmails)) {
//     return res
//       .status(400)
//       .send("Error creating event: Invalid attendee email.");
//   }

//   try {
//     const event = {
//       summary: title,
//       start: {
//         dateTime: new Date(startTime).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       end: {
//         dateTime: new Date(endTime).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       description: description,
//       attendees: participantEmails.map((email) => ({ email })),
//     };

//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });
//     const response = await calendar.events.insert({
//       calendarId: "primary",
//       resource: event,
//     });

//     const newEvent = new Event({
//       googleEventId: response.data.id,
//       title,
//       startTime: new Date(startTime),
//       endTime: new Date(endTime),
//       description,
//       participants: participantEmails,
//       duration,
//       sessionNotes,
//     });

//     await newEvent.save();

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error creating event:", error.message);
//     res.status(500).send("Error creating event");
//   }
// };

exports.updateEvent = async (req, res) => {
  setOAuth2Credentials(); // Ensure credentials are set
  const { googleEventId } = req.params;
  const {
    title,
    startTime,
    endTime,
    description,
    participants,
    duration,
    sessionNotes,
  } = req.body;

  const participantEmails = participants
    .split(",")
    .map((email) => email.trim());
  if (!validateEmails(participantEmails)) {
    return res
      .status(400)
      .send("Error updating event: Invalid attendee email.");
  }

  try {
    const event = {
      summary: title,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      description: description,
      attendees: participantEmails.map((email) => ({ email })),
    };

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    await calendar.events.update({
      calendarId: "primary",
      eventId: googleEventId,
      resource: event,
    });

    const updatedEvent = await Event.findOneAndUpdate(
      { googleEventId },
      {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        participants: participantEmails,
        duration,
        sessionNotes,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).send("Event not found");
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(500).send("Error updating event");
  }
};

exports.deleteEvent = async (req, res) => {
  setOAuth2Credentials(); // Ensure credentials are set
  const { googleEventId } = req.params;

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    await calendar.events.delete({
      calendarId: "primary",
      eventId: googleEventId,
    });

    const result = await Event.deleteOne({ googleEventId });

    if (result.deletedCount === 0) {
      return res.status(404).send("Event not found");
    }

    res.send("Event deleted successfully");
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).send("Error deleting event");
  }
};

function validateEmails(emails) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every((email) => emailRegex.test(email));
}
