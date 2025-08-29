<<<<<<< HEAD
import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Email, Facebook, Instagram, MapsHomeWork, Phone, X } from '@mui/icons-material';
import LogoFenku from '../../../assets/Logo_fenku.png';
import NditouLogo from '../../../assets/logo-fajma.png';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)', // Même couleur que le header
  color: '#0096b0', // Couleur du texte adaptée au fond clair
  boxShadow: '0 -4px 6px rgba(0, 150, 176, 0.05)', // Ombre inversée par rapport au header
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#0096b0', // Couleur adaptée au fond clair
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  '&:hover': {
    color: '#007a8f', // Version plus foncée au survol
  },
  transition: 'all 0.3s',
}));

const CopyrightContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Légèrement plus opaque que le footer principal
  padding: '24px 0',
  borderTop: '1px solid rgba(0, 150, 176, 0.1)', // Bordure adaptée
}));

function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 6 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <img src={NditouLogo} alt="Nditou Logo" style={{ height: '40px' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#0096b0', mb: 3, textAlign: 'left' }}>
              Plateforme de santé connectée pour une meilleure prise en charge des patients.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FooterLink href="tel:+237123456789">
                <Phone fontSize="small" /> 33 333 33 33
              </FooterLink>
              <FooterLink href="mailto:contact@fajma.com">
                <Email fontSize="small" /> contact@fajma-it.com
              </FooterLink>
              <FooterLink href="#">
                <MapsHomeWork fontSize="small" /> Dakar, Sénégal
              </FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'left' }}>
              Liens utiles
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FooterLink href="#">Accueil</FooterLink>
              <FooterLink href="#">Services</FooterLink>
              <FooterLink href="#">À propos</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'left' }}>
              Suivez-nous
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FooterLink href="https://www.facebook.com" target="_blank">
                <Facebook />
              </FooterLink>
              <FooterLink href="https://www.twitter.com" target="_blank">
                <X />
              </FooterLink>
              <FooterLink href="https://www.instagram.com" target="_blank">
                <Instagram />
              </FooterLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <CopyrightContainer>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#0096b0' }}>© 2025 by FAJMA. Build by</Typography>
            <Link href="/" sx={{ display: 'flex', alignItems: 'center', color: '#0096b0' }}>
              <img src={LogoFenku} alt="Logo Fenku" style={{ height: '30px', marginLeft: '5px' }} />
            </Link>
          </Box>
        </Container>
      </CopyrightContainer>
    </FooterContainer>
  );
}

=======
import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Email, Facebook, Instagram, MapsHomeWork, Phone, X } from '@mui/icons-material';
import LogoFenku from '../../../assets/Logo_fenku.png';
import NditouLogo from '../../../assets/logo-fajma.png';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)', // Même couleur que le header
  color: '#0096b0', // Couleur du texte adaptée au fond clair
  boxShadow: '0 -4px 6px rgba(0, 150, 176, 0.05)', // Ombre inversée par rapport au header
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#0096b0', // Couleur adaptée au fond clair
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  '&:hover': {
    color: '#007a8f', // Version plus foncée au survol
  },
  transition: 'all 0.3s',
}));

const CopyrightContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Légèrement plus opaque que le footer principal
  padding: '24px 0',
  borderTop: '1px solid rgba(0, 150, 176, 0.1)', // Bordure adaptée
}));

function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 6 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <img src={NditouLogo} alt="Nditou Logo" style={{ height: '40px' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#0096b0', mb: 3, textAlign: 'left' }}>
              Plateforme de santé connectée pour une meilleure prise en charge des patients.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FooterLink href="tel:+237123456789">
                <Phone fontSize="small" /> 33 333 33 33
              </FooterLink>
              <FooterLink href="mailto:contact@fajma.com">
                <Email fontSize="small" /> contact@fajma-it.com
              </FooterLink>
              <FooterLink href="#">
                <MapsHomeWork fontSize="small" /> Dakar, Sénégal
              </FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'left' }}>
              Liens utiles
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FooterLink href="#">Accueil</FooterLink>
              <FooterLink href="#">Services</FooterLink>
              <FooterLink href="#">À propos</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'left' }}>
              Suivez-nous
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FooterLink href="https://www.facebook.com" target="_blank">
                <Facebook />
              </FooterLink>
              <FooterLink href="https://www.twitter.com" target="_blank">
                <X />
              </FooterLink>
              <FooterLink href="https://www.instagram.com" target="_blank">
                <Instagram />
              </FooterLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <CopyrightContainer>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#0096b0' }}>© 2025 by FAJMA. Build by</Typography>
            <Link href="/" sx={{ display: 'flex', alignItems: 'center', color: '#0096b0' }}>
              <img src={LogoFenku} alt="Logo Fenku" style={{ height: '30px', marginLeft: '5px' }} />
            </Link>
          </Box>
        </Container>
      </CopyrightContainer>
    </FooterContainer>
  );
}

>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
export default Footer;