const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  farmerID: { type: String, unique: true }, // Add farmerID field
  farmerName: { type: String, required: true },
  contactNumber: { type: String, required: true, unique: true },
  aadharID: { type: String, unique: true, sparse: true }, // Optional, allows null or undefined
  voterID: { type: String, unique: true, sparse: true }, // Optional, allows null or undefined
  password: { type: String, required: true }, // Hashed password
  address: {
    village: { type: String },
    gramPanchayat: { type: String },
    block: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String },
    pin: { type: String }
}
}, {
  collection: 'primarydatas' // Specify the collection name inside schema options
});

module.exports = mongoose.model('Farmer', farmerSchema);
