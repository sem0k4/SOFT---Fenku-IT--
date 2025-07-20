import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Menubar from '../components/dashboard-patient/Menubar';
// import { styled } from '@mui/material';



const PatientDashboard2 = () => {
    return (
        <div>
            <Header />
            <Menubar />
            <Footer />
        </div>
    );
};

export default PatientDashboard2;