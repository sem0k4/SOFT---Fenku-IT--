<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { CalendarMonthOutlined, Thermostat, TireRepair, VideoCameraFrontTwoTone } from '@mui/icons-material';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'background-image 1.2s ease-in-out',
  margin: 0,
  padding: 0,
  paddingTop: '76px', // Ajout d'un padding-top pour compenser la hauteur du header fixe
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  }
}));

const HeroContent = styled(Box)(({ theme, isActive }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  transform: 'translate(-50%, -50%)',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: { xs: '0 24px', sm: '0 80px' },
  opacity: isActive ? 1 : 0,
  transition: 'opacity 0.8s ease-in-out',
  transitionDelay: '0.3s',
  zIndex: 2,
  width: '100%',
  maxWidth: '1200px'
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: '8px',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
  }
}));

const IconStyle = {
  fontSize: '50px',
  color: '#1A8FC2', // darkBleuLogo
};

// Tableau des contenus de chaque animation avec les images spécifiées
const Sliders = [
  {
    image: './images/agent-de-sante.png',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          FAJMA votre plateforme de santé
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          En quelques clics, accéder à plusieurs services santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Consultation médicale
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Téléconsultation
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Prise de rendez-vous
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
  {
    image: './images/analyse-de-donnee.webp',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          Analyse de données médicales
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          Suivi personnalisé de vos indicateurs de santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Analyse prédictive
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Suivi en temps réel
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Historique médical
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
  {
    image: './images/ia-analyse-de-donnees-medicales.webp',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          Intelligence Artificielle médicale
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          Des algorithmes avancés au service de votre santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Diagnostic assisté
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Recommandations personnalisées
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Prévention santé
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
];

function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [slideTransition, setSlideTransition] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideTransition(true);
      setTimeout(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % Sliders.length);
        setSlideTransition(false);
      }, 1000);
    }, 7000); // Augmentation du temps entre les transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <HeroContainer sx={{
      backgroundImage: `url(${Sliders[currentImage].image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <HeroContent isActive={!slideTransition} className={slideTransition ? 'slide-transition' : ''}>
        {Sliders[currentImage].content}
      </HeroContent>
    </HeroContainer>
  );
}

=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { CalendarMonthOutlined, Thermostat, TireRepair, VideoCameraFrontTwoTone } from '@mui/icons-material';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'background-image 1.2s ease-in-out',
  margin: 0,
  padding: 0,
  paddingTop: '76px', // Ajout d'un padding-top pour compenser la hauteur du header fixe
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  }
}));

const HeroContent = styled(Box)(({ theme, isActive }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  transform: 'translate(-50%, -50%)',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: { xs: '0 24px', sm: '0 80px' },
  opacity: isActive ? 1 : 0,
  transition: 'opacity 0.8s ease-in-out',
  transitionDelay: '0.3s',
  zIndex: 2,
  width: '100%',
  maxWidth: '1200px'
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: '8px',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
  }
}));

const IconStyle = {
  fontSize: '50px',
  color: '#1A8FC2', // darkBleuLogo
};

// Tableau des contenus de chaque animation avec les images spécifiées
const Sliders = [
  {
    image: './images/agent-de-sante.png',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          FAJMA votre plateforme de santé
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          En quelques clics, accéder à plusieurs services santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Consultation médicale
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Téléconsultation
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Prise de rendez-vous
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
  {
    image: './images/analyse-de-donnee.webp',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          Analyse de données médicales
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          Suivi personnalisé de vos indicateurs de santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Analyse prédictive
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Suivi en temps réel
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Historique médical
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
  {
    image: './images/ia-analyse-de-donnees-medicales.webp',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          Intelligence Artificielle médicale
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          Des algorithmes avancés au service de votre santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Diagnostic assisté
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Recommandations personnalisées
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Prévention santé
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
];

function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [slideTransition, setSlideTransition] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideTransition(true);
      setTimeout(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % Sliders.length);
        setSlideTransition(false);
      }, 1000);
    }, 7000); // Augmentation du temps entre les transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <HeroContainer sx={{
      backgroundImage: `url(${Sliders[currentImage].image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <HeroContent isActive={!slideTransition} className={slideTransition ? 'slide-transition' : ''}>
        {Sliders[currentImage].content}
      </HeroContent>
    </HeroContainer>
  );
}

<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { CalendarMonthOutlined, Thermostat, TireRepair, VideoCameraFrontTwoTone } from '@mui/icons-material';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'background-image 1.2s ease-in-out',
  margin: 0,
  padding: 0,
  paddingTop: '76px', // Ajout d'un padding-top pour compenser la hauteur du header fixe
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  }
}));

const HeroContent = styled(Box)(({ theme, isActive }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: { xs: '0 24px', sm: '0 80px' },
  opacity: isActive ? 1 : 0,
  transition: 'opacity 0.8s ease-in-out',
  transitionDelay: '0.3s',
  zIndex: 2,
  width: '100%',
  maxWidth: '1200px'
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: '8px',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
  }
}));

const IconStyle = {
  fontSize: '50px',
  color: '#1A8FC2', // darkBleuLogo
};

// Tableau des contenus de chaque animation avec les images spécifiées
const Sliders = [
  {
    image: './images/agent-de-sante.png',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          FAJMA votre plateforme de santé
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          En quelques clics, accéder à plusieurs services santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Consultation médicale
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Téléconsultation
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Prise de rendez-vous
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
  {
    image: './images/analyse-de-donnee.webp',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          Analyse de données médicales
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          Suivi personnalisé de vos indicateurs de santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Analyse prédictive
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Suivi en temps réel
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Historique médical
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
  {
    image: './images/ia-analyse-de-donnees-medicales.webp',
    content: (
      <>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', color: '#1BB5FB' }}>
          Intelligence Artificielle médicale
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: 'white', maxWidth: '1000px', mx: 'auto', mt: 1 }}>
          Des algorithmes avancés au service de votre santé
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4, px: { lg: 7 } }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <MedicalServicesIcon sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Diagnostic assisté
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <VideoCameraFrontTwoTone sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Recommandations personnalisées
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CalendarMonthOutlined sx={IconStyle} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                Prévention santé
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </>
    )
  },
];

function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [slideTransition, setSlideTransition] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideTransition(true);
      setTimeout(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % Sliders.length);
        setSlideTransition(false);
      }, 1000);
    }, 7000); // Augmentation du temps entre les transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <HeroContainer sx={{
      backgroundImage: `url(${Sliders[currentImage].image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <HeroContent isActive={!slideTransition} className={slideTransition ? 'slide-transition' : ''}>
        {Sliders[currentImage].content}
      </HeroContent>
    </HeroContainer>
  );
}

>>>>>>> 692b537 (debut conception dashboard patient)
>>>>>>> fc99c8a (debut conception dashboard patient)
export default HeroSection;