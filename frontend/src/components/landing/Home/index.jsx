import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './HeroSection';
import Benefits from './Benefits';
import IA from './IA';
import ObjectsFAJMA from './ObjectsFAJMA';

function Home() {
  return (
    <Box component="main" sx={{ width: '100%', overflow: 'hidden' }}>
      <HeroSection />
      <Benefits />
      <IA />
      <ObjectsFAJMA />
    </Box>
  );
}

export default Home;