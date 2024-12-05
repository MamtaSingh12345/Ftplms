import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage';
import RegisterFarmerForm from './Components/Authentication/FarmerRegister';
import Login from './Components/Authentication/Login';
import ResetPassword from './Components/Authentication/ResetPassword';
import FarmerDashboard from './Components/FarmerDashboard/FarmerDashboard';
import FarmerProfile from './Components/FarmerDashboard/FarmerProfile';
import PlantingApplication from './Components/FarmerDashboard/PlantingApplicationForm ';
import WeatherPage from './Components/FarmerDashboard/WeatherPage';
import ViewProtectionPage from './Components/FarmerDashboard/ViewProtectionPage';
import AgroAdvisoryPage from './Components/FarmerDashboard/AgroAdvisoryPage';
import MakeCallPage from './Components/FarmerDashboard/MakeCallPage';
import AdminLogin from './Components/Authentication/AdminLogin';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import AdminPlantingRequests from './Components/AdminDashboard/Notifications';
import NotificationPage from './Components/FarmerDashboard/NotificationFarmer';
import ViewAssignedTasks from './Components/FarmerDashboard/ViewAssignedTasks.jsx';
import RecordPlantingActivity from './Components/FarmerDashboard/RecordPlantingActivity.jsx';
import TrainingAndResources from './Components/FarmerDashboard/TrainingAndResources.jsx';
import CarbonCreditsPage from './Components/FarmerDashboard/CarbonCreditsPage.jsx';
import SocialAndFamilyDetails from './Components/FarmerDashboard/SocialAndFamilyDetails.jsx';
import LandRecordsManagement from './Components/FarmerDashboard/LandRecordsManagement.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterFarmerForm/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard/>} />
          <Route path="/profile" element={<FarmerProfile/>} />
          <Route path="/planting-application" element={<PlantingApplication/>} />
          <Route path="/weather" element={<WeatherPage/>} />
          <Route path="/plant-protection" element={<ViewProtectionPage/>} />
          <Route path="/agro-advisory" element={<AgroAdvisoryPage/>} />
          <Route path="/make-a-call" element={<MakeCallPage/>} />
          <Route path="/admin-login" element={<AdminLogin/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          <Route path="/notifications" element={<AdminPlantingRequests/>} />
          <Route path="/farmer-notification" element={<NotificationPage/>} />
          <Route path="/assigned-tasks" element={<ViewAssignedTasks/>} />
          <Route path="/planting-activities" element={<RecordPlantingActivity />} />
          <Route path="/resources" element={<TrainingAndResources />} />
          <Route path="/carbon-credits" element={<CarbonCreditsPage />} />
          <Route path="/social-details" element={<SocialAndFamilyDetails />} />
          <Route path="/land-records" element={<LandRecordsManagement />} />




        </Routes>
      </div>
    </Router>
  );
}

export default App;