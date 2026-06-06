import { Box, Card, Typography, Grid, useMediaQuery, useTheme, Button, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getRecommendations } from '../services/api';

const dummyRecommendations = [
  {
    id: 1,
    title: 'Increase Export Volume to EU',
    description: 'Based on forecasting analysis, EU demand is projected to increase by 22% in Q3',
    impact: 'High',
    confidence: 94,
    category: 'Growth Opportunity',
    details: [
      'EU imports have shown consistent growth trend',
      'Trade agreements favorable through Q4 2026',
      'Logistics costs expected to decrease 8-12%',
      'Recommended action: Increase production capacity by 15-20%',
    ],
  },
  {
    id: 2,
    title: 'Diversify Asian Suppliers',
    description: 'Reduce supply chain risk by diversifying source regions in Asia',
    impact: 'High',
    confidence: 87,
    category: 'Risk Mitigation',
    details: [
      'Current concentration in 2 suppliers creates vulnerability',
      'Geopolitical tensions may disrupt supply chains',
      'Identify alternative suppliers in Vietnam, Indonesia',
      'Action: Establish contracts with 2-3 new suppliers within 30 days',
    ],
  },
  {
    id: 3,
    title: 'Hedge Currency Exposure',
    description: 'Implement forward contracts to protect against currency fluctuations',
    impact: 'Medium',
    confidence: 91,
    category: 'Financial Strategy',
    details: [
      'USD/EUR volatility expected to increase in H2 2026',
      'Lock in rates for 50-60% of projected exports',
      'Consider 6-month and 12-month forward contracts',
      'Estimated protection value: $150K-$200K',
    ],
  },
  {
    id: 4,
    title: 'Optimize Inventory Levels',
    description: 'Align inventory with AI forecast demand predictions',
    impact: 'Medium',
    confidence: 89,
    category: 'Operational Efficiency',
    details: [
      'Current inventory 18% above optimal levels',
      'Reduce holding costs by $45K quarterly',
      'Implement dynamic inventory management',
      'Adjust safety stock based on forecast accuracy',
    ],
  },
  {
    id: 5,
    title: 'Enter Middle East Market',
    description: 'Emerging opportunity in Middle East showing strong demand signals',
    impact: 'Medium',
    confidence: 82,
    category: 'Market Expansion',
    details: [
      'AI detected rising demand pattern in Gulf countries',
      'Market size estimated at $500M annually',
      'Requires compliance with local regulations',
      'Timeline: 6-month market entry strategy',
    ],
  },
  {
    id: 6,
    title: 'Implement AI Monitoring Dashboard',
    description: 'Continuous real-time tracking of key performance indicators',
    impact: 'Low',
    confidence: 95,
    category: 'Technology',
    details: [
      'Set up automated alerts for risk thresholds',
      'Daily demand forecast updates',
      'Early warning system for supply disruptions',
      'Integration with existing ERP systems',
    ],
  },
];

const Recommendations = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRecommendations();
        const normalized = response.data.map((item) => ({
          ...item,
          details: Array.isArray(item.details)
            ? item.details
            : Object.values(item.details || {}).map((value) => String(value)),
        }));
        setRecommendations(normalized);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f97316';
      case 'Low':
        return '#10b981';
      default:
        return '#cbd5e1';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Growth Opportunity':
        return <TrendingUpIcon sx={{ color: '#10b981' }} />;
      case 'Risk Mitigation':
        return <WarningIcon sx={{ color: '#ef4444' }} />;
      case 'Financial Strategy':
        return <LightbulbIcon sx={{ color: '#2563eb' }} />;
      default:
        return <CheckCircleIcon sx={{ color: '#cbd5e1' }} />;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          AI Recommendations
        </Typography>
        <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
          Data-driven strategies to optimize exports, reduce risks, and maximize opportunities
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              Total Recommendations
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563eb' }}>
              {recommendations.length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              High Impact
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
              {recommendations.filter((r) => r.impact === 'High').length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              Avg. Confidence
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
              {Math.round(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length)}%
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              Potential Value
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563eb' }}>
              $2.4M
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendations List */}
      <Grid container spacing={2.5}>
        {recommendations.map((recommendation) => (
          <Grid item xs={12} key={recommendation.id}>
            <Card
              sx={{
                p: 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${getImpactColor(recommendation.impact)}`,
              }}
            >
              <Box
                onClick={() => setExpandedId(expandedId === recommendation.id ? null : recommendation.id)}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                  },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'center' }}>
                    {getCategoryIcon(recommendation.category)}
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {recommendation.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1.5 }}>
                    {recommendation.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Impact: ${recommendation.impact}`}
                      size="small"
                      sx={{
                        backgroundColor: `${getImpactColor(recommendation.impact)}20`,
                        color: getImpactColor(recommendation.impact),
                      }}
                    />
                    <Chip
                      label={`Confidence: ${recommendation.confidence}%`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                      }}
                    />
                    <Chip
                      label={recommendation.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                        color: '#cbd5e1',
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                  {expandedId === recommendation.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>

              {/* Expanded Details */}
              {expandedId === recommendation.id && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                    p: 3,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    📋 Action Items:
                  </Typography>

                  <List sx={{ mb: 2 }}>
                    {recommendation.details.map((detail, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={detail}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#2563eb',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                      }}
                    >
                      Implement
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#cbd5e1',
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recommendations;
