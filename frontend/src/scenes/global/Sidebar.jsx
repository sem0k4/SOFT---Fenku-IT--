import { useContext, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LogoFAJMA from "../../assets/logo-fajma.png";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";


// const elementsSidebar = [
//   {
//     title: "Dashboard",
//     to: "/",  
//     icon: <HomeOutlinedIcon />,
//     selected: "Dashboard",
//     // setSelected: (selected) => selected,
//   },
//   {
//     title: "Téléconsultation",
//     to: "/teleconsultation",
//     icon: <VideoCameraFrontOutlinedIcon />,
//     selected: "Téléconsultation",
//     // setSelected: (selected) => selected,
//   },
//   {
//     title: "Consultation",
//     to: "/consultation",
//     icon: <ContactsOutlinedIcon />,
//     selected: "Consultation",
//     // setSelected: (selected) => selected,
//   },
//   {
//     title: "Prendre RDV",
//     to: "/prendre-rdv",
//     icon: <EditCalendarOutlinedIcon />,
//     selected: "Prendre RDV",
//     // setSelected: (selected) => selected,
//   },
//   {
//     title: "Messagerie",
//     to: "/messagerie",
//     icon: <ForumOutlinedIcon />,
//     selected: "Messagerie",
//     // setSelected: (selected) => selected,
//   },
//   {
//     title: "Planning vaccination",
//     to: "/vaccination",
//     icon: <CalendarMonthOutlinedIcon />,
//     selected: "Planning vaccination",
//     // setSelected: (selected) => selected,
//   },
//   {
//     title: "IoT FAJMA+",
//     to: "/iot-fajma",
//     icon: <MedicalInformationOutlinedIcon />,
//     selected: "IoT FAJMA+",
//     // setSelected: (selected) => selected,
//   }
// ]

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  return (
    <MenuItem
      active={selected === title}
      style={{
        // color: selected === title ? colors.primary[900] : colors.primary[400],
        backgroundColor: selected === title ? colors.secondary[600] : "transparent",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography 
        fontWeight={500} 
        color={theme.palette.mode === 'dark' ? colors.primary[100] : colors.blackAccent[500]} 
        textAlign="left"
      >{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SidebarDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.secondary[900]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar 
        collapsed={isCollapsed}
        rootStyles={{
        margin: "0px",
        padding: "0px",
        paddingBottom: "20px",
        height: "100vh",
        backgroundColor: `${theme.palette.mode === 'dark' ? colors.primary[700] : '#fcfcfc'}`,
        }}
      >
        <Menu 
          iconShape="square"
          style={{
            backgroundColor: `${theme.palette.mode === 'dark' ? colors.primary[700] : '#fcfcfc'}`,
            paddingTop: "15px",
          }}
        >
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center" 
              >
                <img 
                    src={LogoFAJMA} 
                    className="w-28"
                    alt="FAJMA votre partenaire de santé"
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon className="mx-auto text-center" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`/images/exemple_profile.webp`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.primary[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Abdou Ndiaye
                </Typography>
                <Typography variant="h5" color={colors.secondary[500]}>
                  Patient
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Téléconsultation"
              to="/teleconsultation"
              icon={<VideoCameraFrontOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Consultation"
              to="/consultation"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Prendre RDV"
              to="/prende-rdv"
              icon={<EditCalendarOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Messagerie"
              to="/messagerie"
              icon={<CalendarMonthOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Planning vaccination"
              to="/vaccination"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="IoT FAJMA+"
              to="/iot-fajma"
              icon={<MedicalInformationOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* {elementsSidebar.map((item) => (
              <Item
                key={item.title}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                // setSelected={item.setSelected}
              />
            ))} */}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarDashboard;