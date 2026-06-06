import { Box, Card, Typography, Button, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme, CircularProgress, Alert, Grid } from '@mui/material';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { uploadCSV } from '../services/api';

const UploadData = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await uploadCSV(file);
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          uploadedAt: new Date().toLocaleString(),
          status: 'Uploaded',
          rowsProcessed: response.data.rows_processed,
        },
      ]);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setLoading(false);
    }
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Upload Data
        </Typography>
        <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
          Upload CSV files with export data for analysis and forecasting
        </Typography>
      </Box>

      {/* Upload Area */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed rgba(37, 99, 235, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                border: '2px dashed rgba(37, 99, 235, 0.6)',
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
              },
            }}
            component="label"
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={loading}
            />

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress sx={{ color: '#2563eb' }} />
                <Typography>Uploading file...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: '#2563eb' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Drag and drop your CSV file here
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    or click to select a file from your computer
                  </Typography>
                </Box>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Browse Files
                </Button>
              </Box>
            )}
          </Card>

          {/* File Format Info */}
          <Card sx={{ p: 2.5, mt: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              📋 Required CSV Format
            </Typography>
            <Box sx={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '8px', p: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#2563eb' }}>
                date, region, product, quantity, price, demand_forecast
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mt: 1.5 }}>
              Ensure your CSV has headers in the first row and data in subsequent rows.
            </Typography>
          </Card>
        </Grid>

        {/* Uploaded Files List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              📁 Uploaded Files ({uploadedFiles.length})
            </Typography>

            {uploadedFiles.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#cbd5e1', textAlign: 'center', py: 4 }}>
                No files uploaded yet
              </Typography>
            ) : (
              <List>
                {uploadedFiles.map((file) => (
                  <ListItem
                    key={file.id}
                    secondaryAction={
                      <Button
                        edge="end"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveFile(file.id)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                        }}
                      >
                        Remove
                      </Button>
                    }
                    sx={{
                      mb: 1.5,
                      backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(37, 99, 235, 0.1)',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {file.status === 'Processing' ? (
                        <CircularProgress size={24} sx={{ color: '#2563eb' }} />
                      ) : (
                        <CheckCircleIcon sx={{ color: '#10b981' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${file.size} KB • ${file.uploadedAt}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2.5, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mt: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
        >
          File uploaded successfully! Processing will begin shortly.
        </Alert>
      )}
    </Box>
  );
};

export default UploadData;
