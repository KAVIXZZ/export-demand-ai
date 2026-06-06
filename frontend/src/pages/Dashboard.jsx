import { Box, Grid, Typography, Card, useTheme, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartBox from '../components/ChartBox';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { getDashboardData } from '../services/api';

// Dummy data
const dummyLineChartData = [
  { month: 'Jan', exports: 65000, forecast: 68000 },
  { month: 'Feb', exports: 75000, forecast: 72000 },
  { month: 'Mar', exports: 68000, forecast: 75000 },
  { month: 'Apr', exports: 82000, forecast: 80000 },
  { month: 'May', exports: 95000, forecast: 92000 },
  { month: 'Jun', exports: 88000, forecast: 90000 },
];

const dummyBarChartData = [
  { region: 'North', risk: 45, demand: 75 },
  { region: 'South', risk: 32, demand: 68 },
  { region: 'East', risk: 58, demand: 82 },
  { region: 'West', risk: 28, demand: 71 },
  { region: 'Central', risk: 42, demand: 79 },
];

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dashboardData, setDashboardData] = useState({
    totalExports: 0,
    forecastDemand: 0,
    riskLevel: 'N/A',
    aiConfidence: '0%',
    exportsTrend: 0,
    forecastTrend: 0,
    riskTrend: 0,
    confidenceTrend: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        const data = response.data;

        setDashboardData({
          totalExports: data.total_exports || 0,
          forecastDemand: data.forecast_demand || 0,
          riskLevel: data.risk_level || 'N/A',
          aiConfidence: `${data.ai_confidence?.toFixed(1) || 0}%`,
          exportsTrend: 18,
          forecastTrend: 12,
          riskTrend: -5,
          confidenceTrend: 3,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome to ExportIQ
        </Typography>
        <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
          AI-Driven Export Demand Forecasting & Supply Chain Risk Intelligence
        </Typography>
      </Box>

      {/* Stat Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Exports"
            value={dashboardData?.totalExports ? `$${Number(dashboardData.totalExports).toLocaleString()}` : 'N/A'}
            icon={InventoryIcon}
            trend={dashboardData?.exportsTrend}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Forecast Demand"
            value={dashboardData?.forecastDemand ? `$${Number(dashboardData.forecastDemand).toLocaleString()}` : 'N/A'}
            icon={TrendingUpIcon}
            trend={dashboardData?.forecastTrend}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Risk Level"
            value={dashboardData?.riskLevel || 'N/A'}
            icon={WarningIcon}
            trend={dashboardData?.riskTrend}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="AI Confidence"
            value={dashboardData?.aiConfidence || 'N/A'}
            icon={ThumbUpIcon}
            trend={dashboardData?.confidenceTrend}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartBox title="Export Trend & Forecast" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dummyLineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="exports"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartBox title="Risk vs Demand by Region" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dummyBarChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="risk" fill="#ef4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="demand" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>
      </Grid>

      {/* AI Insights Box */}
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              🤖 AI Insights
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    borderRadius: '8px',
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: '#2563eb', fontWeight: 600, mb: 1 }}>
                    📈 Recommendation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Increase exports to EU markets by 15% based on demand forecast
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>
                    ⚠️ Risk Alert
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    High supply chain disruption risk detected in Asian markets
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                    ✅ Opportunity
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Stable demand forecast across North American regions for Q3
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
