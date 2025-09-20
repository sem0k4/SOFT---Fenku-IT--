import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import AuthService from '../../../services/auth';
import { useNavigate } from 'react-router-dom';
import { CiUser, CiSettings, CiLogout } from "react-icons/ci";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { tokens } from '../../../theme';



export default function MenuProfilePatient({ prenom, nom }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isAuthenticated = AuthService.isAuthenticated();
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Verifier si l'utilisateur est deja connecte avant de le connecter    
    if(isAuthenticated) await AuthService.logout();
    navigate('/login') // Redirigez vers la page de connexion
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar
            className="text-black shadow-sm font-semibold bg-transparent border border-black"
            alt={`${prenom} ${nom}`}
            src="/images/exemple_profile.webp"
            sx={{ width: 30, height: 30, marginLeft: '-15px' }}
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
            marginTop: '2px'
        }}
      >
        <Box className="flex flex-row gap-3 px-3 pb-1 items-center border-b">
            <Avatar
                className="text-black shadow-sm font-semibold bg-transparent border border-black"
                alt={`${prenom} ${nom}`}
                src="/images/exemple_profile.webp"
                sx={{ width: 30, height: 30 }}
            />
            <Box>
                <Typography variant='h6'>{prenom} {nom}</Typography>
                <Typography variant='p'>{prenom && 'Patient'}</Typography>
            </Box>
        </Box>
        <MenuItem 
            onClick={handleClose}
            className='flex flex-row gap-2'
            sx={{
                color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
            }}
        >
            <CiUser 
                className='text-lg text-gray-500' 
                style={{
                    color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
                }}
            />
            <span>Profile</span>
        </MenuItem>
        <MenuItem 
            onClick={handleClose}
            className='flex flex-row gap-2'
            sx={{
                color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
            }}
        >
            <IoChatbubbleOutline 
                className='text-lg text-gray-500' 
                style={{
                    color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
                }}
            />
            <span>Chat</span>
        </MenuItem>
        <MenuItem 
            onClick={handleClose}
            className='flex flex-row gap-2'
            sx={{
                color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
            }}
        >
            <IoIosHelpCircleOutline 
                className='text-lg text-gray-500' 
                style={{
                    color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
                }}
            />
            <span>Support</span>
        </MenuItem>
        <MenuItem 
            onClick={handleClose}
            className='flex flex-row gap-2'
            sx={{
                color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
            }}
        >
            <CiSettings 
                className='text-lg text-gray-500' 
                style={{
                    color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
                }}
            />
            <span>Paramètres</span>
        </MenuItem>
        <MenuItem 
            onClick={handleLogout} 
            className='flex flex-row gap-2'
            sx={{
                color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
            }}
        >
            <CiLogout 
                className='text-lg text-gray-500' 
                style={{
                    color: theme.palette.mode === 'dark' ? '#fcfcfc' : colors.blackAccent[500],
                }}
            />
            <span>Se déconnecter</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
