import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Divider,
  Card,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  AddLocationAlt,
  LocationOn,
  PhotoCamera,
  Delete,
  CloudUpload,
  NavigateBefore,
  NavigateNext,
  Edit,
} from '@mui/icons-material';
import { useProducts } from '../contexts/ProductsContext';
import GoogleMapComponent from '../components/maps/GoogleMapComponent';

const categories = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains & Cereals' },
  { value: 'dairy', label: 'Dairy & Eggs' },
  { value: 'meat', label: 'Meat & Poultry' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'herbs', label: 'Herbs & Spices' },
  { value: 'honey', label: 'Honey & Preserves' },
  { value: 'other', label: 'Other Products' },
];

const units = [
  { value: 'kg', label: 'Kilograms' },
  { value: 'g', label: 'Grams' },
  { value: 'lb', label: 'Pounds' },
  { value: 'oz', label: 'Ounces' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'ltr', label: 'Liters' },
  { value: 'ml', label: 'Milliliters' },
];

const farmingMethods = [
  { value: 'organic', label: 'Organic' },
  { value: 'conventional', label: 'Conventional' },
  { value: 'hydroponic', label: 'Hydroponic' },
  { value: 'aquaponic', label: 'Aquaponic' },
  { value: 'biodynamic', label: 'Biodynamic' },
];

const qualityGrades = [
  { value: 'A', label: 'Grade A' },
  { value: 'B', label: 'Grade B' },
  { value: 'C', label: 'Grade C' },
];

const storageOptions = [
  { value: 'refrigerated', label: 'Refrigerated' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'dry', label: 'Dry Storage' },
  { value: 'cool', label: 'Cool Storage' },
];

const validationSchema = yup.object({
  name: yup.string('Enter product name').required('Product name is required'),
  category: yup.string('Select category').required('Category is required'),
  price: yup.number('Enter price').required('Price is required').positive('Price must be positive'),
  description: yup.string('Enter description').required('Description is required'),
  quantity: yup.number('Enter quantity').required('Quantity is required').positive('Quantity must be positive'),
  unit: yup.string('Select unit').required('Unit is required'),
});

