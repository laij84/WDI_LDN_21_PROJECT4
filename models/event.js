var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  title: String,
  start: Date,
  end: Date,
  className: String,
  value: Number,
  stick: Boolean
});

module.exports = mongoose.model("Event", eventSchema);