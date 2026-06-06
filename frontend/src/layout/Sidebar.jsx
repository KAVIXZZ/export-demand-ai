import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const DRAWER_WIDTH = 280;

const menuItems = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon },
  { label: 'Upload Data', path: '/upload', icon: CloudUploadIcon },
  { label: 'Forecast', path: '/forecast', icon: TimelineIcon },
  { label: 'Risk Analysis', path: '/risk', icon: WarningIcon },
  { label: 'Recommendations', path: '/recommendations', icon: LightbulbIcon },
  { label: 'Reports', path: '/reports', icon: DescriptionIcon },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          📊 ExportIQ
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)' }} />

      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: isActive ? '#2563eb' : '#cbd5e1',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.08)',
                    color: '#e2e8f0',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#2563eb' : '#cbd5e1',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)' }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Box sx={{ fontSize: '0.75rem', color: '#64748b' }}>
          ExportIQ v1.0
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderRadius: '8px',
            p: 0.5,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ color: '#2563eb' }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              backgroundColor: '#0f172a',
              borderRight: '1px solid rgba(148, 163, 184, 0.1)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              backgroundColor: '#0f172a',
              borderRight: '1px solid rgba(148, 163, 184, 0.1)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
