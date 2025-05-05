const express = require('express');
const { bookAppointment, getAppointments, getAvailableSlots, bookSlot } = require('../controllers/patientController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/appointments', protect, bookAppointment);
router.post('/book-slot', protect, bookSlot);
router.get('/availability', protect, getAvailableSlots);
router.get('/appointments', protect, getAppointments);

module.exports = router;
