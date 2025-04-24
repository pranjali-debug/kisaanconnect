import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, MapPin } from 'lucide-react';
import { ProduceItem } from '../types';
import LocationPickerMap from './LocationPickerMap';

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<ProduceItem, 'id'>) => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<ProduceItem, 'id'>>({
    name: '',
    farmer: '',
    location: '',
    quantity: '',
    price: 0,
    unit: 'kg',
    image: '',
    category: 'Vegetables',
    available: true,
    coordinates: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.farmer.trim()) {
      newErrors.farmer = 'Farmer name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Please upload an image file (JPEG, PNG, etc.)'
      }));
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'Image file is too large (max 5MB)'
      }));
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setFormData(prev => ({
        ...prev,
        image: result
      }));
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleLocationSelect = (location: { address: string; coordinates: { lat: number; lng: number } }) => {
    setFormData(prev => ({
      ...prev,
      location: location.address,
      coordinates: location.coordinates
    }));

    // Clear error
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const handleClickUploadButton = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        farmer: '',
        location: '',
        quantity: '',
        price: 0,
        unit: 'kg',
        image: '',
        category: 'Vegetables',
        available: true,
        coordinates: undefined
      });
      setImagePreview(null);
      setShowLocationPicker(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-kisaan-darkbrown">
            Add Your Produce
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-100 p-1.5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            {/* Farmer Name */}
            <div>
              <label htmlFor="farmer" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Farmer Name *
              </label>
              <input
                type="text"
                id="farmer"
                name="farmer"
                value={formData.farmer}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.farmer ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green`}
                placeholder="Enter farmer name"
              />
              {errors.farmer && <p className="text-red-500 text-xs mt-1">{errors.farmer}</p>}
            </div>

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Location *
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-kisaan-green`}
                  placeholder="Enter location or use map"
                  readOnly={showLocationPicker}
                />
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="px-3 bg-kisaan-green text-white rounded-r-md hover:bg-kisaan-green/90 transition-colors"
                  title={showLocationPicker ? "Hide map" : "Pick location on map"}
                >
                  <MapPin size={20} />
                </button>
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green`}
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Unit *
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="piece">piece</option>
                <option value="dozen">dozen</option>
                <option value="quintal">quintal</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Quantity Available *
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green`}
                placeholder="Enter available quantity"
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Product Image *
              </label>
              <input 
                type="file"
                id="image-upload"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div 
                onClick={handleClickUploadButton}
                className={`w-full p-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} 
                  rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors
                  flex items-center justify-center gap-2 h-[42px]`}
              >
                <ImageIcon size={18} className="text-gray-500" />
                <span className="text-gray-500 text-sm">
                  {imagePreview ? 'Change Image' : 'Upload Product Image'}
                </span>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>
          </div>

          {/* Location Picker Map */}
          {showLocationPicker && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-kisaan-darkbrown mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Pick Your Location
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Click on the map, drag the marker, or use the "locate me" button to select your location.
              </p>
              <LocationPickerMap 
                onLocationSelect={handleLocationSelect}
                initialAddress={formData.location}
                initialCoordinates={formData.coordinates}
              />
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-6">
              <p className="text-sm font-medium text-kisaan-darkbrown mb-2">Image Preview:</p>
              <div className="relative h-60 w-60 border border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={() => {
                    setImagePreview(null);
                    setErrors(prev => ({ ...prev, image: 'Invalid image file' }));
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-8 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-kisaan-darkbrown hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-kisaan-green hover:bg-kisaan-green/90 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;