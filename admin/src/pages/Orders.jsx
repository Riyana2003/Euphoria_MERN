/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { token }, 
      });

      if (response.data.success) {
        setOrders(response.data.data); // Update orders state with fetched data
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching orders');

    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`, 
        { orderId, status: newStatus },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        // Update the order status in the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success('Order status updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating order status');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Items</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Payment Method</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">{order.userId}</td>
                <td className="py-2 px-4 border-b">
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item._id} - Qty: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 border-b">${order.amount}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-2 px-4 border-b text-center text-gray-500">
                No orders available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;