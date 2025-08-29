import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useTheme } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { tokens } from '../../theme';
import { Link } from 'react-router-dom';



export default function SidebarMobile() {
  const [open, setOpen] = React.useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box 
      className=""
      sx={{ 
        width: 250,
      }} 
      role="presentation" 
      onClick={toggleDrawer(false)}
    >
      <List>
        <Link 
            className={`flex flex-row items-center gap-3 w-full p-3 rounded-l-xl duration-300 hover:bg-[#0096b0]  group font-semibold`}
            to='/dashboard-patient'
            // onClick={() => setSelected(title)}
            style={{ 
                color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600]}`,
                textDecoration: "none",
                fontSize: "14px",
            }}
        >
            <AddAPhotoIcon />
            <span className={`group-hover:text-white `}>
                Dashboard
            </span>
        </Link>
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='lg:hidden block'>
      <Button onClick={toggleDrawer(true)}>
        <MenuOutlinedIcon
            sx={{ 
              cursor: 'pointer',
              color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.blackAccent[100]}`,
              fontSize: '28px',
            }} 
          />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
