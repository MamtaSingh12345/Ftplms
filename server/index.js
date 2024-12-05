// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const registrationRoutes = require('./routes/registerRoutes');
const OTP = require('./Models/otp');
const Farmer = require('./Models/farmerRegister');
const FarmerSecondary = require('./Models/farmerProfile');


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const primaryDbURI = process.env.PRIMARY_DB_URI;

// Connect to primary database
mongoose.connect(primaryDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB connection error:', err));

// Use registration routes
app.use('/register', registrationRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
