import { Box, Typography, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

function timerRDV(formattedDate, dateRDV) {
  const [month, setMonth] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const targetDate = new Date('2025-08-15T14:00:00').getTime(); // Définir la date cible ici

  formattedDate = new Date(targetDate).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  // console.log(formattedDate);
  dateRDV = {month, days, hours, minutes,seconds}
  

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

  return { formattedDate, dateRDV };

}

export default timerRDV;