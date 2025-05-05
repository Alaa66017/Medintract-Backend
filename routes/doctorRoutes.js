const express = require('express');
const { getAppointments, updateAppointmentStatus, getDoctorById, getAllDoctors, setAvailability, updateDoctorProfile } = require('../controllers/doctorController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/appointments', protect, getAppointments);
router.post('/set-availability', protect, setAvailability);
router.put('/profile', protect, updateDoctorProfile);
router.get('/', getAllDoctors);
router.get('/:doctorId', getDoctorById);
router.put('/appointments/status', protect, updateAppointmentStatus);

module.exports = router;
