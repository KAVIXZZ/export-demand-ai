import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from './theme/theme';
import Sidebar, { DRAWER_WIDTH } from './layout/Sidebar';
import Navbar from './layout/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#0f172a',
          }}
        >
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
            }}
          >
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <Box
              component="main"
              sx={{
                flex: 1,
                mt: '64px', // Navbar height
                backgroundColor: '#0f172a',
                overflowY: 'auto',
              }}
            >
              <AppRoutes />
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;