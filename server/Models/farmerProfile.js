const mongoose = require('mongoose');

// Define the main schema for farmer's secondary data
const FarmerSecondarySchema = new mongoose.Schema({
    farmerID: { type: String, required: true },
    documents: {
        aadharScan: { type: String },
        voterScan: { type: String },
        farmerPhoto: { type: String }
    },
    landDetails: [
        {
            landId: { type: String, required: true }, // Unique ID for each land entry
            tollah: { type: String },
            village: { type: String },
            panchayat: { type: String },
            block: { type: String },
            district: { type: String },
            pinCode: { type: String },
            sizeInAcres: { type: Number },
            sizeInBigha: { type: Number },
            waterSource: { type: String },
            waterAvailability: { type: String },
            distanceFromWaterSource: { type: Number },
            description: { type: String },
        }
    ],
    // Social information (Family and Occupation details)
    socialInformation: {
        familyMembers: { type: Number, default: 0 },
        familyIncome: { type: String }, // You can change this to Number if needed
        primaryOccupation: { type: String },
        secondaryOccupation: { type: String },
    },
    plantationPlans: [
        {
          planID: { type: String, required: true },
          treeType: { type: String },
          pitsToDig: { type: Number },
          numberOfTrees: { type: Number },
          plannedAreaAcres: { type: Number },
          plannedAreaBigha: { type: Number },
          monitoringTreePlanting: { type: String },
          demandLetter: { type: String },
        },
      ],
      treesPlanted: [
        {
          treeType: { type: String },
          pitsDug: { type: Number },
          numberOfTrees: { type: Number },
          plantedAreaAcres: { type: Number },
          plantedAreaBigha: { type: Number },
          damageDetails: { type: String },
        },
      ],
}, { 
    collection: 'secondarydatas' 
});

module.exports = mongoose.model('FarmerSecondary', FarmerSecondarySchema);
