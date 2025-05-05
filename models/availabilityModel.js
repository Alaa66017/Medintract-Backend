const mongoose = require('mongoose');

const availabilitySchema = mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g., '2025-04-21'
  timeSlots: [
    {
      time: { type: String, required: true }, // e.g., '09:00 AM'
      isBooked: { type: Boolean, default: false },
      bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
  ],
});

module.exports = mongoose.model('Availability', availabilitySchema);
