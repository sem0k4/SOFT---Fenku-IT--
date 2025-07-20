import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import logoImage from '../../../assets/Nditou_logosb.png'; // Import du logo

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0 4px 6px rgba(0, 150, 176, 0.05)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  zIndex: 40
}));

const LogoImage = styled('img')({
  width: '120px',
  height: 'auto',
  objectFit: 'contain'
});

// Boutons pour Espace patient et Se connecter
const PatientButton = styled(Button)(({ theme }) => ({
  color: '#0096b0',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem'
}));

const ConnectButton = styled(Button)(({ theme }) => ({
  color: '#0096b0',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem'
}));

function Header() {
  return (
    <StyledAppBar>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        py: 1.5, 
        px: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouterLink to="/">
            <LogoImage src={logoImage} alt="Nditou Logo" />
          </RouterLink>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', marginLeft: 'auto' }}>
          <PatientButton>Espace patient</PatientButton>
          <ConnectButton component={RouterLink} to="/login">Se connecter</ConnectButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;