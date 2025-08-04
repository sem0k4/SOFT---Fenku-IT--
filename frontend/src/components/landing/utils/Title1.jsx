<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import React from 'react';
=======
  import React from 'react';
>>>>>>> 4acefeb (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  justifyContent: 'flex-start',
  alignItems: { xs: 'center', md: 'flex-start' },
  marginTop: '40px',
  marginBottom: '16px',
  padding: { xs: '0 24px', md: '0 56px' },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
  fontWeight: 600,
  color: 'rgba(0, 0, 0, 0.8)',
  textAlign: { xs: 'center', md: 'left' },
}));

const TitleUnderline = styled(Box)(({ theme }) => ({
  width: '80px',
  borderBottom: '4px solid #1BB5FB', // bleuLogo
}));

export default function Title1({ children }) {
  return (
    <TitleContainer>
      <TitleText>{children}</TitleText>
      <TitleUnderline />
    </TitleContainer>
  );
<<<<<<< HEAD
=======
import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  justifyContent: 'flex-start',
  alignItems: { xs: 'center', md: 'flex-start' },
  marginTop: '40px',
  marginBottom: '16px',
  padding: { xs: '0 24px', md: '0 56px' },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
  fontWeight: 600,
  color: 'rgba(0, 0, 0, 0.8)',
  textAlign: { xs: 'center', md: 'left' },
}));

const TitleUnderline = styled(Box)(({ theme }) => ({
  width: '80px',
  borderBottom: '4px solid #1BB5FB', // bleuLogo
}));

export default function Title1({ children }) {
  return (
    <TitleContainer>
      <TitleText>{children}</TitleText>
      <TitleUnderline />
    </TitleContainer>
  );
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
}