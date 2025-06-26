import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: '80px 0',
  backgroundColor: 'var(--light-gray)',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const ObjectsFAJMA = () => {
  const features = [
    {
      title: 'Suivi de santé personnalisé',
      description: 'Suivez vos indicateurs de santé et recevez des recommandations personnalisées.',
      image: '/images/analyse-de-donnee.webp'
    },
    {
      title: 'Objets connectés',
      description: 'Connectez vos appareils IoT pour un suivi en temps réel de vos données de santé.',
      image: '/images/ordinateur-de-graphique-3d.webp'
    },
    {
      title: 'Alertes et notifications',
      description: 'Recevez des alertes importantes concernant votre santé et vos rendez-vous.',
      image: '/images/policyDatas.webp'
    },
    {
      title: 'Dossier médical électronique',
      description: 'Accédez à votre dossier médical complet à tout moment et en toute sécurité.',
      image: '/images/desktop.png'
    },
  ];

  return (
    <SectionContainer>
      <Box sx={{ px: { xs: 3, md: 8 } }}>
        <Typography variant="h3" component="h2" align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--dark-bleu-logo)' }}>
          Fonctionnalités FAJMA
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', color: 'var(--gray)' }}>
          Découvrez les outils innovants qui vous aident à prendre soin de votre santé
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard>
                <CardMedia
                  component="img"
                  height="180"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600, color: 'var(--bleu-logo)' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </SectionContainer>
  );
};

export default ObjectsFAJMA;