//schema for already registered phone number adhar id or voter id
const mongoose = require('mongoose');

const ExistenceCheckSchema = new mongoose.Schema({
  contactNumber: { type: String, required: false },
  aadharID: { type: String, required: false },
  voterID: { type: String, required: false },
  exists: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExistenceCheck', ExistenceCheckSchema);
