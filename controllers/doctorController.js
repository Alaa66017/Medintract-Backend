const Availability = require('../models/availabilityModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'name email')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email specialization description profileImage address price mobile');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const getDoctorById = async (req, res) => {
  console.log(req.params);
  const { doctorId } = req.params;
  try {
    const doctor = await User.findById(doctorId).select('name email specialization description address price profileImage mobile');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const updateAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctorId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.status = status;
    await appointment.save();
    res.json({ message: 'Appointment status updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  const { name, specialization, description, price, address, profileImage, mobile } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'doctor') {
      return res.status(403).json({ message: 'Unauthorized or not a doctor' });
    }

    user.name = name || user.name;
    user.specialization = specialization || user.specialization;
    user.description = description || user.description;
    user.price = price || user.price;
    user.address = address || user.address;
    user.mobile = mobile || user.mobile;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};


const setAvailability = async (req, res) => {
  const { doctorId, date, timeSlots } = req.body;

  try {
    const existing = await Availability.findOne({ doctorId, date });

    if (existing) {
      // Update time slots for the existing date
      existing.timeSlots = timeSlots;
      await existing.save();
    } else {
      await Availability.create({ doctorId, date, timeSlots });
    }

    res.status(200).json({ message: 'Availability set successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error setting availability', error: err.message });
  }
};


module.exports = { getAppointments, updateAppointmentStatus, getDoctorById, getAllDoctors, setAvailability, updateDoctorProfile };
