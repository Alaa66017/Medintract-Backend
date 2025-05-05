const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference 'User' for doctors
    date: { type: String, required: true },
    time: { type: String, required: true },
    patientDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      age: { type: Number, required: true },
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
