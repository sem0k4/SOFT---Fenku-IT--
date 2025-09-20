import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import Message from './Message';
import { messagesFictifs } from '../datasFictifs';

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
      {value === index && <Box sx={{ marginTop: '15px' }}>{children}</Box>}
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


export default function TabChat() {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode)  ;


  const allMessages = messagesFictifs;
  

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="w-fit">
      <Box 
        className="rounded-md"
        sx={{ 
          width: 'fit-content',
          backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#fcfcfc', 
          boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
          margin: '0 1rem',
        }}
      >
        <Tabs 
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered={true}
          sx={{
            padding: '0',
            height: 'fit-content',
          }}
        >
          <Tab 
            label="Tous" 
            {...a11yProps(0)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[300] : colors.blackAccent[900],
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                borderRadius: '4px',
                outline: 0,
                margin: '0',
               },
            }}
          />
          <Tab 
            label="Non lus" 
            {...a11yProps(1)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[300] : colors.blackAccent[900],
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                borderRadius: '4px',
                outline: 0,
                margin: '0',
               },
             }} 

          />
          <Tab 
            label="Favoris" 
            {...a11yProps(2)} 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected':{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[300] : colors.blackAccent[900],
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                borderRadius: '4px',
                outline: 0,
                margin: '0',
               },
             }} 
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* Tous les messages */}
        {allMessages.map((dataMessage) => (
            <Message
                id={dataMessage.id}
                name={dataMessage.sender.name}
                urlAvatar={dataMessage.sender.avatar}
                content={dataMessage.content}
                date={dataMessage.date}
            />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Messages non lus
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Messages mis en favoris
      </CustomTabPanel>
    </div>
  );
}
