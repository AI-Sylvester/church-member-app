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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import axios from 'axios';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (path) => navigate(path);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleLogout = () => setOpenLogoutDialog(true);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await axios.post(`${API_BASE_URL}/sync`);
      alert(response.data.message || '✅ Sync completed successfully');
    } catch (err) {
      console.error('❌ Sync failed:', err);
      alert(err?.response?.data?.message || '❌ Sync to Neon failed');
    } finally {
      setSyncing(false);
    }
  };

  const drawerItems = [
    { path: '/home', icon: <SpaceDashboardRoundedIcon />, label: 'Dashboard', color: '#e3f2fd' },
    { path: '/add-family', icon: <GroupsRoundedIcon />, label: 'Create Family', color: '#ede7f6' },
    { path: '/add-member', icon: <PersonAddAltRoundedIcon />, label: 'Add Member', color: '#e8f5e9' },
    { path: '/familylist', icon: <ListAltRoundedIcon />, label: 'Family List', color: '#fff3e0' },
    { path: '/memlist', icon: <GroupRoundedIcon />, label: 'Member List', color: '#fce4ec' },
    { path: '/familydet', icon: <InfoOutlinedIcon />, label: 'Family Details', color: '#e0f7fa' },
    { path: '/anbiyamfam', icon: <Diversity3RoundedIcon />, label: 'Family Anbiyam', color: '#f3e5f5' },
    { path: '/familymap', icon: <MapRoundedIcon />, label: 'Family Map', color: '#f9fbe7' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f0f4f8', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(to right, #ededda, #c5c5be)',
          color: '#1e1e2f',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuRoundedIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={800} sx={{ ml: 1 }}>
              Church Door
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
      <Button
  onClick={handleSync}
  startIcon={<CloudSyncRoundedIcon />}
  disabled={syncing}
  variant="contained"
  sx={{
    backgroundColor: '#e53935',       // Red background
    color: '#fff',                    // White text
    fontWeight: 700,
    borderRadius: 2,                 // Slightly rounded corners
    px: 3,
    boxShadow: '0 2px 6px rgba(229, 57, 53, 0.3)',
    '&:hover': { backgroundColor: '#d32f2f' }, // Darker red on hover
  }}
>
  {syncing ? 'Syncing...' : 'Sync'}
</Button>

            <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ bgcolor: '#42a5f5' }}>A</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 72,
            background: '#fff',
            borderRight: '1px solid #eee',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {drawerItems.map((item) => (
            <Tooltip key={item.path} title={!drawerOpen ? item.label : ''} placement="right" arrow>
              <ListItem
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  pl: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#1e1e2f',
                    backgroundColor: item.color,
                    borderRadius: 2,
                    minWidth: 36,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && <ListItemText primary={item.label} sx={{ pl: 2, fontWeight: 600 }} />}
              </ListItem>
            </Tooltip>
          ))}

          <Divider sx={{ my: 2 }} />

          <Tooltip title={!drawerOpen ? 'Logout' : ''} placement="right" arrow>
            <ListItem
              button
              onClick={handleLogout}
              sx={{ '&:hover': { backgroundColor: '#ffebee' }, pl: 2 }}
            >
              <ListItemIcon
                sx={{
                  color: '#e53935',
                  backgroundColor: '#ffcdd2',
                  borderRadius: 2,
                  minWidth: 36,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 1,
                }}
              >
                <LogoutRoundedIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Logout" sx={{ pl: 2, fontWeight: 600 }} />}
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1e1e2f' }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '1rem' }}>
            Do you want to sync your data to the cloud before logging out?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
              setOpenLogoutDialog(false);
            }}
            sx={{ borderRadius: 4, textTransform: 'none', px: 3 }}
          >
            Logout Without Sync
          </Button>
          <Button
            startIcon={<SyncRoundedIcon />}
            onClick={async () => {
              try {
                setSyncing(true);
                const response = await axios.post(`${API_BASE_URL}/sync`);
                alert(response.data.message || '✅ Sync completed successfully');
                localStorage.removeItem('token');
                navigate('/login');
              } catch (err) {
                console.error('❌ Sync failed:', err);
                alert(err?.response?.data?.message || '❌ Sync to Neon failed');
              } finally {
                setSyncing(false);
                setOpenLogoutDialog(false);
              }
            }}
            disabled={syncing}
            variant="contained"
            sx={{ backgroundColor: '#42a5f5', color: '#fff', borderRadius: 4, px: 3 }}
          >
            {syncing ? 'Syncing...' : 'Sync & Logout'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
