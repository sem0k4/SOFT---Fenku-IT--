import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import ParamsHealth from './ParamsHealth';
import RecentsConsultations from './RecentsConsultations';
import DatasVitals from './DatasVitals';
import ReminderMedication from './ReminderMedication';
import AdvicesMedications from './AdvicesMedications';
import { getAllRendezVous } from '../services/consultations&RDV';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ marginTop: '30px' }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function NavSub() {
  const [value, setValue] = React.useState(0);

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const { allRendezVous } = getAllRendezVous();
  
  // lastRDV pour recuperer les trois dernieres rdv 
  // que nous devons trier d'abord en fonction de la date de consultation
  const lastRDV = allRendezVous.slice(-3)
  
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box 
        className="rounded-md"
        sx={{ 
          width: 'fit-content',
          backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
          boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
        }}
      >
        <Tabs 
          className='px-3'
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            padding: '0'
          }}
        >
          <Tab 
            label="Résumé" 
            {...a11yProps(0)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: colors.blackAccent[900],
                borderRadius: '4px',
                margin: '0',
               },
               '& .MuiTabs-indicator':{
                color: 'red'
               }
            }}
          />
          <Tab 
            label="Vitales" 
            {...a11yProps(1)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: colors.blackAccent[900],
                borderRadius: '4px',
                margin: '0',
               }
             }} 

          />
          <Tab 
            label="Prescriptions" 
            {...a11yProps(2)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: colors.blackAccent[900],
                borderRadius: '4px',
                margin: '0',
               }
             }} 
          />
          <Tab 
            label="Dossiers" 
            {...a11yProps(3)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: colors.blackAccent[900],
                borderRadius: '4px',
                margin: '0',
               } 
            }} 
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box className="flex md:flex-row flex-col items-start gap-4">
            <ParamsHealth />
            <RecentsConsultations recentsRDV={lastRDV} />
        </Box>
        <DatasVitals />
        <Box className="flex md:flex-row flex-col items-start gap-4">
            <ReminderMedication />
            <AdvicesMedications />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Donnees vitales
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Prescriptions
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Dossiers
      </CustomTabPanel>
    </Box>
  );
}
