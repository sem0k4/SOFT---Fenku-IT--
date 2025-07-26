<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import { AppBar, Toolbar, Button, Box, Menu, IconButton, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import logoImage from '../../../assets/logo-fajma.png';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0 4px 6px rgba(0, 150, 176, 0.05)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  zIndex: 40
}));

const LogoImage = styled('img')({
  width: '120px',
  height: 'auto',
  objectFit: 'contain'
});

// Boutons pour Espace patient et Se connecter
const NavLink = styled(Button)(({ theme }) => ({
  color: '#0096b0',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem'
}));


function Header() {

  const [isToggle, setIsToggle] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        py: 1.5, 
        px: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouterLink to="/">
            <LogoImage src={logoImage} alt="Nditou Logo" />
          </RouterLink>
        </Box>
        
        <Box 
          sx={{ 
            display: {sm: 'flex', xs: 'none'}, 
            gap: 1.5, 
            alignItems: 'center', 
            marginLeft: 'auto' 
          }}
        >
          <NavLink component={RouterLink} to="/dashboard-patient">Espace patient</NavLink>
          <NavLink component={RouterLink} to="/login">Se connecter</NavLink>
        </Box>
        <Box
          sx={{ 
              display: { xs: 'flex', sm: 'none' },
              gap: 1.5, 
              alignItems: 'center', 
              marginLeft: 'auto',
              cursor: 'pointer',
            }}
        >
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuOutlinedIcon
                onClick={() => setIsToggle(!isToggle)}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: '28px',
                  color: '#0096b0',
                }} 
            />
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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <MenuItem onClick={handleClose}>
              <NavLink component={RouterLink} to="/dashboard-patient">Espace patient</NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink component={RouterLink} to="/login">Se connecter</NavLink>
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </StyledAppBar>
  );
}

=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import React from 'react';
import { AppBar, Toolbar, Button, Box, Menu, IconButton, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import logoImage from '../../../assets/logo-fajma.png';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0 4px 6px rgba(0, 150, 176, 0.05)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  zIndex: 40
}));

const LogoImage = styled('img')({
  width: '120px',
  height: 'auto',
  objectFit: 'contain'
});

// Boutons pour Espace patient et Se connecter
const NavLink = styled(Button)(({ theme }) => ({
  color: '#0096b0',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem'
}));


function Header() {

  const [isToggle, setIsToggle] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        py: 1.5, 
        px: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouterLink to="/">
            <LogoImage src={logoImage} alt="Nditou Logo" />
          </RouterLink>
        </Box>
        
        <Box 
          sx={{ 
            display: {sm: 'flex', xs: 'none'}, 
            gap: 1.5, 
            alignItems: 'center', 
            marginLeft: 'auto' 
          }}
        >
          <NavLink component={RouterLink} to="/dashboard-patient">Espace patient</NavLink>
          <NavLink component={RouterLink} to="/login">Se connecter</NavLink>
        </Box>
        <Box
          sx={{ 
              display: { xs: 'flex', sm: 'none' },
              gap: 1.5, 
              alignItems: 'center', 
              marginLeft: 'auto',
              cursor: 'pointer',
            }}
        >
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuOutlinedIcon
                onClick={() => setIsToggle(!isToggle)}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: '28px',
                  color: '#0096b0',
                }} 
            />
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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <MenuItem onClick={handleClose}>
              <NavLink component={RouterLink} to="/dashboard-patient">Espace patient</NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink component={RouterLink} to="/login">Se connecter</NavLink>
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </StyledAppBar>
  );
}

<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import logoImage from '../../../assets/logo-fajma.png';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0 4px 6px rgba(0, 150, 176, 0.05)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  zIndex: 40
}));

const LogoImage = styled('img')({
  width: '120px',
  height: 'auto',
  objectFit: 'contain'
});

// Boutons pour Espace patient et Se connecter
const NavLink = styled(Button)(({ theme }) => ({
  color: '#0096b0',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem'
}));


function Header() {
  return (
    <StyledAppBar>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        py: 1.5, 
        px: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouterLink to="/">
            <LogoImage src={logoImage} alt="Nditou Logo" />
          </RouterLink>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', marginLeft: 'auto' }}>
          <NavLink component={RouterLink} to="dashboard-patient">Espace patient</NavLink>
          <NavLink component={RouterLink} to="/login">Se connecter</NavLink>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

>>>>>>> 692b537 (debut conception dashboard patient)
>>>>>>> fc99c8a (debut conception dashboard patient)
export default Header;