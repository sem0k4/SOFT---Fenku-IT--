import { Link } from "react-router-dom";
import Logo1FAJMA from "../../assets/logo-fajma.png";
import Logo2FAJMA from "../../assets/mini-logo-fajma.png";
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
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useState } from "react";
import { Box, IconButton } from "@mui/material";




const Item = ({ title, to, icon, selected, setSelected , isToggle}) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [ selected, setSelected ] = useState("Dashboard")
  // #0096b0

  return (
    <Link 
      className={`flex flex-row w-full py-3 px-3 rounded-l-xl ${isToggle ? 'gap-14' : 'gap-6'} duration-300 hover:bg-[#0096b0] ${selected === title && 'bg-[#0096b0]'} group font-semibold`}
      to={to}
      onClick={() => setSelected(title)}
      style={{ 
        color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600]}`,
        textDecoration: "none",
        fontSize: "14px",
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


const SidebarDashboard = () => {


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ isToggle, setIsToggle ] = useState(false)
  const [ selected, setSelected ] = useState("Dashboard")
  
  const isMobile = window.innerWidth <= 768;
  console.log(isMobile);
  
  // if (isMobile) {
  //   setIsToggle(true);
  // }

  // console.log(selected);
    
  
  return (
    <Box
      className={`sticky top-0 z-10 h-screen duration-300 ${isToggle ? 'w-20' : 'w-76'} dark:bg-cyan-950 bg-[#fcfcfc] overflow-hidden py-3`}
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc',
      }} 
    >
      <div 
        className={`flex ${isToggle ? 'flex-col' : 'flex-row'} gap-4 justify-between items-center px-6`}
      >
        <Link to="/">
          {isToggle 
          ? 
            <img
              className="w-28 h-fit"
              src={Logo2FAJMA}
              alt="E-FAJMA votre partenaire de sante"
            />
          :
            <img
              className="w-28 h-fit"
              src={Logo1FAJMA}
              alt="E-FAJMA votre partenaire de sante"
            />
          }
        </Link>
        <IconButton>
          <MenuOutlinedIcon 
            onClick={() => setIsToggle(!isToggle)}
            sx={{ 
              cursor: 'pointer',
              color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.blackAccent[100]}`,
              fontSize: '28px',
            }} 
          />
        </IconButton>
      </div>
      <div className={`flex flex-col pt-2 pl-3 items-start`}>
        <Item
          title="Dashboard"
          to="/dashboard-patient"
          icon={<HomeOutlinedIcon className={`group-hover:text-white ${selected === 'Dashboard' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Téléconsultation"
          to="/dashboard-patient/teleconsultation"
          icon={<VideoCameraFrontOutlinedIcon className={`group-hover:text-white ${selected === 'Téléconsultation' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Consultation"
          to="/dashboard-patient/consultation"
          icon={<ContactsOutlinedIcon className={`group-hover:text-white ${selected === 'Consultation' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Prendre RDV"
          to="/dashboard-patient/rdv"
          icon={<EditCalendarOutlinedIcon className={`group-hover:text-white ${selected === 'Prendre RDV' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Messagerie"
          to="/dashboard-patient/messagerie"
          icon={<ForumOutlinedIcon className={`group-hover:text-white ${selected === 'Messagerie' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Vaccination"
          to="/dashboard-patient/vaccination"
          icon={<VaccinesOutlinedIcon className={`group-hover:text-white ${selected === 'Vaccination' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Documents"
          to="/dashboard-patient/documents"
          icon={<FolderSharedOutlinedIcon className={`group-hover:text-white ${selected === 'Documents' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="FAJMA +"
          to="/dashboard-patient/iot-fajma"
          icon={<MedicalInformationOutlinedIcon className={`group-hover:text-white ${selected === 'FAJMA +' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </Box>
  )
}

export default SidebarDashboard;