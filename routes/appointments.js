const express = require('express');
const Appointment = require('../models/appointmentModel');
const router = express.Router();

// Book Appointment
router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, date, time  } = req.body;
    const appointment = new Appointment({ patientId, doctorId, date , time });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Appointments
router.get('/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ patientId: req.params.userId }, { doctorId: req.params.userId }],
    }).populate('patientId doctorId', 'name');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
