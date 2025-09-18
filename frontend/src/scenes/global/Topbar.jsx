import React, { useContext, useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, List, ListItem, ListItemText, ListItemAvatar, Divider, Button, Popper, Paper, ClickAwayListener, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens, ColorModeContext } from '../../theme';
import { 
  NotificationsOutlined,
  SettingsOutlined,
  PersonOutlined,
  SearchOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  Close,
  CheckCircle,
  Warning,
  Info,
  Error,
  ChatBubbleOutline,
  HelpOutline,
  Logout
} from '@mui/icons-material';
import { toast } from 'sonner';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // ===== DONNÉES DE NOTIFICATIONS =====
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Rendez-vous confirmé',
      message: 'Votre rendez-vous avec Dr Mbengue a été confirmé pour demain à 10h30',
      time: 'Il y a 5 minutes',
      read: false,
      icon: CheckCircle,
      color: '#10B981'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Rappel de médicament',
      message: 'N\'oubliez pas de prendre votre médicament à 14h00',
      time: 'Il y a 1 heure',
      read: false,
      icon: Warning,
      color: '#F59E0B'
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouvelle consultation disponible',
      message: 'Dr Diop a des créneaux disponibles cette semaine',
      time: 'Il y a 2 heures',
      read: true,
      icon: Info,
      color: '#3B82F6'
    },
    {
      id: 4,
      type: 'error',
      title: 'Consultation annulée',
      message: 'Votre consultation de demain a été annulée par le médecin',
      time: 'Il y a 3 heures',
      read: true,
      icon: Error,
      color: '#EF4444'
    },
    {
      id: 5,
      type: 'success',
      title: 'Ordonnance prête',
      message: 'Votre ordonnance est disponible en pharmacie',
      time: 'Il y a 1 jour',
      read: true,
      icon: CheckCircle,
      color: '#10B981'
    }
  ];

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const getTextColor = () => {
    return theme.palette.mode === 'dark' ? colors.blackAccent[200] : '#64748b';
  };

  const getCardStyles = () => ({
    background: theme.palette.mode === 'dark' 
      ? 'rgba(30, 41, 59, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(255, 255, 255, 0.3)'
  });

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
    setShowNotifications(false);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
    setShowProfile(false);
  };

  const handleNotificationItemClick = (notification) => {
    toast.info(notification.title, {
      description: notification.message,
      duration: 3000,
    });
  };

  const markAllAsRead = () => {
    toast.success('Toutes les notifications ont été marquées comme lues', {
      duration: 2000,
    });
  };

  const handleProfileMenuClick = (action) => {
    switch (action) {
      case 'profile':
        toast.info('Profil', {
          description: 'Ouverture de la page de profil.',
          duration: 2000,
        });
        break;
      case 'chat':
        toast.info('Chat', {
          description: 'Ouverture du chat avec le médecin.',
          duration: 2000,
        });
        break;
      case 'support':
        toast.info('Support', {
          description: 'Ouverture de la page d\'aide et support.',
          duration: 2000,
        });
        break;
      case 'settings':
        toast.info('Paramètres', {
          description: 'Ouverture des paramètres du compte.',
          duration: 2000,
        });
        break;
      case 'logout':
        toast.warning('Déconnexion', {
          description: 'Vous allez être déconnecté.',
          duration: 2000,
        });
        break;
      default:
        break;
    }
    handleCloseProfile();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        height: '80px',
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[800] : '#ffffff',
        borderBottom: theme.palette.mode === 'dark' 
          ? `1px solid ${colors.blackAccent[600]}` 
          : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Logo/Titre */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
            fontSize: '24px'
          }}
        >
          Fajma
        </Typography>
      </Box>

      {/* Actions utilisateur */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Bouton de recherche */}
        <IconButton sx={{ color: getTextColor() }}>
          <SearchOutlined />
        </IconButton>
        
        {/* Bouton de basculement mode sombre/clair */}
        <IconButton 
          onClick={colorMode.toggleColorMode}
          sx={{ 
            color: getTextColor(),
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? colors.blackAccent[500] 
                : '#f1f5f9'
            }
          }}
        >
          {theme.palette.mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
        
        {/* Bouton de notifications */}
        <IconButton 
          ref={notificationRef}
          onClick={handleNotificationClick}
          sx={{ 
            color: getTextColor(),
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? colors.blackAccent[500] 
                : '#f1f5f9'
            }
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#EF4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold'
              }
            }}
          >
            <NotificationsOutlined />
          </Badge>
        </IconButton>
        
        {/* Bouton de paramètres */}
        <IconButton sx={{ color: getTextColor() }}>
          <SettingsOutlined />
        </IconButton>
        
        {/* Avatar utilisateur */}
        <IconButton 
          ref={profileRef}
          onClick={handleProfileClick}
          sx={{ 
            p: 0,
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: colors.secondary[500],
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <PersonOutlined />
          </Avatar>
        </IconButton>
      </Box>

      {/* ===== LISTE DÉROULANTE DE NOTIFICATIONS ===== */}
      <Popper
        open={showNotifications}
        anchorEl={notificationAnchorEl}
        placement="bottom-end"
        transition
        sx={{
          zIndex: 999999,
          mt: 1
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                width: { xs: '90vw', sm: '400px' },
                maxHeight: '70vh',
                overflow: 'hidden',
                ...getCardStyles(),
                p: 0,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <ClickAwayListener onClickAway={handleCloseNotifications}>
                <Box>
                  {/* En-tête de la liste */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                      fontSize: '16px'
                    }}>
                      Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {unreadCount > 0 && (
                        <Button
                          size="small"
                          onClick={markAllAsRead}
                          sx={{
                            color: colors.secondary[500],
                            textTransform: 'none',
                            fontSize: '11px',
                            fontWeight: 500,
                            minWidth: 'auto',
                            px: 1
                          }}
                        >
                          Tout marquer
                        </Button>
                      )}
                      <IconButton 
                        onClick={handleCloseNotifications}
                        size="small"
                        sx={{ 
                          color: getTextColor(),
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <Close sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Liste des notifications */}
                  <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    <List sx={{ p: 0 }}>
                      {notifications.map((notification, index) => {
                        const IconComponent = notification.icon;
                        return (
                          <React.Fragment key={notification.id}>
                            <ListItem
                              onClick={() => handleNotificationItemClick(notification)}
                              sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: notification.read 
                                  ? 'transparent' 
                                  : (theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'),
                                '&:hover': {
                                  backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.1)' 
                                    : 'rgba(0, 0, 0, 0.05)'
                                }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  backgroundColor: notification.color,
                                  color: 'white',
                                  width: 32,
                                  height: 32
                                }}>
                                  <IconComponent sx={{ fontSize: 16 }} />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography sx={{ 
                                      fontWeight: notification.read ? 500 : 'bold',
                                      color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                                      fontSize: '13px'
                                    }}>
                                      {notification.title}
                                    </Typography>
                                    {!notification.read && (
                                      <Box sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: '#EF4444'
                                      }} />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography sx={{ 
                                      color: getTextColor(),
                                      fontSize: '12px',
                                      lineHeight: 1.4,
                                      mb: 0.5,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }}>
                                      {notification.message}
                                    </Typography>
                                    <Typography sx={{ 
                                      color: getTextColor(),
                                      fontSize: '10px',
                                      opacity: 0.7
                                    }}>
                                      {notification.time}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < notifications.length - 1 && (
                              <Divider sx={{ 
                                mx: 1,
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                              }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </Box>

                  {/* Pied de la liste */}
                  <Box sx={{ 
                    p: 1.5, 
                    borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ 
                      color: getTextColor(),
                      fontSize: '11px',
                      opacity: 0.7
                    }}>
                      {notifications.length} notification(s) au total
                    </Typography>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* ===== MENU DÉROULANT DE PROFIL ===== */}
      <Popper
        open={showProfile}
        anchorEl={profileAnchorEl}
        placement="bottom-end"
        transition
        sx={{
          zIndex: 999999,
          mt: 1
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                width: { xs: '90vw', sm: '280px' },
                overflow: 'hidden',
                ...getCardStyles(),
                p: 0,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <ClickAwayListener onClickAway={handleCloseProfile}>
                <Box>
                  {/* En-tête du profil */}
                  <Box sx={{ 
                    p: 3, 
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Avatar sx={{ 
                      backgroundColor: colors.secondary[500],
                      color: 'white',
                      width: 48,
                      height: 48,
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      ON
                    </Avatar>
                    <Box>
                      <Typography sx={{ 
                        fontWeight: 'bold', 
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                        fontSize: '16px',
                        mb: 0.5
                      }}>
                        Oumar Niang
                      </Typography>
                      <Typography sx={{ 
                        color: getTextColor(),
                        fontSize: '14px'
                      }}>
                        Patient
                      </Typography>
                    </Box>
                  </Box>

                  {/* Menu du profil */}
                  <Box sx={{ p: 1 }}>
                    <List sx={{ p: 0 }}>
                      {/* Profil */}
                      <ListItem
                        onClick={() => handleProfileMenuClick('profile')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            backgroundColor: 'transparent',
                            color: getTextColor(),
                            width: 32,
                            height: 32
                          }}>
                            <PersonOutlined sx={{ fontSize: 20 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ 
                              color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                              fontSize: '14px',
                              fontWeight: 500
                            }}>
                              Profil
                            </Typography>
                          }
                        />
                      </ListItem>

                      {/* Chat */}
                      <ListItem
                        onClick={() => handleProfileMenuClick('chat')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            backgroundColor: 'transparent',
                            color: getTextColor(),
                            width: 32,
                            height: 32
                          }}>
                            <ChatBubbleOutline sx={{ fontSize: 20 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ 
                              color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                              fontSize: '14px',
                              fontWeight: 500
                            }}>
                              Chat
                            </Typography>
                          }
                        />
                      </ListItem>

                      {/* Support */}
                      <ListItem
                        onClick={() => handleProfileMenuClick('support')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            backgroundColor: 'transparent',
                            color: getTextColor(),
                            width: 32,
                            height: 32
                          }}>
                            <HelpOutline sx={{ fontSize: 20 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ 
                              color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                              fontSize: '14px',
                              fontWeight: 500
                            }}>
                              Support
                            </Typography>
                          }
                        />
                      </ListItem>

                      {/* Paramètres */}
                      <ListItem
                        onClick={() => handleProfileMenuClick('settings')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            backgroundColor: 'transparent',
                            color: getTextColor(),
                            width: 32,
                            height: 32
                          }}>
                            <SettingsOutlined sx={{ fontSize: 20 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ 
                              color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
                              fontSize: '14px',
                              fontWeight: 500
                            }}>
                              Paramètres
                            </Typography>
                          }
                        />
                      </ListItem>

                      {/* Déconnexion */}
                      <ListItem
                        onClick={() => handleProfileMenuClick('logout')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(239, 68, 68, 0.1)' 
                              : 'rgba(239, 68, 68, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            backgroundColor: 'transparent',
                            color: '#EF4444',
                            width: 32,
                            height: 32
                          }}>
                            <Logout sx={{ fontSize: 20 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ 
                              color: '#EF4444',
                              fontSize: '14px',
                              fontWeight: 500
                            }}>
                              Déconnexion
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Topbar;
