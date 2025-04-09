/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
  const token = localStorage.getItem('token');  

  // Main product images
  const [mainImages, setMainImages] = useState([null, null, null, null]);
  
  // Product details
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [bestseller, setBestSeller] = useState(false);
  
  // Shades management
  const [shades, setShades] = useState([]);
  const [newShade, setNewShade] = useState({
    name: '',
    colorCode: '#ffffff',
    images: [null, null, null, null]
  });

  const handleAddShade = () => {
    if (!newShade.name.trim()) {
      toast.warning('Please enter a shade name');
      return;
    }
    
    if (!newShade.images.some(img => img !== null)) {
      toast.warning('Please upload at least one image for the shade');
      return;
    }
    
    setShades([...shades, {
      name: newShade.name,
      colorCode: newShade.colorCode,
      images: newShade.images.filter(img => img !== null)
    }]);
    
    setNewShade({
      name: '',
      colorCode: '#ffffff',
      images: [null, null, null, null]
    });
  };

  const handleRemoveShade = (index) => {
    const updatedShades = [...shades];
    updatedShades.splice(index, 1);
    setShades(updatedShades);
  };

  const handleShadeImageChange = (imageIndex, e) => {
    const updatedImages = [...newShade.images];
    updatedImages[imageIndex] = e.target.files[0];
    setNewShade({...newShade, images: updatedImages});
  };

  const handleMainImageChange = (imageIndex, e) => {
    const updatedImages = [...mainImages];
    updatedImages[imageIndex] = e.target.files[0];
    setMainImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mainImages.some(img => img !== null)) {
      toast.error('Please upload at least one main product image');
      return;
    }

    if (shades.length === 0) {
      toast.error('Please add at least one shade variation');
      return;
    }

    const shadeWithNoImages = shades.find(shade => shade.images.length === 0);
    if (shadeWithNoImages) {
      toast.error(`Shade "${shadeWithNoImages.name}" has no images`);
      return;
    }

    try {
      const formData = new FormData();
      
      // Add product details
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('bestseller', bestseller);
      
      // Add main product images
      mainImages.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      // Add shade names
      const shadeNames = shades.map(shade => shade.name);
      formData.append('shadeNames', JSON.stringify(shadeNames));

      // Add shade images with proper field names (shade0_image1, shade1_image1, etc.)
      shades.forEach((shade, shadeIndex) => {
        shade.images.forEach((image, imageIndex) => {
          if (image) {
            formData.append(`shade${shadeIndex}_image${imageIndex + 1}`, image);
          }
        });
      });

      // Add color codes for each shade
      shades.forEach((shade, shadeIndex) => {
        formData.append(`shadeColor${shadeIndex}`, shade.colorCode);
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'token': token
        },
      });

      if (response.data.success) {
        toast.success('Product added successfully!');
        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setCategory('');
        setBrand('');
        setBestSeller(false);
        setShades([]);
        setMainImages([null, null, null, null]);
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        toast.error(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    }
  };

  return (
    <form className='flex flex-col w-full items-start gap-4 p-4 max-w-4xl mx-auto' onSubmit={handleSubmit}>
      <h1 className='text-2xl font-bold mb-2'>Add New Product</h1>
      
      {/* Main Product Images */}
      <div className='w-full'>
        <p className='mb-2 font-medium'>Main Product Images (1-4 images)</p>
        <div className='flex gap-4'>
          {[0, 1, 2, 3].map((index) => (
            <label key={index} className='flex flex-col items-center'>
              <img 
                className='w-24 h-24 object-cover border rounded-md'
                src={mainImages[index] ? URL.createObjectURL(mainImages[index]) : assets.upload_area} 
                alt={`Main preview ${index+1}`}
              />
              <input 
                onChange={(e) => handleMainImageChange(index, e)}
                type='file' 
                className='hidden' 
                accept='image/*'
              />
              <span className='text-xs mt-1'>Image {index+1}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
        <div>
          <label className='block mb-1 font-medium'>Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            placeholder='Enter product name'
            required
          />
        </div>
        
        <div>
          <label className='block mb-1 font-medium'>Price</label>
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            placeholder='Enter price'
            required
          />
        </div>
        
        <div className='md:col-span-2'>
          <label className='block mb-1 font-medium'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            rows={3}
            placeholder='Enter product description'
            required
          />
        </div>
        
        <div>
          <label className='block mb-1 font-medium'>Brand</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            required
          >
            <option value=''>Select Brand</option>
            <option value='Dior'>DIOR</option>
            <option value='Estee Lauder'>ESTEE LAUDER</option>
            <option value='Armani Beauty'>ARMANI BEAUTY</option>
          </select>
        </div>
        
        <div>
          <label className='block mb-1 font-medium'>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            required
          >
            <option value=''>Select Category</option>
            <option value='Face'>FACE</option>
            <option value='Eyes'>EYES</option>
            <option value='Lips'>LIPS</option>
            <option value='Tools'>TOOLS & MAKEUP SETS</option>
          </select>
        </div>
      </div>

      {/* Shade Management */}
      <div className='w-full border-t pt-4 mt-4'>
        <h2 className='text-xl font-bold mb-4'>Shade Variations</h2>
        
        {/* Add New Shade Form */}
        <div className='bg-gray-50 p-4 rounded-lg mb-4'>
          <h3 className='font-medium mb-3'>Add New Shade</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block mb-1 text-sm'>Shade Name</label>
              <input
                value={newShade.name}
                onChange={(e) => setNewShade({...newShade, name: e.target.value})}
                className='w-full px-3 py-2 border rounded'
                placeholder='e.g., Ruby Red'
                required
              />
            </div>
            
            <div>
              <label className='block mb-1 text-sm'>Color Code</label>
              <div className='flex items-center gap-2'>
                <input
                  type='color'
                  value={newShade.colorCode}
                  onChange={(e) => setNewShade({...newShade, colorCode: e.target.value})}
                  className='h-10 w-10 cursor-pointer'
                />
                <input
                  type='text'
                  value={newShade.colorCode}
                  onChange={(e) => setNewShade({...newShade, colorCode: e.target.value})}
                  className='flex-1 px-3 py-2 border rounded'
                  maxLength={7}
                  required
                />
              </div>
            </div>
          </div>

          {/* Shade Images */}
          <div className='mt-4'>
            <label className='block mb-2 text-sm font-medium'>Shade Images (1-4 images)</label>
            <div className='flex gap-4'>
              {[0, 1, 2, 3].map((index) => (
                <label key={index} className='flex flex-col items-center'>
                  <img 
                    className='w-20 h-20 object-cover border rounded-md'
                    src={newShade.images[index] ? URL.createObjectURL(newShade.images[index]) : assets.upload_area} 
                    alt={`Shade preview ${index+1}`}
                  />
                  <input 
                    onChange={(e) => handleShadeImageChange(index, e)}
                    type='file' 
                    className='hidden' 
                    accept='image/*'
                  />
                  <span className='text-xs mt-1'>Image {index+1}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button
            type='button'
            onClick={handleAddShade}
            className='mt-3 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600'
            disabled={!newShade.name.trim()}
          >
            Add Shade
          </button>
        </div>
        
        {/* Existing Shades List */}
        {shades.length > 0 && (
          <div className='border rounded-lg overflow-hidden'>
            <div className='grid grid-cols-12 bg-gray-100 p-2 font-medium text-sm'>
              <div className='col-span-3'>Shade Name</div>
              <div className='col-span-2'>Color</div>
              <div className='col-span-5'>Images</div>
              <div className='col-span-2'>Action</div>
            </div>
            
            {shades.map((shade, index) => (
              <div key={index} className='grid grid-cols-12 items-center p-2 border-b hover:bg-gray-50'>
                <div className='col-span-3 font-medium'>{shade.name}</div>
                <div className='col-span-2 flex items-center gap-2'>
                  <div 
                    className='w-6 h-6 rounded-full border' 
                    style={{backgroundColor: shade.colorCode}}
                  />
                </div>
                <div className='col-span-5 flex gap-2'>
                  {shade.images.map((image, imgIndex) => (
                    image && (
                      <img 
                        key={imgIndex}
                        src={URL.createObjectURL(image)} 
                        alt={`${shade.name} ${imgIndex+1}`} 
                        className='w-10 h-10 object-cover rounded'
                      />
                    )
                  ))}
                </div>
                <div className='col-span-2'>
                  <button
                    type='button'
                    onClick={() => handleRemoveShade(index)}
                    className='text-red-500 hover:text-red-700 text-sm'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bestseller Option */}
      <div className='flex items-center gap-2 mt-4'>
        <input
          type='checkbox'
          id='bestseller'
          checked={bestseller}
          onChange={(e) => setBestSeller(e.target.checked)}
          className='w-4 h-4'
        />
        <label htmlFor='bestseller' className='font-medium'>
          Mark as Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        className='mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium'
        disabled={!name || !price || !description || !category || !brand || shades.length === 0}
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;