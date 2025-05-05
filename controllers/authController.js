const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role, specialization, description } = req.body;

  try {
    const userData = { name, email, password, role };
    if (role === 'doctor') {
      userData.specialization = specialization; // Add specialization only for doctors
      userData.description = description; // Add description only for doctors
    }
    const user = await User.create(userData);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
};

const login = async (req, res) => {
  console.log(process.env.JWT_SECRET)
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login };
