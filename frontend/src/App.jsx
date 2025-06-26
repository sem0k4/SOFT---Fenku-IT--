import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import CodeConfirmation from './pages/CodeConfirmation';
import NewPassword from './pages/NewPassword';
import PatientDashboard from './pages/PatientDashboard';
import LandingPage from './pages/LandingPage'; // Importer la nouvelle page
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Page d'accueil */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/code-confirmation" element={<CodeConfirmation />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
