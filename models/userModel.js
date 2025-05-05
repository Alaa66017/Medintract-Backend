const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['doctor', 'patient'] },
    specialization: { type: String, required: function () { return this.role === 'doctor'; } }, // Specialization only for doctors
    description: { type: String, required: function () { return this.role === 'doctor'; } }, // Specialization only for doctors
    price: { type: Number }, // Consultation fee
    address: { type: String }, // Office address
    mobile: { type: String }, // mobile number
    profileImage: { type: String }, // Profile image URL
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
