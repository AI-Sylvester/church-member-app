import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 60;

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

 return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar – Gold background with black text */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#FFD700',
          color: '#000',
        }}
        elevation={1}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Church Member Management
          </Typography>
         {[
  { path: '/add-family', label: 'Create Family' },
  { path: '/add-member', label: 'Add Member' },
  { path: '/anbiyam', label: 'Anbiyam' },
].map(({ path, label }) => (
  <Button
    key={path}
    onClick={() => handleNavigation(path)}
    variant="contained"
    sx={{
      ml: 1,
      textTransform: 'none',
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: 2,
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#f7f7f7',
        boxShadow: '0 3px 7px rgba(0,0,0,0.2)',
      },
    }}
  >
    {label}
  </Button>
))}

        </Toolbar>
      </AppBar>

      {/* Drawer – White background, gold icons on hover */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : collapsedWidth,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            backgroundColor: '#fff',
            color: '#000',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open={drawerOpen}
      >
        <Toolbar />
        <Divider />
        <List>
          {[
            { path: '/home', icon: <DashboardIcon />, label: 'Home' },
            { path: '/add-family', icon: <GroupAddIcon />, label: 'Create Family' },
            { path: '/add-member', icon: <PersonAddOutlinedIcon />, label: 'Add Member' },
            { path: '/familylist', icon: <ListAltIcon />, label: 'Family List' },
            { path: '/memlist', icon: <PeopleOutlineIcon />, label: 'Member List' },
            { path: '/familydet', icon: <InfoIcon />, label: 'Family Details' },
          ].map((item) => (
            <Tooltip
              key={item.path}
              title={!drawerOpen ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItem button onClick={() => handleNavigation(item.path)}>
                <ListItemIcon
                  sx={{
                    color: '#000',
                    '&:hover': { color: '#FFD700' },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && <ListItemText primary={item.label} />}
              </ListItem>
            </Tooltip>
          ))}

          <Divider />

          <Tooltip title={!drawerOpen ? 'Logout' : ''} placement="right" arrow>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'red' }}>
                <LogoutIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Logout" />}
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

