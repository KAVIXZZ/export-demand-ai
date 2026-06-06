import { Box, Card, Typography, Grid, useMediaQuery, useTheme, LinearProgress, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartBox from '../components/ChartBox';
import { getRiskData } from '../services/api';

const dummyRiskData = [
  { name: 'Supply Chain', value: 45, risk: 'High' },
  { name: 'Market Demand', value: 28, risk: 'Medium' },
  { name: 'Currency', value: 32, risk: 'Medium' },
  { name: 'Regulatory', value: 18, risk: 'Low' },
  { name: 'Political', value: 35, risk: 'Medium' },
];

const dummyRegionalRisk = [
  { region: 'North America', risk: 32 },
  { region: 'Europe', risk: 45 },
  { region: 'Asia Pacific', risk: 58 },
  { region: 'Latin America', risk: 52 },
  { region: 'Middle East', risk: 62 },
];

const dummyRiskBreakdown = [
  { name: 'Supply Chain', value: 35, color: '#ef4444' },
  { name: 'Market Risk', value: 25, color: '#f97316' },
  { name: 'Regulatory', value: 18, color: '#eab308' },
  { name: 'Operational', value: 22, color: '#2563eb' },
];

const RiskAnalysis = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [overallRisk, setOverallRisk] = useState(45);
  const [regionalRisk, setRegionalRisk] = useState(dummyRegionalRisk);
  const [riskBreakdown, setRiskBreakdown] = useState(dummyRiskBreakdown);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRiskData();
        const riskItems = response.data;

        if (riskItems.length) {
          setRegionalRisk(
            riskItems.map((item) => ({
              region: item.region,
              risk: item.risk_score,
            }))
          );

          const avg = riskItems.reduce((sum, item) => sum + item.risk_score, 0) / riskItems.length;
          setOverallRisk(Math.round(avg));
          setRiskBreakdown([
            { name: 'Supply Chain', value: Math.round(avg * 0.35), color: '#ef4444' },
            { name: 'Market Risk', value: Math.round(avg * 0.25), color: '#f97316' },
            { name: 'Regulatory', value: Math.round(avg * 0.18), color: '#eab308' },
            { name: 'Operational', value: Math.round(avg * 0.22), color: '#2563eb' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching risk data:', error);
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
          Risk Analysis
        </Typography>
        <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
          Comprehensive supply chain and market risk assessment
        </Typography>
      </Box>

      {/* Overall Risk Score */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
              Overall Risk Level
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mb: 2 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: overallRisk >= 60 ? '#ef4444' : overallRisk >= 35 ? '#f97316' : '#10b981' }}>
                {overallRisk}
              </Typography>
              <Typography variant="body1" sx={{ color: overallRisk >= 60 ? '#ef4444' : overallRisk >= 35 ? '#f97316' : '#10b981', fontWeight: 600, mb: 0.5 }}>
                {overallRisk >= 60 ? 'HIGH' : overallRisk >= 35 ? 'MEDIUM' : 'LOW'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={45}
              sx={{
                height: 12,
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ef4444',
                  borderRadius: '6px',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#cbd5e1', mt: 1.5, display: 'block' }}>
              Scale: 0 (No Risk) to 100 (Critical)
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Risk Indicators
            </Typography>
            <Grid container spacing={1.5}>
              {[
                { label: 'Supply Chain', level: 58, severity: 'high' },
                { label: 'Market Volatility', level: 42, severity: 'medium' },
                { label: 'Currency Risk', level: 35, severity: 'medium' },
                { label: 'Geopolitical', level: 52, severity: 'high' },
              ].map((indicator) => (
                <Grid item xs={12} sm={6} key={indicator.label}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {indicator.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color:
                            indicator.severity === 'high'
                              ? '#ef4444'
                              : indicator.severity === 'medium'
                                ? '#f97316'
                                : '#10b981',
                        }}
                      >
                        {indicator.level}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={indicator.level}
                      sx={{
                        height: 6,
                        borderRadius: '3px',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor:
                            indicator.severity === 'high'
                              ? '#ef4444'
                              : indicator.severity === 'medium'
                                ? '#f97316'
                                : '#10b981',
                          borderRadius: '3px',
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartBox title="Regional Risk Distribution" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalRisk}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis stroke="#cbd5e1" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="risk" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartBox title="Risk Category Breakdown" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dummyRiskBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>
      </Grid>

      {/* Mitigation Strategies */}
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              🛡️ Risk Mitigation Strategies
            </Typography>

            <Grid container spacing={2}>
              {[
                {
                  title: 'Diversify Suppliers',
                  description: 'Reduce dependency on single suppliers in high-risk regions',
                  priority: 'High',
                },
                {
                  title: 'Forward Contracts',
                  description: 'Lock in currency rates and commodity prices 6-12 months ahead',
                  priority: 'High',
                },
                {
                  title: 'Market Monitoring',
                  description: 'Implement real-time monitoring of geopolitical events',
                  priority: 'Medium',
                },
                {
                  title: 'Insurance Coverage',
                  description: 'Obtain political risk and trade credit insurance',
                  priority: 'Medium',
                },
              ].map((strategy, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      border: '1px solid rgba(37, 99, 235, 0.1)',
                      borderRadius: '8px',
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {strategy.title}
                      </Typography>
                      <Chip
                        label={strategy.priority}
                        size="small"
                        sx={{
                          backgroundColor:
                            strategy.priority === 'High'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(249, 115, 22, 0.2)',
                          color: strategy.priority === 'High' ? '#ef4444' : '#f97316',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      {strategy.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskAnalysis;
