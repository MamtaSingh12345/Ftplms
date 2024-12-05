const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  message: {
    type: String,
    required: true, // The message content of the notification
  },
  date: {
    type: Date,
    default: Date.now, // Default to the current date
  },
  type: {
    type: String,
    required: true, // Type of notification (e.g., 'request', 'info')
    enum: ['request', 'info'], // Define types of notifications
  },
  read: {
    type: Boolean,
    default: false, // To track if the notification has been read
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId, // Link to a specific planting request
    ref: 'PlantingRequest', // Reference the PlantingRequest model
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
