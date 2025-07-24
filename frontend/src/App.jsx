<<<<<<< HEAD
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import CodeConfirmation from './pages/CodeConfirmation';
import NewPassword from './pages/NewPassword';
import PatientDashboard from './pages/PatientDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

import Dashboard from './scenes/dashboard-patients';
import Teleconsultation from './scenes/teleconsultation';
import Documents from './scenes/documents';
import RDV from './scenes/rdv';
import Messagerie from './scenes/messagerie';
import Vaccination from './scenes/vaccination';
import IotFAJMA from './scenes/iot-fajma';
import Consultation from './scenes/consultation/';
import { useState } from 'react';
import DashboardLayout from './components/Layout/DashboardLayout';



function App() {

  const [ theme, colorMode ] = useMode();
  const [ isSidebar, setIsSidebar ] = useState(true);

  return (
    // Fournir le contexte de mode de couleur à l'ensemble de l'application
    <ColorModeContext.Provider value={colorMode}>
      {/* Le ThemeProvider applique le thème MUI à l'application */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Utilisation du Router pour gérer les routes de l'application */}
        {/* Routes définies pour l'application */}
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Page d'accueil */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/code-confirmation" element={<CodeConfirmation />} />
            <Route path="/new-password" element={<NewPassword />} />
            
            {/* Routes du dashboard patient */}
              <Route 
                path="/patient-dashboard" 
                element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
              />

            {/* Route protégée pour le tableau de bord des patients */}
            <Route path="/dashboard-patient" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard-patient/teleconsultation" element={<Teleconsultation />} />
              <Route path="/dashboard-patient/documents" element={<Documents />} />
              <Route path="/dashboard-patient/consultation" element={<Consultation />} />
              <Route path="/dashboard-patient/rdv" element={<RDV />} />
              <Route path="/dashboard-patient/messagerie" element={<Messagerie />} />
              <Route path="/dashboard-patient/vaccination" element={<Vaccination />} />
              <Route path="/dashboard-patient/iot-fajma" element={<IotFAJMA />} />
            </Route>
              
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import CodeConfirmation from './pages/CodeConfirmation';
import NewPassword from './pages/NewPassword';

import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

import Dashboard from './scenes/dashboard-patients';
import Teleconsultation from './scenes/teleconsultation';
import Documents from './scenes/documents';
import RDV from './scenes/rdv';
import Messagerie from './scenes/messagerie';
import Vaccination from './scenes/vaccination';
import IotFAJMA from './scenes/iot-fajma';
import Consultation from './scenes/consultation/';
import { useState } from 'react';
import DashboardLayout from './components/Layout/DashboardLayout';



function App() {

  const [ theme, colorMode ] = useMode();
  const [ isSidebar, setIsSidebar ] = useState(true);

  return (
    // Fournir le contexte de mode de couleur à l'ensemble de l'application
    <ColorModeContext.Provider value={colorMode}>
      {/* Le ThemeProvider applique le thème MUI à l'application */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Utilisation du Router pour gérer les routes de l'application */}
        {/* Routes définies pour l'application */}
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Page d'accueil */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/code-confirmation" element={<CodeConfirmation />} />
            <Route path="/new-password" element={<NewPassword />} />
            


            {/* Route protégée pour le tableau de bord des patients */}
            <Route path="/dashboard-patient" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard-patient/teleconsultation" element={<Teleconsultation />} />
              <Route path="/dashboard-patient/documents" element={<Documents />} />
              <Route path="/dashboard-patient/consultation" element={<Consultation />} />
              <Route path="/dashboard-patient/rdv" element={<RDV />} />
              <Route path="/dashboard-patient/messagerie" element={<Messagerie />} />
              <Route path="/dashboard-patient/vaccination" element={<Vaccination />} />
              <Route path="/dashboard-patient/iot-fajma" element={<IotFAJMA />} />
            </Route>
              
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import CodeConfirmation from './pages/CodeConfirmation';
import NewPassword from './pages/NewPassword';
import PatientDashboard from './pages/PatientDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './scenes/dashboard-patients';
// import Teleconsultation from './scenes/dashboard-patients/Teleconsultation';
// import Documents from './scenes/dashboard-patients/Documents';
// import Consultations from './scenes/dashboard-patients/Consultations';
// import RDV from './scenes/dashboard-patients/RDV';
// import Messagerie from './scenes/dashboard-patients/Messagerie';
// import Calendrier from './scenes/dashboard-patients/Calendrier';
// import IotFAJAM from './scenes/dashboard-patients/IotFAJAM';






function App() {

  const [ theme, colorMode ] = useMode();

  return (
    // Fournir le contexte de mode de couleur à l'ensemble de l'application
    <ColorModeContext.Provider value={colorMode}>
      {/* Le ThemeProvider applique le thème MUI à l'application */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Utilisation du Router pour gérer les routes de l'application */}
        {/* Routes définies pour l'application */}
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Page d'accueil */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/code-confirmation" element={<CodeConfirmation />} />
            <Route path="/new-password" element={<NewPassword />} />
            
            {/* Routes du dashboard patient */}
              <Route 
                path="/patient-dashboard" 
                element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
              />
                {/* Route protégée pour le tableau de bord des patients */}
              {/* <Route path="/teleconsultation" element={<Teleconsultation />} /> */}
              {/* <Route path="/documents" element={<Documents />} />  */}
              {/* <Route path="/consultations" element={<Consultations />} /> */}
              {/* <Route path="/rdv" element={<RDV />} /> */}
              {/* <Route path="/messagerie" element={<Messagerie />} /> */}
              {/* <Route path="/calendrier" element={<Calendrier />} /> */}
              {/* <Route path="/iot-fajam" element={<IotFAJAM />} /> */}


            <Route path="/dashboard-patient" element={<Dashboard />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
>>>>>>> 692b537 (debut conception dashboard patient)
>>>>>>> fc99c8a (debut conception dashboard patient)
