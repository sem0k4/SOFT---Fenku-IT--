import { Link, useNavigate } from "react-router-dom";
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
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import AuthService from "../../services/auth";




const Item = ({ title, to, icon, selected, setSelected , isToggle}) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [ selected, setSelected ] = useState("Dashboard")
  // #0096b0

  return (
    <Link 
      className={`flex flex-row w-full py-2.5 px-2 rounded-l-xl ${isToggle ? 'gap-14' : 'gap-6'} duration-300 hover:bg-[#0096b0] ${selected === title && 'bg-[#0096b0]'} group font-semibold`}
      to={to}
      onClick={() => setSelected(title)}
      style={{ 
        color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600]}`,
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


const SidebarDesktop = () => {


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ isToggle, setIsToggle ] = useState(false)
  const [ selected, setSelected ] = useState("Dashboard")
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        await AuthService.logout();
        navigate('/login');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // Même en cas d'erreur, on déconnecte localement
        navigate('/login');
      }
    }
  };
  
  // if (isMobile) {
  //   setIsToggle(true);
  // }

  // console.log(selected);
    
  
  return (
    <Box
      className={`sticky border-r lg:block hidden top-0 z-10 h-screen duration-300 ${isToggle ? 'w-20' : 'w-76'} dark:bg-cyan-950 bg-[#fcfcfc] overflow-hidden py-3 flex flex-col`}
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc',
        borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
      }} 
    >
      <div 
        className={`flex ${isToggle ? 'flex-col' : 'flex-row'} gap-4 justify-between items-center px-6`}
      >
        <div 
          onClick={() => navigate('/dashboard-patient')} 
          className="flex items-center transition-all duration-300 hover:opacity-80 hover:scale-105" 
          style={{ cursor: 'pointer' }} 
          title="Retour à l'accueil du tableau de bord"
        >
          {isToggle 
          ? 
            <div className="relative">
              <img
                className="w-28 h-fit"
                src={Logo2FAJMA}
                alt="E-FAJMA votre partenaire de sante"
              />

            </div>
          :
            <div className="relative">
              <img
                className="w-28 h-fit"
                src={Logo1FAJMA}
                alt="E-FAJMA votre partenaire de sante"
              />
            </div>
          }
        </div>
        <IconButton onClick={() => setIsToggle(!isToggle)}>
          <MenuOutlinedIcon 
            sx={{ 
              cursor: 'pointer',
              color: `${theme.palette.mode === 'dark' ? colors.primary[100] : colors.blackAccent[100]}`,
              fontSize: '28px',
            }} 
          />
        </IconButton>
      </div>
      {/* Section supérieure - Menu principal */}
      <div className={`flex flex-col pt-2 pl-5 items-start flex-1`}>
        <Item
          title="Dashboard"
          to="/dashboard-patient"
          icon={<HomeOutlinedIcon className={`group-hover:text-white ${selected === 'Dashboard' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
        <Item
          title="Consultation"
          to="/dashboard-patient/consultation"
          icon={<ContactsOutlinedIcon className={`group-hover:text-white ${selected === 'Consultation' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
        <Item
          title="Prendre RDV"
          to="/dashboard-patient/rdv"
          icon={<EditCalendarOutlinedIcon className={`group-hover:text-white ${selected === 'Prendre RDV' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
        <Item
          title="Messagerie"
          to="/dashboard-patient/messagerie"
          icon={<ForumOutlinedIcon className={`group-hover:text-white ${selected === 'Messagerie' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
        <Item
          title="Vaccination"
          to="/dashboard-patient/vaccination"
          icon={<VaccinesOutlinedIcon className={`group-hover:text-white ${selected === 'Vaccination' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
        <Item
          title="Documents"
          to="/dashboard-patient/documents"
          icon={<FolderSharedOutlinedIcon className={`group-hover:text-white ${selected === 'Documents' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
      </div>
      
      {/* Section inférieure - Services spécialisés */}
      <div className={`flex flex-col pb-4 pl-5 items-start border-t border-opacity-20 mt-auto`}
           style={{ borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}` }}>
        <div className="py-2"></div>
        <Item
          title="Video Consultation"
          to="/dashboard-patient/teleconsultation"
          icon={<VideoCameraFrontOutlinedIcon className={`group-hover:text-white ${selected === 'Video Consultation' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
        <Item
          title="FAJMA +"
          to="/dashboard-patient/iot-fajma"
          icon={<MedicalInformationOutlinedIcon className={`group-hover:text-white ${selected === 'FAJMA +' && 'text-white'}`} />}
          selected={selected}
          setSelected={setSelected}
          isToggle={isToggle}
        />
      </div>
    </Box>
  )
}

export default SidebarDesktop;