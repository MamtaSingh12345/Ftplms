import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecordPlantationPlan = () => {
  const [formData, setFormData] = useState({
    treeType: '',
    pitsToDig: '',
    numberOfTrees: '',
    plannedAreaAcres: '',
    plannedAreaBigha: '',
    monitoringTreePlanting: '',
    demandLetter: null,
  });

  const [treePlantingData, setTreePlantingData] = useState({
    treeType: '',
    pitsDug: '',
    numberOfTrees: '',
    plantedAreaAcres: '',
    plantedAreaBigha: '',
    damageDetails: '',
  });

  const [farmerID, setFarmerID] = useState('');

  // Fetch farmerID from localStorage on component mount
  useEffect(() => {
    const storedFarmerID = localStorage.getItem('farmerID');
    if (storedFarmerID) {
      setFarmerID(storedFarmerID);
      setTreePlantingData((prevState) => ({
        ...prevState,
        farmerID: storedFarmerID, // Ensure farmerID is set when available
      }));
    } else {
      console.error('Farmer ID not found in localStorage.');
    }
  }, []);

  // Convert between Acres and Bigha
  const convertBighaToAcres = (bigha) => {
    return bigha * 0.4; // 1 Bigha = 0.4 Acres (assuming this conversion ratio)
  };

  const convertAcresToBigha = (acres) => {
    return acres * 2.5; // 1 Acre = 2.5 Bigha (assuming this conversion ratio)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle changes in Plantation Plan Form
    if (name === 'plannedAreaAcres' && value) {
      const acres = parseFloat(value);
      setFormData({
        ...formData,
        plannedAreaAcres: acres,
        plannedAreaBigha: convertAcresToBigha(acres).toFixed(2), // Update Bigha field when Acres is changed
      });
    } else if (name === 'plannedAreaBigha' && value) {
      const bigha = parseFloat(value);
      setFormData({
        ...formData,
        plannedAreaBigha: bigha,
        plannedAreaAcres: convertBighaToAcres(bigha).toFixed(2), // Update Acres field when Bigha is changed
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Handle changes in Tree Plantation Form
    if (name === 'plantedAreaAcres' && value) {
      const acres = parseFloat(value);
      setTreePlantingData({
        ...treePlantingData,
        plantedAreaAcres: acres,
        plantedAreaBigha: convertAcresToBigha(acres).toFixed(2), // Update Bigha field when Acres is changed
      });
    } else if (name === 'plantedAreaBigha' && value) {
      const bigha = parseFloat(value);
      setTreePlantingData({
        ...treePlantingData,
        plantedAreaBigha: bigha,
        plantedAreaAcres: convertBighaToAcres(bigha).toFixed(2), // Update Acres field when Bigha is changed
      });
    } else {
      setTreePlantingData({ ...treePlantingData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, demandLetter: e.target.files[0] });
  };

  const handleSubmitPlantationPlan = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append('farmerID', farmerID);

    try {
      const response = await axios.post('http://localhost:4000/register/record-plantation-plan', data);
      alert(response.data.message);
    } catch (error) {
      console.error('Error recording plantation plan:', error);
      alert(error.response?.data?.message || 'Failed to record plantation plan.');
    }
  };

  const handleSubmitTreePlantingRecord = async (e) => {
    e.preventDefault();

    if (!farmerID) {
      alert("Farmer ID is missing. Please log in again.");
      return;
    }

    if (!treePlantingData.treeType) {
      alert("Tree Type is required.");
      return;
    }

    const data = { ...treePlantingData, farmerID }; // Attach farmerID manually

    try {
      const response = await axios.post(
        "http://localhost:4000/register/record-tree-planted",
        data
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error recording tree planting record:", error);
      alert(error.response?.data?.message || "Failed to record tree planting record.");
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmitPlantationPlan} encType="multipart/form-data" className="mt-5">
        <h2>Record Plantation Plan</h2>
        <div className="form-group">
          <label>Tree Type:</label>
          <input
            type="text"
            className="form-control"
            name="treeType"
            value={formData.treeType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Pits to Dig:</label>
          <input
            type="number"
            className="form-control"
            name="pitsToDig"
            value={formData.pitsToDig}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Number of Trees:</label>
          <input
            type="number"
            className="form-control"
            name="numberOfTrees"
            value={formData.numberOfTrees}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Planned Area (Acres):</label>
          <input
            type="number"
            className="form-control"
            name="plannedAreaAcres"
            value={formData.plannedAreaAcres}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Planned Area (Bigha):</label>
          <input
            type="number"
            className="form-control"
            name="plannedAreaBigha"
            value={formData.plannedAreaBigha}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Monitoring Tree Planting:</label>
          <input
            type="text"
            className="form-control"
            name="monitoringTreePlanting"
            value={formData.monitoringTreePlanting}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Demand Letter:</label>
          <input
            type="file"
            className="form-control-file"
            name="demandLetter"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Plantation Plan</button>
      </form>

      <form onSubmit={handleSubmitTreePlantingRecord} className="mt-5">
        <h2>Record Tree Planting</h2>
        <div className="form-group">
          <label>Tree Type:</label>
          <input
            type="text"
            className="form-control"
            name="treeType"
            value={treePlantingData.treeType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Pits Dug:</label>
          <input
            type="number"
            className="form-control"
            name="pitsDug"
            value={treePlantingData.pitsDug}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Number of Trees:</label>
          <input
            type="number"
            className="form-control"
            name="numberOfTrees"
            value={treePlantingData.numberOfTrees}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Planted Area (Acres):</label>
          <input
            type="number"
            className="form-control"
            name="plantedAreaAcres"
            value={treePlantingData.plantedAreaAcres}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Planted Area (Bigha):</label>
          <input
            type="number"
            className="form-control"
            name="plantedAreaBigha"
            value={treePlantingData.plantedAreaBigha}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Damage Details:</label>
          <textarea
            className="form-control"
            name="damageDetails"
            value={treePlantingData.damageDetails}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Tree Planting Record</button>
      </form>
    </div>
  );
};

export default RecordPlantationPlan;
