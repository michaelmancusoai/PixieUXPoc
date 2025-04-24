import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Chip,
  Paper,
  Divider,
  Stack,
  Container,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  ZoomIn as ZoomInIcon,
  RotateRight as RotateRightIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  GridView as GridViewIcon,
  CalendarMonth as CalendarIcon,
  Cloud as CloudIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

import { Patient } from '@/types/dental';

interface PatientImagingProps {
  patient: Patient;
}

const PatientImagingMUI: React.FC<PatientImagingProps> = ({ patient }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Mock image data
  const imageCategories = [
    { id: 'xrays', label: 'X-Rays' },
    { id: 'intraoral', label: 'Intraoral Photos' },
    { id: 'extraoral', label: 'Extraoral Photos' },
    { id: 'documents', label: 'Documents' },
  ];
  
  const mockImages = [
    {
      id: 'img1',
      category: 'xrays',
      title: 'Full Mouth Series',
      date: '2024-03-15',
      thumbnail: 'https://placehold.co/200x150/e9f5ff/0369a1?text=FMX',
      fullImage: 'https://placehold.co/1200x900/e9f5ff/0369a1?text=Full+Mouth+Series',
      description: 'Complete full mouth series. 18 periapicals and 4 bitewings.',
      notes: 'No significant pathology. Minor periapical radiolucency at tooth #30.',
      provider: 'Dr. Smith',
    },
    {
      id: 'img2',
      category: 'xrays',
      title: 'Bitewing X-Rays',
      date: '2024-03-15',
      thumbnail: 'https://placehold.co/200x150/e9f5ff/0369a1?text=BW',
      fullImage: 'https://placehold.co/1200x900/e9f5ff/0369a1?text=Bitewing+X-Rays',
      description: 'Posterior bitewing radiographs.',
      notes: 'Early interproximal decay between #14-15.',
      provider: 'Dr. Smith',
    },
    {
      id: 'img3',
      category: 'xrays',
      title: 'Panoramic',
      date: '2023-11-10',
      thumbnail: 'https://placehold.co/200x150/e9f5ff/0369a1?text=Pano',
      fullImage: 'https://placehold.co/1200x900/e9f5ff/0369a1?text=Panoramic',
      description: 'Panoramic radiograph.',
      notes: 'All third molars present. #17 and #32 impacted.',
      provider: 'Dr. Johnson',
    },
    {
      id: 'img4',
      category: 'intraoral',
      title: 'Anterior View',
      date: '2024-03-15',
      thumbnail: 'https://placehold.co/200x150/fdf2f8/be185d?text=Anterior',
      fullImage: 'https://placehold.co/1200x900/fdf2f8/be185d?text=Anterior+View',
      description: 'Frontal view of anterior teeth.',
      notes: 'Slight gingival inflammation. Patient advised to improve oral hygiene.',
      provider: 'Dr. Smith',
    },
    {
      id: 'img5',
      category: 'intraoral',
      title: 'Upper Occlusal',
      date: '2024-03-15',
      thumbnail: 'https://placehold.co/200x150/fdf2f8/be185d?text=Upper',
      fullImage: 'https://placehold.co/1200x900/fdf2f8/be185d?text=Upper+Occlusal',
      description: 'Occlusal view of maxillary arch.',
      notes: 'Composite restoration on #8 showing good margins.',
      provider: 'Dr. Smith',
    },
    {
      id: 'img6',
      category: 'intraoral',
      title: 'Lower Occlusal',
      date: '2024-03-15',
      thumbnail: 'https://placehold.co/200x150/fdf2f8/be185d?text=Lower',
      fullImage: 'https://placehold.co/1200x900/fdf2f8/be185d?text=Lower+Occlusal',
      description: 'Occlusal view of mandibular arch.',
      notes: 'Heavy staining on lingual surface of anterior teeth.',
      provider: 'Dr. Smith',
    },
    {
      id: 'img7',
      category: 'extraoral',
      title: 'Profile View',
      date: '2024-01-22',
      thumbnail: 'https://placehold.co/200x150/f0fdf4/16a34a?text=Profile',
      fullImage: 'https://placehold.co/1200x900/f0fdf4/16a34a?text=Profile+View',
      description: 'Right side profile photograph.',
      notes: 'Class I facial profile.',
      provider: 'Dr. Davis',
    },
    {
      id: 'img8',
      category: 'extraoral',
      title: 'Frontal Smile',
      date: '2024-01-22',
      thumbnail: 'https://placehold.co/200x150/f0fdf4/16a34a?text=Smile',
      fullImage: 'https://placehold.co/1200x900/f0fdf4/16a34a?text=Frontal+Smile',
      description: 'Frontal view with full smile.',
      notes: 'Balanced smile line. Slight midline deviation.',
      provider: 'Dr. Davis',
    },
    {
      id: 'img9',
      category: 'documents',
      title: 'Specialist Referral',
      date: '2023-10-05',
      thumbnail: 'https://placehold.co/200x150/f5f5f4/78716c?text=Referral',
      fullImage: 'https://placehold.co/1200x1600/f5f5f4/78716c?text=Specialist+Referral+Document',
      description: 'Periodontal consultation referral letter.',
      notes: 'Referred to Dr. Williams for evaluation of localized aggressive periodontitis.',
      provider: 'Dr. Johnson',
    },
  ];
  
  const handleImageClick = (imageId: string) => {
    setSelectedImage(imageId);
  };
  
  const handleCloseImage = () => {
    setSelectedImage(null);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const selectedImageObj = mockImages.find(img => img.id === selectedImage);
  const patientName = patient?.name || 'John Doe';
  const patientId = patient?.id ? patient.id.toString() : '';
  
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Patient Imaging: {patientName}
      </Typography>
      
      {selectedImage ? (
        // Image Viewer
        <Card>
          <CardHeader 
            title={selectedImageObj?.title}
            subheader={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <CalendarIcon sx={{ height: 16, width: 16 }} />
                <Typography variant="body2">
                  {new Date(selectedImageObj?.date || '').toLocaleDateString()}
                </Typography>
              </Box>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<ZoomInIcon />}>
                  Zoom
                </Button>
                <Button variant="outlined" size="small" startIcon={<RotateRightIcon />}>
                  Rotate
                </Button>
                <Button variant="outlined" size="small" onClick={handleCloseImage} startIcon={<GridViewIcon />}>
                  Gallery
                </Button>
              </Box>
            }
          />
          <CardContent sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 0 }}>
            <Box sx={{ maxHeight: 600, overflow: 'hidden', borderRadius: 1, boxShadow: 1 }}>
              <img 
                src={selectedImageObj?.fullImage} 
                alt={selectedImageObj?.title} 
                style={{ objectFit: 'contain', maxHeight: 600, width: 'auto' }}
              />
            </Box>
          </CardContent>
          <CardContent sx={{ pt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Description</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedImageObj?.description}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>Clinical Notes</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedImageObj?.notes}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Provider: {selectedImageObj?.provider}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                  Download
                </Button>
                <Button variant="outlined" size="small" startIcon={<ShareIcon />}>
                  Share
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        // Image Gallery
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="image category tabs"
            >
              {imageCategories.map((category, index) => (
                <Tab key={category.id} label={category.label} id={`image-tab-${index}`} />
              ))}
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<SearchIcon />}>
                Search
              </Button>
              <Button variant="contained" size="small" color="primary" startIcon={<AddIcon />}>
                Add Images
              </Button>
            </Box>
          </Box>
          
          {imageCategories.map((category, index) => (
            <div
              key={category.id}
              role="tabpanel"
              hidden={tabValue !== index}
              id={`image-tabpanel-${index}`}
              aria-labelledby={`image-tab-${index}`}
            >
              {tabValue === index && (
                <Box sx={{ py: 1 }}>
                  <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 2 }}>
                    {mockImages
                      .filter(img => img.category === category.id)
                      .map(image => (
                        <Box key={image.id} sx={{ width: { xs: '100%', sm: '47%', md: '31%', lg: '23%' } }}>
                          <Card 
                            sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column',
                              cursor: 'pointer',
                              '&:hover': { boxShadow: 3 }
                            }}
                            onClick={() => handleImageClick(image.id)}
                          >
                            <Box sx={{ height: 180, bgcolor: 'grey.100', overflow: 'hidden' }}>
                              <img 
                                src={image.thumbnail} 
                                alt={image.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                            <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 1.5 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {image.title}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CalendarIcon sx={{ height: 12, width: 12, mr: 0.5 }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(image.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={category.label}
                                  variant="outlined"
                                  size="small"
                                  sx={{ fontSize: '0.65rem', height: 20 }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                  </Stack>
                  
                  {mockImages.filter(img => img.category === category.id).length === 0 && (
                    <Paper 
                      sx={{ 
                        textAlign: 'center', 
                        py: 5, 
                        px: 2, 
                        bgcolor: 'grey.50', 
                        mt: 2 
                      }}
                    >
                      <CloudIcon sx={{ width: 48, height: 48, margin: '0 auto', color: 'rgba(0,0,0,0.3)' }} />
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        No {category.label} Available
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        There are no images in this category yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<AddIcon />}
                      >
                        Add Images
                      </Button>
                    </Paper>
                  )}
                </Box>
              )}
            </div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PatientImagingMUI;