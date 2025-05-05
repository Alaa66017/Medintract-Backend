require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const chatbotRoutes = require('./routes/chatbot'); // Assuming you have a chatbot route
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// MongoDB Connection
const dbUsername = encodeURIComponent('mohamedmadian'); // Ensure the email is encoded
const dbPassword = encodeURIComponent('0180421332MJ'); // Encode special characters if any
// const mongoUri = `mongodb+srv://${dbUsername}:${dbPassword}@medintract.ynvyqdj.mongodb.net/medintract?retryWrites=true&w=majority`;
// const mongoUri = `mongodb+srv://${dbUsername}:${dbPassword}@medintract.ynvyqdj.mongodb.net/`;
const mongoUri = `mongodb://localhost:27017/medintract`;

mongoose
  .connect(mongoUri)
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch((err) => console.log('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/chatbot', chatbotRoutes); // Chatbot route
