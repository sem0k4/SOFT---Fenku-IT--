import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
// import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { Link } from 'react-router-dom';
import Logo1FAJMA from "../../assets/logo-fajma.png";



const Item = ({ title, to, icon, selected, setSelected , isToggle}) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Link 
      className={`flex flex-row w-full py-2.5 px-2 rounded-l-xl ${isToggle ? 'gap-14' : 'gap-6'} duration-300 hover:bg-[#0096b0] ${selected === title && 'bg-[#0096b0]'} group font-semibold`}
      to={to}
      onClick={() => setSelected(title)}
      style={{ 
        color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[500]}`,
        textDecoration: "none",
        fontSize: "13px",
      }}
    >
      {icon}
      <span 
        className={`group-hover:text-white ${selected === title && 'text-white'}  ${isToggle ? '-translate-x-2' : 'translate-x-2'}`}
        style={{
          display: `${isToggle ? 'none' : 'block'}`
        }}
      >
        {title}
      </span>
    </Link>
  )
}


export default function SidebarMobile() {
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ isToggle, setIsToggle ] = useState(false)
  const [ selected, setSelected ] = useState("Dashboard")

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box 
      className="pl-4"
      sx={{ 
        width: 250,
      }} 
      role="presentation" 
      onClick={toggleDrawer(false)}
    >
      <List 
        sx={{ 
          marginTop: 2, 
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900],
        }}
      >
        <Link to="/">
            <img
              className="w-28 h-fit"
              src={Logo1FAJMA}
              alt="E-FAJMA votre partenaire de sante"
            />
        </Link>
      </List>
      <List>
        <Item
          title="Dashboard"
          to="/dashboard-patient"
          icon={<HomeOutlinedIcon className={`group-hover:text-white ${selected === 'Dashboard' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="Téléconsultation"
          to="/dashboard-patient/teleconsultation"
          icon={<VideoCameraFrontOutlinedIcon className={`group-hover:text-white ${selected === 'Téléconsultation' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="Consultation"
          to="/dashboard-patient/consultation"
          icon={<ContactsOutlinedIcon className={`group-hover:text-white ${selected === 'Consultation' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="Prendre RDV"
          to="/dashboard-patient/rdv"
          icon={<EditCalendarOutlinedIcon className={`group-hover:text-white ${selected === 'Prendre RDV' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="Messagerie"
          to="/dashboard-patient/messagerie"
          icon={<ForumOutlinedIcon className={`group-hover:text-white ${selected === 'Messagerie' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="Vaccination"
          to="/dashboard-patient/vaccination"
          icon={<VaccinesOutlinedIcon className={`group-hover:text-white ${selected === 'Vaccination' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="Documents"
          to="/dashboard-patient/documents"
          icon={<FolderSharedOutlinedIcon className={`group-hover:text-white ${selected === 'Documents' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
      <List>
        <Item
          title="FAJMA +"
          to="/dashboard-patient/iot-fajma"
          icon={<MedicalInformationOutlinedIcon className={`group-hover:text-white ${selected === 'FAJMA +' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
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