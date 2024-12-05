// routes/registerRoutes.js
const express = require('express');
const twilio = require('twilio');
const OTP = require('../Models/otp'); // Ensure this model is correctly defined
const Farmer = require('../Models/farmerRegister'); // Ensure Farmer model is correctly defined
const FarmerSecondarySchema = require('../Models/farmerProfile');
const PlantingRequest = require('../Models/plantingApplication');
const Notification = require('../Models/notifications'); // Import Notification model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { v4: uuidv4 } = require('uuid'); 
const multer = require('multer');
const { Readable } = require('stream');
const { Client } = require('basic-ftp'); 
const nodemailer = require('nodemailer');


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

  // Validate contact number
  if (!/^\+\d{10,15}$/.test(contactNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number format' });
  }

  try {
    // Generate OTP
    const otp = generateOTP(); // Example: Math.floor(100000 + Math.random() * 900000).toString()

    // Set OTP expiration time (e.g., 5 minutes)
    const expirationTime = 5 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expirationTime);

    // Store OTP in the database (upsert if it exists)
    await OTP.findOneAndUpdate(
      { contactNumber },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send OTP using Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number from env
      to: contactNumber,
    });

    // Respond with success
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Error sending OTP' });
  }
});


// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { contactNumber, otp } = req.body;

  // Validate inputs
  if (!contactNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Contact number and OTP are required' });
  }

  try {
    // Find the OTP in the database
    const otpEntry = await OTP.findOne({ contactNumber });
    if (!otpEntry) {
      return res.status(400).json({ success: false, message: 'OTP not found or has expired' });
    }

    // Check if OTP has expired
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
    res.status(500).json({ success: false, error: 'Error verifying OTP' });
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
   const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
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
      // Fetch the primary farmer profile
      const primaryProfile = await Farmer.findOne({ farmerID });  // Corrected to 'Farmer'
      if (!primaryProfile) {
          return res.status(404).json({ success: false, message: 'Primary profile not found.' });
      }

      // Fetch the secondary farmer profile
      const secondaryProfile = await FarmerSecondarySchema.findOne({ farmerID });  // Corrected to 'FarmerSecondary'
      if (!secondaryProfile) {
          return res.status(404).json({ success: false, message: 'Secondary profile not found.' });
      }

      // Combine both primary and secondary profiles into one object
      const fullProfile = {
          ...primaryProfile.toObject(),
          ...secondaryProfile.toObject()
      };

      // Send the combined profile back
      res.status(200).json({ success: true, data: fullProfile });

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
    const farmer = await Farmer.findOne({ contactNumber }).select('password farmerID');

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

router.put('/plant-protection/:farmerID', async (req, res) => {
  const { farmerID } = req.params;
  const { treeType, numberOfTrees, ageOfTrees, agrochemicalType } = req.body;

  // Validate incoming plant protection details
  if (!treeType || !numberOfTrees || !ageOfTrees) {
    return res.status(400).json({ success: false, message: 'Tree type, number of trees, and age of trees are required.' });
  }

  try {
    // Find the secondary data entry for this farmer by farmerID
    const secondaryData = await FarmerSecondarySchema.findOne({ farmerID });
    if (!secondaryData) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    // Update the plant protection details
    secondaryData.plantProtection = {
      treeType,
      numberOfTrees,
      ageOfTrees,
      agrochemicalType,
    };

    // Save the updated secondary data
    const updatedSecondaryData = await secondaryData.save();
    return res.status(200).json({ success: true, data: updatedSecondaryData });
  } catch (error) {
    console.error('Error updating plant protection details:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

router.post('/send-advisory', async (req, res) => {
  const { name, email, phone, problem } = req.body;

  // Validate all required fields
  if (!name || !email || !phone || !problem) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Set up nodemailer transporter with app password
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,         // Admin Gmail address
      pass: process.env.ADMIN_APP_PASSWORD,  // Gmail app password, NOT your usual email password
    },
  });

  // Include phone number in the email content
  const mailOptions = {
    from: email,
    to: process.env.ADMIN_EMAIL,             // Admin email to receive the advisory request
    subject: 'New Agro Advisory Request',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nProblem:\n${problem}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// POST route for submitting planting application
router.post('/planting-request', async (req, res) => {
  try {
    const {
      farmerID,
      farmerName,
      contactNumber,
      address,
      aadharID,
      landInAcres,
      fruitSaplings,
    } = req.body;

    // Check for required fields
    if (!farmerID || !farmerName || !contactNumber || !address || !landInAcres) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const newRequest = new PlantingRequest({
      
      farmerID,
      farmerName,
      contactNumber,
      address: {
        village: address.village,
        gramPanchayat: address.gramPanchayat,
        block: address.block,
        district: address.district,
        state: address.state,
        country: address.country,
        pin: address.pin
      },
      aadharID,
      landInAcres,
      fruitSaplings,
      status: 'Pending' // Default status set to "Pending"
    });

    // Save the new planting request
    await newRequest.save();

    // Create a notification object
    const notification = {
      message: `New planting request received from Farmer ${farmerName}`,
      type: 'request',
      date: new Date().toISOString(), // Use the current date and time
      read: false,
      requestId: newRequest.requestID // Use the newly created request ID
    };

    // Send the response
    res.status(201).json({
      success: true,
      message: 'Planting application submitted successfully',
      notification: notification // Include the notification in the response
    });
  } catch (err) {
    console.error('Error while submitting application:', err); // Log full error for debugging
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Get all planting requests
router.get('/planting-request', async (req, res) => {
  try {
    const plantingRequests = await PlantingRequest.find().sort({ createdAt: -1 }); // Sort by creation date
    res.status(200).json({ success: true, plantingRequests });
  } catch (err) {
    console.error('Error while fetching planting requests:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Update Planting Request Status by requestID
router.put('/planting-request/:requestID', async (req, res) => {
  const { requestID } = req.params;  // Capture requestID from the URL parameter
  const { status, dateApproved, approvedBy, comments } = req.body;

  // Ensure requestID is passed in the URL and status is provided
  if (!requestID) {
    return res.status(400).json({ success: false, message: 'Request ID is required' });
  }

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  try {
    // Match the requestID from the database and update
    const updatedRequest = await PlantingRequest.findOneAndUpdate(
      { requestID: requestID }, // Match by requestID
      {
        $set: {
          status: status,
          dateApproved: dateApproved || new Date(),  // Default to current date if not provided
          approvedBy: approvedBy,
          comments: comments
        }
      },
      { new: true } // Return the updated document
    );

    // If no request is found, send a "Request not found" message
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Planting request updated successfully',
      updatedRequest
    });
  } catch (err) {
    console.error('Error updating planting request:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


// POST route to create a new notification
router.post('/notification', async (req, res) => {
  try {
    const { message, type } = req.body;

    // Validate the required fields
    if (!message || !type) {
      return res.status(400).json({ success: false, message: 'Message and type are required' });
    }

    // Create new notification document
    const newNotification = new Notification({
      message,
      type,
      date: new Date(), // This can also be optional as the schema already has a default value
    });

    // Save the notification to the database
    await newNotification.save();

    // Send response to the client
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: newNotification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//notification seen on the admin portal
router.get('/notification', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 }); // Get notifications sorted by date
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error('Error while fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Route to add land details to a farmer's record
router.post('/land-details', async (req, res) => {
  const { farmerID, landDetails } = req.body;

  if (!farmerID || !landDetails) {
      return res.status(400).json({ error: 'Farmer ID and land details are required' });
  }

  try {
      // Check if the landDetails object contains a landId (indicating it's an update)
      let updatedLandDetails;
      if (landDetails.landId) {
          updatedLandDetails = landDetails;
      } else {
          // If no landId, create a new one for the new land record
          updatedLandDetails = { ...landDetails, landId: Date.now().toString() };
      }

      // Find the farmer's secondary data
      let farmer = await FarmerSecondarySchema.findOne({ farmerID });

      if (!farmer) {
          // If farmer does not exist, create a new record with land details as an array
          farmer = new FarmerSecondarySchema({ farmerID, landDetails: [updatedLandDetails] });
      } else {
          // Check if landId exists in the landDetails array (for update)
          const existingLandIndex = farmer.landDetails.findIndex(land => land.landId === updatedLandDetails.landId);

          if (existingLandIndex === -1) {
              // If the landId doesn't exist, push the new land details to the array (add new record)
              farmer.landDetails.push(updatedLandDetails);
          } else {
              // If the landId exists, update the existing land record
              farmer.landDetails[existingLandIndex] = updatedLandDetails;
          }
      }

      await farmer.save();
      res.status(200).json({ message: 'Land details added or updated successfully', farmer });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/land-details/:farmerID", async (req, res) => {
  const { farmerID } = req.params;
  try {
    const farmer = await FarmerSecondarySchema.findOne({ farmerID });
    if (!farmer || !farmer.landDetails) {
      return res.status(404).json({ message: "No land details found." });
    }
    res.status(200).json({ landDetails: farmer.landDetails });
  } catch (error) {
    console.error("Error fetching land details:", error);
    res.status(500).json({ error: "Failed to fetch land details." });
  }
});

// Route to delete land details by farmerID and landId
router.delete('/land-details', async (req, res) => {
  const { farmerID, landId } = req.body;

  if (!farmerID || !landId) {
      return res.status(400).json({ error: 'Farmer ID and landId are required' });
  }

  try {
      // Find the farmer's secondary data
      let farmer = await FarmerSecondarySchema.findOne({ farmerID });

      if (!farmer) {
          return res.status(404).json({ error: 'Farmer not found' });
      }

      // Find the index of the land entry with the specified landId
      const landIndex = farmer.landDetails.findIndex(land => land.landId === landId);

      if (landIndex === -1) {
          return res.status(404).json({ error: 'Land detail not found' });
      }

      // Remove the land detail from the landDetails array
      farmer.landDetails.splice(landIndex, 1);

      // Save the updated farmer record
      await farmer.save();

      res.status(200).json({ message: 'Land details deleted successfully', farmer });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// Route: POST /register/update-social-info
router.post("/update-social-info", async (req, res) => {
  try {
    const { farmerID, familyMembers, familyIncome, primaryOccupation, secondaryOccupation } = req.body;

    if (!farmerID) {
      return res.status(400).json({ error: "Farmer ID is required." });
    }

    const updatedData = {
      familyMembers,
      familyIncome,
      primaryOccupation,
      secondaryOccupation,
    };

    // Update the farmer's social information if it exists, or create a new one
    const result = await FarmerSecondarySchema.findOneAndUpdate(
      { farmerID },
      { $set: { socialInformation: updatedData } }, // Updated field name
      { new: true, upsert: true } // `upsert` ensures a new document is created if it doesn't exist
    );

    res.status(200).json({ message: "Social and family details updated successfully", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route: GET /register/get-social-info/:farmerID
router.get("/get-social-info/:farmerID", async (req, res) => {
  try {
    const { farmerID } = req.params;

    if (!farmerID) {
      return res.status(400).json({ error: "Farmer ID is required." });
    }

    // Fetch the farmer's details
    const farmer = await FarmerSecondarySchema.findOne({ farmerID });

    if (!farmer) {
      return res.status(404).json({ error: "No farmer found for this Farmer ID." });
    }

    if (!farmer.socialInformation) {
      return res.status(404).json({ error: "No social information found for this Farmer ID." });
    }

    res.status(200).json({ socialInformation: farmer.socialInformation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to handle plantation plan recording
router.post('/record-plantation-plan', upload.single('demandLetter'), async (req, res) => {
  try {
    const {
      farmerID,
      treeType,
      pitsToDig,
      numberOfTrees,
      plannedAreaAcres,
      plannedAreaBigha,
      monitoringTreePlanting,
    } = req.body;

    // Validate required fields
    if (!farmerID || !treeType) {
      return res.status(400).json({ message: 'Farmer ID and Tree Type are required.' });
    }

    // Helper function to generate a unique Plan ID
    const generatePlanID = async () => {
      const latestFarmer = await FarmerSecondarySchema.findOne({ farmerID }).sort({ 'plantationPlans.planID': -1 });
      let lastPlanID = "P000";

      if (latestFarmer && latestFarmer.plantationPlans.length > 0) {
        const lastPlan = latestFarmer.plantationPlans.at(-1); // Get the last plan in the array
        lastPlanID = lastPlan.planID;
      }

      const nextID = parseInt(lastPlanID.substring(1)) + 1; // Extract numeric part, increment
      return `P${nextID.toString().padStart(3, '0')}`; // Format as P001, P002, etc.
    };

    const planID = await generatePlanID();

    // Find or create farmer record
    let farmer = await FarmerSecondarySchema.findOne({ farmerID });
    if (!farmer) {
      farmer = new FarmerSecondarySchema({ farmerID });
    }

    // Create a new plantation plan
    const newPlan = {
      planID,
      treeType,
      pitsToDig: pitsToDig || 0,
      numberOfTrees: numberOfTrees || 0,
      plannedAreaAcres: plannedAreaAcres || 0,
      plannedAreaBigha: plannedAreaBigha || 0,
      monitoringTreePlanting,
      demandLetter: req.file ? req.file.filename : null,
    };

    // Add to plantation plans array
    farmer.plantationPlans.push(newPlan);
    await farmer.save();

    return res.status(200).json({
      message: 'Plantation plan recorded successfully.',
      data: newPlan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while processing the plantation plan.',
      error: error.message,
    });
  }
});

//route for record planted tree
router.post('/record-tree-planted', async (req, res) => {
  try {
      const { farmerID, treeType, pitsDug, numberOfTrees, plantedAreaAcres, plantedAreaBigha, damageDetails } = req.body;

      if (!farmerID || !treeType) {
          return res.status(400).json({ message: 'Farmer ID and Tree Type are required.' });
      }

      let farmer = await FarmerSecondarySchema.findOne({ farmerID });

      if (!farmer) {
          return res.status(400).json({ message: 'Farmer not found.' });
      }

      const newTreePlan = {
        treeType,
          pitsDug,
          numberOfTrees,
          plantedAreaAcres,
          plantedAreaBigha,
          damageDetails
      }

      // Add to plantation plans array
      farmer.treesPlanted.push(newTreePlan);
      await farmer.save();
      return res.status(200).json({ message: 'Tree planting activity recorded successfully.' });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while processing tree planting.', error });
  }
});



module.exports = router;
