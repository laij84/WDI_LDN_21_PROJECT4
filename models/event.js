var mongoose = require("mongoose");

var values = {
  "very productive": 60,
  "productive": 30,
  "unproductive": -30,
  "very unproductive": -60
};

var eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  title: String,
  start: Date,
  end: Date,
  category: { type: String, enum: ['very productive', 'productive', 'unproductive', 'very unproductive'] },
  completed: { type: Boolean, default: false }
});

eventSchema.virtual('duration')
  .get(function() {
    return Math.round((this.end.getTime() - this.start.getTime()) / 1000 / 60);
  });

eventSchema.virtual('value')
  .get(function() {
    return Math.round((this.duration / 60) * values[this.category]);
  });

// eventSchema.statics.totalById = function(userId) {
//   return this.find({ user: userId, completed: true })
//     .then(function(events) {
//       return events.reduce(function(prev, current) {
//         return prev + current.value;
//       }, 0);
//     });
// }

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);