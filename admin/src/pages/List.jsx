/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const token = localStorage.getItem('token'); 
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token }, 
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching list:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: { token }, 
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing product:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error removing product');
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
        <button 
          onClick={() => navigate('/add-product')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className='grid grid-cols-12 gap-4 items-center py-3 px-6 bg-gray-50 text-sm font-medium text-gray-600 uppercase tracking-wider'>
          <div className="col-span-2 md:col-span-1">Image</div>
          <div className="col-span-10 md:col-span-3">Name</div>
          <div className="hidden md:block md:col-span-2">Brand</div>
          <div className="hidden md:block md:col-span-2">Category</div>
          <div className="hidden md:block md:col-span-2 text-right">Price</div>
          <div className="col-span-12 md:col-span-2 text-center">Actions</div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          /* Product List */
          list.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-4 items-center py-4 px-6 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="col-span-2 md:col-span-1">
                  <img 
                    className='w-12 h-12 object-cover rounded-md' 
                    src={item.image?.[0] || 'https://via.placeholder.com/50'} 
                    alt={item.name} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                  />
                </div>
                <div className="col-span-10 md:col-span-3 font-medium text-gray-800">
                  {item.name}
                </div>
                <div className="hidden md:block md:col-span-2 text-gray-600">
                  {item.brand || '-'}
                </div>
                <div className="hidden md:block md:col-span-2 text-gray-600">
                  {item.category || '-'}
                </div>
                <div className="hidden md:block md:col-span-2 text-right font-medium">
                  {currency}
                  {item.price?.toLocaleString() || '0'}
                </div>
                <div className="col-span-12 md:col-span-2 flex justify-center gap-4">
                  <button
                    onClick={() => handleEditProduct(item._id)}
                    className="text-pink-400 hover:text-pink-600 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors"
                    title='Edit Product'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer p-2 rounded-full hover:bg-red-50 transition-colors"
                    title='Delete Product'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No products available</p>
              <button 
                onClick={() => navigate('/add-product')}
                className="mt-4 text-pink-400 hover:text-pink-600 font-medium"
              >
                Add your first product
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default List;