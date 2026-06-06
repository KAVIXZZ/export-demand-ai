import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { DRAWER_WIDTH } from './Sidebar';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#0f172a',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: 'none',
        ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
        width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
        backdropFilter: 'blur(8px)',
        zIndex: 100,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
        }}
      >
        {/* Left Side - Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#e2e8f0',
            display: isMobile ? 'none' : 'block',
          }}
        >
          ExportIQ Dashboard
        </Typography>

        {/* Right Side - Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications Icon */}
          <IconButton
            sx={{
              color: '#cbd5e1',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          {/* Settings Icon */}
          <IconButton
            sx={{
              color: '#cbd5e1',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>

          {/* User Profile Menu */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              ml: 2,
              pl: 2,
              borderLeft: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <Box sx={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
              <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                Admin User
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                System Administrator
              </Typography>
            </Box>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: '#2563eb',
                  width: 40,
                  height: 40,
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                AU
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                  mt: 1,
                },
              }}
            >
              <MenuItem
                onClick={handleMenuClose}
                sx={{
                  color: '#e2e8f0',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <AccountCircleIcon sx={{ mr: 1.5 }} />
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                sx={{
                  color: '#e2e8f0',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <SettingsIcon sx={{ mr: 1.5 }} />
                Settings
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                sx={{
                  color: '#e2e8f0',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
