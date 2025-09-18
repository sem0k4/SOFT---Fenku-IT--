import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';


export default function MenuNotifications() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); 
   


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
            margin: '0 -10px'
        }}
      >
        <NotificationsOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[700] }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ padding: '50px 30px' }}>Les notifications</MenuItem>
    </Menu>
    </div>
  );
}
