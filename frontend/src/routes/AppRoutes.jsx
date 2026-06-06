import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import UploadData from '../pages/UploadData';
import Forecast from '../pages/Forecast';
import RiskAnalysis from '../pages/RiskAnalysis';
import Recommendations from '../pages/Recommendations';
import Reports from '../pages/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadData />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/risk" element={<RiskAnalysis />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
};

export default AppRoutes;
