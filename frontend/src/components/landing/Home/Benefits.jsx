import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DevicesIcon from '@mui/icons-material/Devices';
import { tokens } from '../../../theme';


const BenefitCard = styled(Paper)(({ theme }) => ({
  padding: '30px 20px',
  borderRadius: '12px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
  // backgroundColor: '#005a6a50',
  backgroundColor: '#fff',

}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'var(--light-gray)',
  borderRadius: '50%',
  width: '80px',
  height: '80px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
}));

const Benefits = () => {
  const benefits = [
    {
      icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: 'var(--bleu-logo)' }} />,
      title: 'Soins de qualité',
      description: 'Accédez à des soins de santé de qualité avec des professionnels qualifiés.'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: 'var(--bleu-logo)' }} />,
      title: 'Gain de temps',
      description: 'Réduisez les temps d\'attente et gérez vos rendez-vous efficacement.'
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40, color: 'var(--bleu-logo)' }} />,
      title: 'Accessibilité',
      description: 'Consultez depuis n\'importe où grâce à notre plateforme disponible sur tous vos appareils.'
    },
  ];

  const theme = useTheme()
  const colors = tokens(theme.palette.mode); 
  const backgroundColor = colors.primary[600]

  return (
    <Box sx={{ py: 8, px: { xs: 3, md: 8 }, backgroundColor: '#f8f9fa' }}>
      <Typography variant="h2" component="h2" align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--dark-bleu-logo)' }}>
        Nos avantages
      </Typography>
      <Typography 
        className='text-lg mb-10'
        variant="p" 
        align="center" 
        sx={{ mb: 6, maxWidth: '800px', mx: 'auto', color: 'var(--gray)' }}
      >
        Découvrez pourquoi FAJMA est la solution idéale pour vos besoins de santé
      </Typography>
      
      <Grid container spacing={4} sx={{ marginTop: '10px' }}>
        {benefits.map((benefit, index) => (
          <Grid 
            item 
            xs={12} 
            md={4} 
            key={index}
          >
            <BenefitCard theme={backgroundColor}>
              <IconWrapper>
                {benefit.icon}
              </IconWrapper>
              <Typography variant="h4" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'var(--bleu-logo)' }}>
                {benefit.title}
              </Typography>
              <Typography variant="body1" color="var(--dark-bleu-logo)" sx= {{ fontSize: '15px', fontWeight: 500 }}>
                {benefit.description}
              </Typography>
            </BenefitCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Benefits;