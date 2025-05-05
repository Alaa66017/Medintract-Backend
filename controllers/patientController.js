const Appointment = require('../models/appointmentModel');
const Availability = require('../models/availabilityModel');
const bookAppointment = async (req, res) => {
  const { doctorId, date } = req.body;
  try {
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
    });
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    res.status(400).json({ message: 'Booking error', error: err.message });
  }
};
const getAvailableSlots = async (req, res) => {
  const { doctorId } = req.query;

  try {
    const availabilityRecords = await Availability.find({ doctorId });
    // Filter out booked slots and group by date
    const availableSlots = availabilityRecords.map((record) => {
      const availableTimeSlots = record.timeSlots.filter((slot) => !slot.isBooked);
      return {
        date: record.date,
        timeSlots: availableTimeSlots.map((slot) => slot.time),
      };
    }).filter((record) => record.timeSlots.length > 0); // Remove dates with no available slots

    res.json({ doctorId, availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bookSlot = async (req, res) => {
  const { doctorId, patientId, date, time, fullName, email, age } = req.body;

  try {
    const availability = await Availability.findOne({ doctorId, date });
    if (!availability) {
      return res.status(404).json({ message: 'No availability found for this date' });
    }

    const slot = availability.timeSlots.find((s) => s.time === time);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // Mark the slot as booked
    slot.isBooked = true;
    slot.bookedBy = patientId;
    await availability.save();

    // Create an appointment with additional patient details
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      patientDetails: {
        fullName,
        email,
        age,
      },
    });

    res.status(200).json({ message: 'Slot booked successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error booking slot', error: err.message });
  }
};


const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'name email')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { bookAppointment, getAppointments, getAvailableSlots, bookSlot };
