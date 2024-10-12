import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FarmerProfile = () => {
    const [farmerProfile, setFarmerProfile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [files, setFiles] = useState({});
    const [profile, setProfile] = useState({
        farmerName: "", // Set this from the fetched data
        contactNumber: "", // Set this from the fetched data
        aadharID: "", // Editable
        voterID: "", // Editable
        landInAcres: null,
        landInBigha: null,
        distanceFromWaterSource: null,
        village: "", // Editable
        gramPanchayat: "", // Editable
        block: "", // Editable
        district: "", // Editable
        state: "", // Editable
        country: "", // Editable
        pin: "", // Editable
        documents: {
            aadharScan: "",
            voterScan: "",
            farmerPhoto: ""
        }
    });

    useEffect(() => {
        const farmerID = localStorage.getItem('farmerID'); // Retrieve farmerID from localStorage
        console.log('Stored Farmer ID:', farmerID); // Log the farmerID for debugging
        if (farmerID) {
            fetchFarmerProfile(farmerID); // Fetch profile data if farmerID exists
        } else {
            setErrorMessage('Please log in to view your profile.');
        }
    }, []);
    

    const fetchFarmerProfile = async (farmerID) => {
        try {
            const response = await axios.get(`http://localhost:4000/register/fetch-profile/${farmerID}`);
            if (response.data.success) {
                setFarmerProfile(response.data.data); // Set profile data in state
                setProfile(prevProfile => ({
                    ...prevProfile,
                    farmerName: response.data.data.farmerName,
                    contactNumber: response.data.data.contactNumber,
                    aadharID: response.data.data.aadharID || "",
                    voterID: response.data.data.voterID || ""
                }));
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching farmer profile:', error);
            setErrorMessage('Error fetching profile. Please try again later.');
        }
    };

    const acresToBighas = (acres) => acres * 2.471;
    const bighasToAcres = (bighas) => bighas * 0.4047;


    const handleFileChange = (e) => {
      const { name, files: fileList } = e.target;
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: fileList,
      }));
    };
    

    const handleSaveProfile = async () => {
        
        try {
            let farmerID = localStorage.getItem('farmerID');
    
            if (!farmerID) {
                setErrorMessage('No farmer ID found in localStorage.');
                console.log('No farmerID in localStorage.');
                return;
            }
    
            farmerID = farmerID.trim();
    
            const addressDetails = {
                farmerID,
                address: {
                    village: profile.village,
                    gramPanchayat: profile.gramPanchayat,
                    block: profile.block,
                    district: profile.district,
                    state: profile.state,
                    country: profile.country,
                    pin: profile.pin
                }
            };
    
            // Update primary profile
            const primaryResponse = await axios.put(
                `http://localhost:4000/register/primary-profile/${farmerID}`,
                addressDetails
            );
    
            if (!primaryResponse.data.success) {
                setErrorMessage('Failed to update address details.');
                return;
            }

           
            const formData = new FormData();
            formData.append('farmerID', farmerID);
            formData.append('landInAcres', profile.landInAcres || "");
            formData.append('landInBigha', profile.landInBigha || "");
            formData.append('distanceFromWaterSource', profile.distanceFromWaterSource || "");
            formData.append('waterSourceType', profile.waterSourceType || "");
    
            // Append file inputs
            if (files.aadharScan) {
                formData.append('aadharScan', files.aadharScan[0]);
            }
            if (files.voterScan) {
                formData.append('voterScan', files.voterScan[0]);
            }
            if (files.farmerPhoto) {
                formData.append('farmerPhoto', files.farmerPhoto[0]);
            }
                
            // Update secondary profile
            const secondaryResponse = await axios.post(
                `http://localhost:4000/register/secondary-profile/${farmerID}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            if (!secondaryResponse.data.success) {
                setErrorMessage('Failed to update land details and documents.');
                return;
            }
    
            setErrorMessage('');
            alert('Profile updated successfully!');
    
        } catch (error) {
            console.error('Error saving profile data:', error.response ? error.response.data : error.message);
            setErrorMessage('Failed to update profile data. Please try again later.');
        }
    };
     

    
        return (
            <div style={{ background: 'rgb(99, 39, 120)', padding: '20px' }}>
                <div className="container rounded bg-white mt-5 mb-5">
                    <div className="row">
                        {/* Profile Image Section */}
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img
                                    className="rounded-circle mt-5"
                                    width="120px" // Reduced width
                                    src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                                    alt="Profile"
                                />
                                <span className="font-weight-bold">{profile.farmerName}</span>
                                <span className="text-black-50">{profile.contactNumber}</span>
                            </div>
                        </div>
    
                        {/* Profile Settings Section */}
                        <div className="col-md-6 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Profile Settings</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <label className="labels">Aadhaar ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.aadharID}
                                            onChange={(e) => setProfile({ ...profile, aadharID: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Voter ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.voterID}
                                            onChange={(e) => setProfile({ ...profile, voterID: e.target.value })}
                                        />
                                    </div>
                                </div>
    
                                {/* Distance from Water Source and Water Source Type */}
                                <div className="row mt-3">
                                    {/* Distance from Water Source */}
                                    <div className="col-md-6">
                                        <label className="labels">Distance From Water Source</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter distance from water source"
                                            value={profile.distanceFromWaterSource || ''}
                                            onChange={(e) => setProfile({ ...profile, distanceFromWaterSource: e.target.value })}
                                        />
                                    </div>

                                    {/* Water Source Type */}
                                    <div className="col-md-6">
                                        <label className="labels">Water Source Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter water source type"
                                            value={profile.waterSourceType || ''}
                                            onChange={(e) => setProfile({ ...profile, waterSourceType: e.target.value })}
                                        />
                                    </div>
                                </div>

    
                                {/* Land Size Row */}
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <label className="labels">Land Size (Acres)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="enter land size in acres"
                                            value={profile.landInAcres || ''}
                                            onChange={(e) => {
                                                const acres = e.target.value;
                                                setProfile({
                                                    ...profile,
                                                    landInAcres: acres,
                                                    landInBigha: acresToBighas(acres)
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Land Size (Bigha)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="enter land size in bigha"
                                            value={profile.landInBigha || ''}
                                            onChange={(e) => {
                                                const bighas = e.target.value;
                                                setProfile({
                                                    ...profile,
                                                    landInBigha: bighas,
                                                    landInAcres: bighasToAcres(bighas)
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
    
                                {/* Address Details in Two Columns */}
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <label className="labels">Village</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter village"
                                            value={profile.village}
                                            onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Gram Panchayat</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter gram panchayat"
                                            value={profile.gramPanchayat}
                                            onChange={(e) => setProfile({ ...profile, gramPanchayat: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Block</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter block"
                                            value={profile.block}
                                            onChange={(e) => setProfile({ ...profile, block: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">District</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter district"
                                            value={profile.district}
                                            onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">State</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter state"
                                            value={profile.state}
                                            onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter country"
                                            value={profile.country}
                                            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Pin Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter pin code"
                                            value={profile.pin}
                                            onChange={(e) => setProfile({ ...profile, pin: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Document Upload Section */}
                        <div className="col-md-3">
                            <div className="p-3 py-5">
                                <h4 className="text-right">Documents Upload</h4>
                                <div className="mb-3">
                                    <label className="labels">Upload Aadhaar Scan</label>
                                    <input type="file" className="form-control" name="aadharScan" onChange={handleFileChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="labels">Upload Voter Scan</label>
                                    <input type="file" className="form-control" name="voterScan" onChange={handleFileChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="labels">Upload Farmer Photo</label>
                                    <input type="file" className="form-control" name="farmerPhoto" onChange={handleFileChange} />
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Move Save Profile button below Document Upload section */}
                    <div style={{ marginBottom: '40px' }} className="mt-4 text-center">
                    <button className="btn btn-primary profile-button" onClick={handleSaveProfile}>
                        Save Profile
                    </button>
                    </div>
    
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                </div>
            </div>
        );
    };
    
    export default FarmerProfile;
    