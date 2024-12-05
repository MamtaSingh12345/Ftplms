const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // UUID for unique request ID
const Schema = mongoose.Schema;

const PlantingRequestSchema = new Schema({
  requestID: {
    type: String,
    unique: true,
    default: uuidv4 // Automatically generate a unique ID for each request
  },
  farmerID: {
    type: String,
    required: true // Farmer ID is required
  },
  farmerName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    village: {
      type: String,
      required: true
    },
    gramPanchayat: {
      type: String,
      required: true
    },
    block: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pin: {
      type: String,
      required: true
    }
  },
  aadharID: {
    type: String,
    required: false
  },
  landInAcres: {
    type: Number,
    required: false
  },
  fruitSaplings: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending', // Default status set to "Pending"
    enum: ['Pending', 'Approved', 'Rejected'] // Allowed statuses
  },
  // New fields for tracking approval and comments
  dateApproved: {
    type: Date,  // Stores the date when the request was approved
    required: false
  },
  approvedBy: {
    type: String,  // Stores the ID or name of the person who approved the request
    required: false
  },
  comments: {
    type: String,  // Additional comments about the request
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now // Date the request was created
  },
  updatedAt: {
    type: Date,
    default: Date.now // Tracks the last update to the request
  }
});

// Middleware to update the `updatedAt` field on every save
PlantingRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PlantingRequest', PlantingRequestSchema);
