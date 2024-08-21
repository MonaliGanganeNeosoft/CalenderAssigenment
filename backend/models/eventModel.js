// const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema({
//   googleEventId: { type: String, required: true },
//   title: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   description: { type: String },
//   participants: { type: [String] },
//   duration: { type: Number },
//   sessionNotes: { type: String },
// });

// const Event = mongoose.model("Event", eventSchema);

// module.exports = Event;


const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   description: String,
//   participants: [String],
//   duration: String,
//   sessionNotes: String,
// });

// const eventSchema = new mongoose.Schema({
//   title: String,
//   startTime: Date,
//   endTime: Date,
//   description: String,
//   participants: [String],
//   duration: String,
//   sessionNotes: String,
// });

// module.exports = mongoose.model("Event", eventSchema);

// const eventSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId, // Default MongoDB ObjectId
//   googleEventId: String, // Google Calendar event ID
//   title: String,
//   startTime: Date,
//   endTime: Date,
//   description: String,
//   participants: [String],
//   duration: String,
//   sessionNotes: String,
// });

// const eventSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId, // Use Mongoose default ObjectId
//   googleEventId: String, // Google Calendar event ID
//   title: String,
//   startTime: Date,
//   endTime: Date,
//   description: String,
//   participants: [String],
//   duration: String,
//   sessionNotes: String,
// });

const eventSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Default MongoDB ObjectId
  googleEventId: String, // Google Calendar event ID
  title: String,
  startTime: Date,
  endTime: Date,
  description: String,
  participants: [String],
  duration: String,
  sessionNotes: String,
});

module.exports = mongoose.model("Event", eventSchema);
