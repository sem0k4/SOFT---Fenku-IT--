import React from 'react';
import { Box, Typography, Grid, Button, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: '80px 0',
  backgroundColor: 'var(--white)',
}));

// Nous n'avons plus besoin de définir ImageContainer car nous utiliserons la classe css-6aj3wi

const IA = () => {
  return (
    <SectionContainer>
      <Grid container spacing={4} sx={{ px: { xs: 3, md: 8 } }}>
        {/* Image à gauche */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image="/images/ia.webp"
            alt="Intelligence artificielle pour l'analyse des données médicaux"
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        </Grid>
        {/* Texte à droite */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--dark-bleu-logo)' }}>
            Intelligence artificielle pour l'analyse des données médicaux.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: 'var(--gray)' }}>
            Nous développons notre modèle pour plusieurs avantages que nous peut vous offrir:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontSize: '1rem', color: 'var(--gray)', display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ color: 'var(--cyan-logo)', mr: 1, fontSize: '1.2rem' }}>•</Box>
              L'IA peut analyser de grandes quantités de données (imagerie médicale, tests sanguins) en quelques secondes, permettant une détection précoce de maladies comme le cancer, les maladies cardiovasculaires.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontSize: '1rem', color: 'var(--gray)', display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ color: 'var(--cyan-logo)', mr: 1, fontSize: '1.2rem' }}>•</Box>
              L'IA peut identifier des facteurs de risque et prédire l'apparition de maladies (diabète, Alzheimer, AVC) avant qu'elles ne se déclarent, permettant une intervention préventive.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontSize: '1rem', color: 'var(--gray)', display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ color: 'var(--cyan-logo)', mr: 1, fontSize: '1.2rem' }}>•</Box>
              Il réduit les erreurs de diagnostic et les interprétations subjectives grâce à une analyse objective des données.
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1rem', color: 'var(--gray)' }}>
            Malgré ses avantages, les défis que nous devons nous confronter sont majeures. De ce fait, nous l'imposons le respect conforme aux normes internationales et aux lois sénégalaises en matière de protection de données personnelles (Loi n° 2008-12 du 25 janvier 2008).
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: 'var(--bleu-logo)', 
                '&:hover': { backgroundColor: 'var(--dark-bleu-logo)' },
                mr: 2,
                px: 4
              }}
            >
              En savoir plus
            </Button>
          </Box>
        </Grid>
      </Grid>
    </SectionContainer>
  );
};

export default IA;