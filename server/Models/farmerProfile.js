const mongoose = require('mongoose');

const FarmerSecondarySchema = new mongoose.Schema({
    farmerID: { type: String, required: true },
    landInAcres: { type: Number },
    landInBigha: { type: Number },
    distanceFromWaterSource: { type: Number },
    waterSourceType: { type: String },
    documents: {
        aadharScan: { type: String },
        voterScan: { type: String },
        farmerPhoto: { type: String }
    }
},{ 
    collection: 'secondarydatas'
 }
);

module.exports = mongoose.model('FarmerSecondary', FarmerSecondarySchema);
