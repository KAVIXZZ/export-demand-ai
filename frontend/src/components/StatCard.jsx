import { Card, Box, Typography, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = ({ title, value, icon: Icon, trend, loading = false }) => {
  return (
    <Card
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#2563eb' }} />
          ) : (
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
              {value}
            </Typography>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              borderRadius: '12px',
              p: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: '#2563eb', fontSize: 28 }} />
          </Box>
        )}
      </Box>

      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 0.5 }}>
          {trend > 0 ? (
            <TrendingUpIcon sx={{ fontSize: 18, color: '#10b981' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 18, color: '#ef4444' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: trend > 0 ? '#10b981' : '#ef4444',
              fontWeight: 600,
            }}
          >
            {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default StatCard;
