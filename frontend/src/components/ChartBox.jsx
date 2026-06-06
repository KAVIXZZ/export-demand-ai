import { Card, Box, Typography, CircularProgress } from '@mui/material';

const ChartBox = ({ title, children, loading = false }) => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {title}
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress sx={{ color: '#2563eb' }} />
        ) : (
          <Box sx={{ width: '100%', height: '100%' }}>
            {children}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ChartBox;
