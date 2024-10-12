// routes/registerRoutes.js
const express = require('express');
const twilio = require('twilio');
const OTP = require('../Models/otp'); // Ensure this model is correctly defined
const Farmer = require('../Models/farmerRegister'); // Ensure Farmer model is correctly defined
const FarmerSecondarySchema = require('../Models/farmerProfile');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { v4: uuidv4 } = require('uuid'); 
const multer = require('multer');
const { Readable } = require('stream');
const { Client } = require('basic-ftp'); 

require('dotenv').config(); // Load .env file


// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const router = express.Router();

// Reset Password Route (Simplified)
router.post('/reset-password', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  const { contactNumber, newPassword, confirmPassword, otp } = req.body;

  // Validate input
  if (!contactNumber || !newPassword || !confirmPassword || !otp) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({ success: false, message: 'Please provide all fields.' });
  }

  if (newPassword !== confirmPassword) {
    console.log('Validation failed: Passwords do not match');
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  // Password strength validation using regex pattern
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(newPassword)) {
    console.log('Validation failed: Weak password');
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.',
    });
  }

  try {
    // Find the OTP in the database
    const otpEntry = await OTP.findOne({ contactNumber });
    
    // Check if OTP exists and matches
    if (!otpEntry || otpEntry.otp !== otp) {
      console.log('Invalid or missing OTP');
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // (Optional) Check for OTP expiration (if you've implemented expiration logic)
    if (new Date() > otpEntry.expiresAt) {
      console.log('OTP has expired');
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await Farmer.findOneAndUpdate(
      { contactNumber },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Clean up: Delete OTP after successful verification and password reset
    await OTP.deleteOne({ contactNumber });

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});


// Route to send OTP and store it in the database
router.post('/send-otp', async (req, res) => {
  const { contactNumber } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the database
    const otpInstance = new OTP({ contactNumber, otp });
    await otpInstance.save();

    // Send OTP using Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: contactNumber,
    });

    // Respond with success
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Error sending OTP' });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  const { contactNumber, otp } = req.body;

  if (!contactNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Contact number and OTP are required' });
  }

  try {
    // Find the OTP in the database
    const otpEntry = await OTP.findOne({ contactNumber });
    if (!otpEntry) {
      return res.status(400).json({ success: false, message: 'OTP not found or has expired' });
    }

    // (Optional) Check for OTP expiration
    // Assuming you have a expiresAt field in your OTP model
    if (new Date() > otpEntry.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Verify OTP
    if (otpEntry.otp === String(otp)) {

      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/primary', async (req, res) => {
  const { farmerName, contactNumber, aadharID, voterID, password } = req.body;

  // Check if either Aadhar ID or Voter ID is provided
  if (!aadharID && !voterID) {
    return res.status(400).json({ message: 'Either Aadhar ID or Voter ID is required.' });
  }

  // Validate required fields
  if (!farmerName || !contactNumber || !password) {
    return res.status(400).json({ message: 'Farmer name, contact number, and password are required.' });
  }

   // Validate password complexity
   const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   if (!passwordPattern.test(password)) {
     return res.status(400).json({
       message: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.'
     });
   }

  try {
    // Check if a farmer with this contact number already exists
    const farmerExists = await Farmer.findOne({ contactNumber });
    if (farmerExists) {
      return res.status(400).json({ message: 'Farmer with this contact number already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a unique farmer ID
    const newFarmerID = uuidv4();

    // Create a new farmer instance
    const newFarmer = new Farmer({
      farmerID: newFarmerID,
      farmerName,
      contactNumber,
      aadharID: aadharID || undefined, // Only set if available
      voterID: voterID || undefined, // Only set if available
      password: hashedPassword,
    });

    // Save farmer details to the database
    await newFarmer.save();
    
    // Respond with success
    res.status(201).json({ message: 'Farmer registered successfully.', farmerID: newFarmerID });
  } catch (error) {
    console.error('Error during farmer registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Farmer profile fetch route
router.get('/fetch-profile/:farmerID', async (req, res) => {
  const { farmerID } = req.params;

  try {
    // Fetch the farmer profile using the farmerID
    const farmerProfile = await Farmer.findOne({ farmerID });
    if (!farmerProfile) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    // Send back the farmer profile data
    res.status(200).json({ success: true, data: farmerProfile });
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

//add address details to primary data
router.put('/primary-profile/:farmerID', async (req, res) => {
  const { farmerID } = req.params;

  // Validate incoming address details (optional)
  const addressDetails = req.body.address; // Assuming body contains address as an object
  if (!addressDetails || !addressDetails.village) {
      return res.status(400).json({ success: false, message: 'Address details are required.' });
  }

  try {
      const updatedAddress = await Farmer.findOneAndUpdate(
          { farmerID },
          { $set: { address: addressDetails } }, // Make sure to set the correct structure
          { new: true }
      );

      if (!updatedAddress) {
          return res.status(404).json({ success: false, message: 'Farmer not found.' });
      }

      return res.status(200).json({ success: true, data: updatedAddress });
  } catch (error) {
      console.error('Error updating primary address:', error);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Multer for memory storage (file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to convert buffer to stream
function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null); // Signal the end of the stream
  return readable;
}

// FTP Upload Function
async function uploadFileToFTP(fileBuffer, remoteFilePath) {
  const ftp = new Client();
  ftp.ftp.verbose = true; // Enable verbose output for debugging

  try {
      await ftp.access({
          host: process.env.FTP_HOST,
          user: process.env.FTP_USER,
          password: process.env.FTP_PASSWORD,
          secure: false, // Set to true if using FTPS
      });

      // Convert the buffer to a readable stream
      const fileStream = bufferToStream(fileBuffer);

      // Upload the stream to FTP
      await ftp.uploadFrom(fileStream, `/htdocs/uploads/${remoteFilePath}`);
      console.log('File uploaded successfully to /htdocs/uploads!');
  } catch (error) {
      console.error('Error uploading file to FTP:', error);
      throw error; // Re-throw the error so it can be caught by the calling function
  } finally {
      ftp.close(); // Ensure the connection is always closed
  }
}

// API route to handle secondary profile updates
router.post('/secondary-profile/:farmerID', upload.fields([
  { name: 'aadharScan', maxCount: 1 },
  { name: 'voterScan', maxCount: 1 },
  { name: 'farmerPhoto', maxCount: 1 }
]), async (req, res) => {
  const { farmerID } = req.params; // Extract farmerID from request parameters

  // Collect the secondary data fields
  const secondaryData = {
    landInAcres: req.body.landInAcres,
    landInBigha: req.body.landInBigha,
    distanceFromWaterSource: req.body.distanceFromWaterSource,
    waterSourceType: req.body.waterSourceType,
    documents: {},  // Initialize an empty documents object to store file paths
  };

  try {
    // Check if files are present and add them to the secondaryData object
    if (req.files) {
      if (req.files['aadharScan']) {
        const aadharPath = `aadharScan_${farmerID}.jpg`;
        await uploadFileToFTP(req.files['aadharScan'][0].buffer, aadharPath);  // Assuming you upload it somewhere (e.g., FTP)
        secondaryData.documents.aadharScan = aadharPath;  // Add to documents field
      }
      if (req.files['voterScan']) {
        const voterPath = `voterScan_${farmerID}.jpg`;
        await uploadFileToFTP(req.files['voterScan'][0].buffer, voterPath);
        secondaryData.documents.voterScan = voterPath;
      }
      if (req.files['farmerPhoto']) {
        const photoPath = `farmerPhoto_${farmerID}.jpg`;
        await uploadFileToFTP(req.files['farmerPhoto'][0].buffer, photoPath);
        secondaryData.documents.farmerPhoto = photoPath;
      }
    }

    // Find the existing farmer record or create a new one
    let existingFarmer = await FarmerSecondarySchema.findOne({ farmerID });

    if (!existingFarmer) {
      // If the farmer doesn't exist, create a new record
      existingFarmer = new FarmerSecondarySchema({
        farmerID,
        ...secondaryData  // Spread secondary data, including documents
      });
    } else {
      // If the farmer exists, update the fields
      existingFarmer.landInAcres = secondaryData.landInAcres;
      existingFarmer.landInBigha = secondaryData.landInBigha;
      existingFarmer.distanceFromWaterSource = secondaryData.distanceFromWaterSource;
      existingFarmer.waterSourceType = secondaryData.waterSourceType;

      // Update documents if new ones are provided
      if (secondaryData.documents.aadharScan) {
        existingFarmer.documents.aadharScan = secondaryData.documents.aadharScan;
      }
      if (secondaryData.documents.voterScan) {
        existingFarmer.documents.voterScan = secondaryData.documents.voterScan;
      }
      if (secondaryData.documents.farmerPhoto) {
        existingFarmer.documents.farmerPhoto = secondaryData.documents.farmerPhoto;
      }
    }

    // Save the farmer with updated document paths to MongoDB
    await existingFarmer.save();

    return res.status(201).json({
      success: true,
      message: 'Documents uploaded and data saved successfully!',
      data: existingFarmer,
    });

  } catch (error) {
    console.error('Error updating secondary data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
});


// Farmer login route
router.post('/login', async (req, res) => {
  const { contactNumber, password } = req.body;

  try {
    // Check if the farmer exists
    const farmer = await Farmer.findOne({ contactNumber });
    if (!farmer) {
      return res.status(400).json({ success: false, message: 'Farmer not found. Please check your phone number.' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. Please try again.' });
    }

    // If credentials are valid, return success
    res.status(200).json({ success: true, message: 'Login successful', farmerID: farmer.farmerID });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
