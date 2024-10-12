import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage';
import RegisterFarmerForm from './Components/Authentication/FarmerRegister';
import Login from './Components/Authentication/Login';
import ResetPassword from './Components/Authentication/ResetPassword';
import FarmerDashboard from './Components/FarmerDashboard/FarmerDashboard';
import FarmerProfile from './Components/FarmerDashboard/FarmerProfile';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;