const AddProductPage = () => {
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      price: '',
      description: '',
      quantity: '',
      unit: '',
      harvestDate: '',
      bestBefore: '',
      farmingMethod: '',
      qualityGrade: '',
      storageRequirements: '',
      minimumOrder: '',
      deliveryAvailable: false,
      latitude: null,
      longitude: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await addProduct(values, images);
        navigate('/products');
      } catch (error) {
        console.error('Error adding product:', error);
        setError('Failed to add product. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSelectLocation = (lat, lng) => {
    formik.setFieldValue('latitude', lat);
    formik.setFieldValue('longitude', lng);
    setMapOpen(false);
  };

  const steps = ['Product Information', 'Product Details', 'Location & Images', 'Review'];

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Add New Product
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details to list your product
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {/* Step 1: Product Information */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Product Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Category"
                      error={formik.touched.category && Boolean(formik.errors.category)}
                    >
                      {categories.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <FormHelperText error>{formik.errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="price"
                    name="price"
                    label="Price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {/* Step 2: Product Details */}
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="unit-label">Unit</InputLabel>
                    <Select
                      labelId="unit-label"
                      id="unit"
                      name="unit"
                      value={formik.values.unit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Unit"
                      error={formik.touched.unit && Boolean(formik.errors.unit)}
                    >
                      {units.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.unit && formik.errors.unit && (
                      <FormHelperText error>{formik.errors.unit}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="harvestDate"
                    name="harvestDate"
                    label="Harvest Date"
                    type="date"
                    value={formik.values.harvestDate || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="bestBefore"
                    name="bestBefore"
                    label="Best Before Date"
                    type="date"
                    value={formik.values.bestBefore || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="farmingMethod-label">Farming Method</InputLabel>
                    <Select
                      labelId="farmingMethod-label"
                      id="farmingMethod"
                      name="farmingMethod"
                      value={formik.values.farmingMethod}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Farming Method"
                    >
                      {farmingMethods.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="qualityGrade-label">Quality Grade</InputLabel>
                    <Select
                      labelId="qualityGrade-label"
                      id="qualityGrade"
                      name="qualityGrade"
                      value={formik.values.qualityGrade}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Quality Grade"
                    >
                      {qualityGrades.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="storageRequirements-label">Storage Requirements</InputLabel>
                    <Select
                      labelId="storageRequirements-label"
                      id="storageRequirements"
                      name="storageRequirements"
                      value={formik.values.storageRequirements}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Storage Requirements"
                    >
                      {storageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="minimumOrder"
                    name="minimumOrder"
                    label="Minimum Order"
                    type="number"
                    value={formik.values.minimumOrder || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{formik.values.unit}</InputAdornment>,
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.deliveryAvailable}
                        onChange={formik.handleChange}
                        name="deliveryAvailable"
                        color="primary"
                      />
                    }
                    label="Delivery Available"
                  />
                </Grid>
              </Grid>
            )}

            {/* Step 3: Location & Images */}
            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Product Location
                  </Typography>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    {formik.values.latitude && formik.values.longitude ? (
                      <Box>
                        <Typography variant="body1" gutterBottom>
                          Selected Location: {formik.values.latitude.toFixed(6)}, {formik.values.longitude.toFixed(6)}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => setMapOpen(true)}
                          sx={{ mt: 1 }}
                        >
                          Change Location
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <AddLocationAlt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body1" gutterBottom>
                          No location selected yet
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<LocationOn />}
                          onClick={() => setMapOpen(true)}
                          sx={{ mt: 1 }}
                        >
                          Select Location on Map
                        </Button>
                      </Box>
                    )}

                    {mapOpen && (
                      <Box sx={{ mt: 2, height: '400px' }}>
                        <GoogleMapComponent onSelectLocation={handleSelectLocation} />
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Product Images
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="product-images"
                        multiple
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="product-images">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<PhotoCamera />}
                          disabled={images.length >= 5}
                        >
                          Upload Images
                        </Button>
                      </label>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        You can upload up to 5 images (JPG, PNG). First image will be the main product image.
                      </Typography>
                    </Box>

                    {previews.length > 0 ? (
                      <Grid container spacing={2}>
                        {previews.map((preview, index) => (
                          <Grid item xs={4} sm={3} md={2} key={index}>
                            <Box sx={{ position: 'relative' }}>
                              <Card>
                                <CardMedia
                                  component="img"
                                  height="120"
                                  image={preview}
                                  alt={`Product preview ${index + 1}`}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                                  }}
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <Delete />
                                </IconButton>
                              </Card>
                              {index === 0 && (
                                <Chip
                                  label="Main"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 5,
                                    left: 5,
                                  }}
                                />
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <CloudUpload sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                          No images uploaded yet
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Step 4: Review */}
            {activeStep === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Review Your Product Details
                  </Typography>
                  <Paper sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Product Name
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {formik.values.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Category
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {categories.find(c => c.value === formik.values.category)?.label || formik.values.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          ${formik.values.price} / {formik.values.unit}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Quantity
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {formik.values.quantity} {formik.values.unit}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {formik.values.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Farming Method
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {farmingMethods.find(f => f.value === formik.values.farmingMethod)?.label || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Quality Grade
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {qualityGrades.find(q => q.value === formik.values.qualityGrade)?.label || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Images
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {previews.length > 0 ? (
                            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
                              {previews.map((preview, index) => (
                                <Box
                                  key={index}
                                  component="img"
                                  src={preview}
                                  alt={`Product preview ${index + 1}`}
                                  sx={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 1 }}
                                />
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No images uploaded
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {formik.values.latitude && formik.values.longitude
                            ? `${formik.values.latitude.toFixed(6)}, ${formik.values.longitude.toFixed(6)}`
                            : 'No location specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<NavigateBefore />}
                variant="outlined"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formik.isSubmitting || loading}
                  endIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  List Product
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<NavigateNext />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProductPage;