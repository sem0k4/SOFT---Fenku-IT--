import { Box, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

function TimerRDV() {
  const [month, setMonth] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const targetDate = new Date('2025-08-05T10:00:00').getTime(); // Définir la date cible ici

  const formattedDate = new Date(targetDate).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  // console.log(formattedDate);
  

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        // Gérer la fin du compte à rebours ici
        setMonth(0)
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      setMonth(Math.floor(distance / (1000 * 60 * 60 * 24 * 30)));
      setDays(Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(interval); // Nettoyage lors du démontage du composant
  }, [targetDate]);

  return (
    <Box
      className={`flex flex-col items-center justify-center p-3 h-60 gap-4 rounded-lg my-8 w-full`} 
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
        display: 'flex',
        boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,                
      }}
    >
      <Typography 
        variant='h4'
        sx={{ 
          fontWeight: 500,
        }}
      >Prochain Rendez-vous</Typography>
      <Box className="flex flex-row gap-2">
        <TimerOutlinedIcon
          sx={{
            fontSize: "30px",
            fontWeight: 600,
            color: colors.secondary[400],
          }}
        />
        <Typography
          variant='h3'
          sx={{
            fontWeight: 600,
            marginTop: '2px',
          }}
        >
          <span className={`${month === 0 && 'hidden'}`}>{month}M </span>
          <span>{days}j </span>
          <span>{hours}h </span>
          <span>{minutes}m </span>
          <span className={`${month ==! 0 && 'hidden'}`}>{seconds}s</span>
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 600, 
          textAlign: "left",
          display: "flex",
          gap: '3px',
        }}
      >
        <span>Date : </span>
        <span style={{ color: colors.secondary[400] }}>{formattedDate}</span>
      </Typography>
    </Box>
  );
}

export default TimerRDV;