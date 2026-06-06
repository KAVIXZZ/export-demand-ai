import { Box, Card, Typography, Grid, useMediaQuery, useTheme, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getReports } from '../services/api';

const dummyReports = [];

const getReportIcon = (type) => {
  switch (type) {
    case 'Performance':
      return <BarChartIcon />;
    case 'Forecast':
      return <TimelineIcon />;
    case 'Risk Analysis':
      return <DescriptionIcon />;
    case 'Strategy':
      return <DescriptionIcon />;
    case 'Analysis':
      return <BarChartIcon />;
    default:
      return <DescriptionIcon />;
  }
};

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        setReports(response.data);
      } catch (error) {
        console.error('Error loading reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleDownload = (report) => {
    console.log(`Downloading ${report.name}`);
    // Simulate download
    alert(`Downloaded: ${report.name}`);
  };

  const handleDelete = (id) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  const handleGenerateReport = () => {
    alert('Opening report generation wizard...');
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Reports
          </Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
            Download and manage your analysis reports
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleGenerateReport}
          sx={{
            backgroundColor: '#2563eb',
            '&:hover': { backgroundColor: '#1d4ed8' },
            display: isMobile ? 'none' : 'flex',
          }}
        >
          Generate Report
        </Button>
      </Box>

      {/* Generate Button for Mobile */}
      {isMobile && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleGenerateReport}
            sx={{
              backgroundColor: '#2563eb',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Generate Report
          </Button>
        </Box>
      )}

      {/* Reports Statistics */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              Total Reports
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563eb' }}>
              {reports.length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              This Month
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
              3
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              Total Size
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563eb' }}>
              12.0 MB
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
              Last Generated
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
              Today
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Table */}
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card sx={{ p: 0, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }}>Report Name</TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }} align="right">
                      Date Generated
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }} align="right">
                      Size
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }} align="right">
                      Format
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow
                      key={report.id}
                      sx={{
                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.05)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: '#2563eb' }}>{getReportIcon(report.type)}</Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {report.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                              {report.type}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{report.generated_date || report.generatedDate}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{report.size}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor:
                              report.format === 'PDF'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(16, 185, 129, 0.15)',
                            color: report.format === 'PDF' ? '#ef4444' : '#10b981',
                            py: 0.5,
                            px: 1,
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: 600,
                          }}
                        >
                          {report.format}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewReport(report)}
                          sx={{
                            color: '#2563eb',
                            '&:hover': {
                              backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            },
                          }}
                          title="View"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(report)}
                          sx={{
                            color: '#10b981',
                            '&:hover': {
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            },
                          }}
                          title="Download"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(report.id)}
                          sx={{
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* View Report Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#e2e8f0' }}>
          {selectedReport?.name}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
          <Box sx={{ py: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Report Details:
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                p: 2,
                borderRadius: '8px',
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Generated:</strong> {selectedReport?.generatedDate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Type:</strong> {selectedReport?.type}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Format:</strong> {selectedReport?.format}
              </Typography>
              <Typography variant="body2">
                <strong>Size:</strong> {selectedReport?.size}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
              Report preview would be displayed here. This is a sample report viewer.
            </Typography>

            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
              To view the full report, download it using the download button.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b', p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#cbd5e1' }}>
            Close
          </Button>
          <Button
            onClick={() => handleDownload(selectedReport)}
            variant="contained"
            sx={{
              backgroundColor: '#2563eb',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
