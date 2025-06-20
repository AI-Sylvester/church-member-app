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
import DashboardIcon from '@mui/icons-material/Dashboard';          // changed icon
import GroupAddIcon from '@mui/icons-material/GroupAdd';            // changed icon
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
const drawerWidth = 240;
const collapsedWidth = 60;

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };
const handleLogout = () => {
  localStorage.removeItem('token'); // Remove token from local storage
  navigate('/login');               // Redirect to login
};

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
        }}
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

          {/* Buttons */}
          <Button
            color="inherit"
            onClick={() => handleNavigation('/add-family')}
            sx={{ textTransform: 'none' }}
          >
            Create Family
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation('/add-member')}
            sx={{ textTransform: 'none' }}
          >
            Add Member
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
        open={drawerOpen}
      >
        <Toolbar />
        <Divider />
      <List>
  {/* Home */}
  <Tooltip title={!drawerOpen ? 'Home' : ''} placement="right" arrow>
    <ListItem button onClick={() => handleNavigation('/')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      {drawerOpen && <ListItemText primary="Home" />}
    </ListItem>
  </Tooltip>

  {/* Create Family */}
  <Tooltip title={!drawerOpen ? 'Create Family' : ''} placement="right" arrow>
    <ListItem button onClick={() => handleNavigation('/add-family')}>
      <ListItemIcon>
        <GroupAddIcon />
      </ListItemIcon>
      {drawerOpen && <ListItemText primary="Create Family" />}
    </ListItem>
  </Tooltip>

  {/* Add Member */}
  <Tooltip title={!drawerOpen ? 'Add Member' : ''} placement="right" arrow>
    <ListItem button onClick={() => handleNavigation('/add-member')}>
      <ListItemIcon>
        <PersonAddOutlinedIcon />
      </ListItemIcon>
      {drawerOpen && <ListItemText primary="Add Member" />}
    </ListItem>
  </Tooltip>

 <Tooltip title={!drawerOpen ? 'Add Member' : ''} placement="right" arrow>
    <ListItem button onClick={() => handleNavigation('/familylist')}>
      <ListItemIcon>
        <PersonAddOutlinedIcon />
      </ListItemIcon>
      {drawerOpen && <ListItemText primary="Familylist" />}
    </ListItem>
  </Tooltip>

  
 <Tooltip title={!drawerOpen ? 'Add Member' : ''} placement="right" arrow>
    <ListItem button onClick={() => handleNavigation('/memlist')}>
      <ListItemIcon>
        <PersonAddOutlinedIcon />
      </ListItemIcon>
      {drawerOpen && <ListItemText primary="Member List" />}
    </ListItem>
  </Tooltip>
  <Tooltip title={!drawerOpen ? 'Famil Details' : ''} placement="right" arrow>
    <ListItem button onClick={() => handleNavigation('/familydet')}>
      <ListItemIcon>
        <PersonAddOutlinedIcon />
      </ListItemIcon>
      {drawerOpen && <ListItemText primary="Family Details" />}
    </ListItem>
  </Tooltip>


  <Divider />

  {/* Logout */}
<Tooltip title={!drawerOpen ? 'Logout' : ''} placement="right" arrow>
  <ListItem button onClick={handleLogout}>
    <ListItemIcon>
      <LogoutIcon color="error" />  {/* Use Logout icon here */}
    </ListItemIcon>
    {drawerOpen && <ListItemText primary="Logout" />}
  </ListItem>
</Tooltip>
</List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: drawerOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
          mt: '64px', // space for appbar height
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
