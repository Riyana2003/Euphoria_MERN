/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = () => {
  const token = localStorage.getItem('token'); 
  const [list, setList] = useState([]);

  const fetchList = async () => {
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
    }
  };

  const removeProduct = async (id) => {
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
        await fetchList(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing product:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error removing product');
    }
  };

  useEffect(() => {
    fetchList();
  }, []); // Fetch product list when component mounts

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Brand</b>
          <b>Category</b>
          <b className='text-center'>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
            >
              <img className='w-12' src={item.image?.[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.brand}</p>
              <p>{item.category}</p>
              <p className='text-center'>
                {currency}
                {item.price}
              </p>
              <p
                onClick={() => removeProduct(item._id)}
                className='text-right md:text-center cursor-pointer text-lg text-red-500 hover:text-red-700'
              >
                X
              </p>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>No products available</p>
        )}
      </div>
    </>
  );
};

export default List;