/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HeroManager = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    buttonText: 'SHOP NOW',
    isActive: true,
    order: 0,
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/hero`);
      setHeroImages(response.data);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast.error('Failed to fetch hero images');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('buttonText', formData.buttonText);
    data.append('isActive', formData.isActive);
    data.append('order', formData.order);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await axios.put(`${backendUrl}/api/hero/:id`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Hero image updated successfully');
      } else {
        await axios.post(`${backendUrl}/api/hero`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Hero image added successfully');
      }
      resetForm();
      fetchHeroImages();
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast.error(error.response?.data?.message || 'Failed to save hero image');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      buttonText: 'SHOP NOW',
      isActive: true,
      order: 0,
      image: null
    });
    setEditingId(null);
  };

  const editImage = (image) => {
    setFormData({
      title: image.title,
      price: image.price,
      buttonText: image.buttonText,
      isActive: image.isActive,
      order: image.order,
      image: null
    });
    setEditingId(image._id);
  };

  const deleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero image?')) {
      try {
        await axios.delete(`${backendUrl}/api/hero/:id`);
        toast.success('Hero image deleted successfully');
        fetchHeroImages();
      } catch (error) {
        console.error('Error deleting hero image:', error);
        toast.error('Failed to delete hero image');
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Hero Images</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Text*</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-pink-500 focus:ring-pink-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Active</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editingId ? 'Replace Image (leave blank to keep current)' : 'Image*'}
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              accept="image/*"
              required={!editingId}
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : editingId ? 'Update Image' : 'Add Image'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Current Hero Images</h3>
        
        {heroImages.length === 0 ? (
          <p className="text-gray-500">No hero images added yet.</p>
        ) : (
          <div className="space-y-4">
            {heroImages.map((image) => (
              <div key={image._id} className="flex items-center p-4 border rounded-lg">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={`${backendUrl}${image.imageUrl}`}
                    alt={image.title}
                    className="h-20 w-32 object-cover rounded"
                  />
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-medium">{image.title}</h4>
                  <p className="text-sm text-gray-600">{image.price}</p>
                  <p className="text-sm">Order: {image.order} | Status: 
                    <span className={image.isActive ? "text-green-600" : "text-red-600"}>
                      {image.isActive ? ' Active' : ' Inactive'}
                    </span>
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => editImage(image)}
                    className="p-2 text-pink-500 hover:text-pink-600"
                  >
                    <img src={assets.edit_icon} alt="Edit" className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => deleteImage(image._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <img src={assets.delete_icon} alt="Delete" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroManager;