/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        bloodGroup: '',
        gender: '',
        addresses: [],
        newAddress: {
            type: 'Home',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        deletePassword: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get('/api/profile', {
            headers: {token}
          });
      
          // Safely handle response
          const user = response.data?.user || {};
          const profile = user.profile || {}; // Fallback if profile missing
      
          setUserData(user);
          setFormData(prev => ({
            ...prev,
            fullName: profile.fullName || '',
            dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
            bloodGroup: profile.bloodGroup || '',
            gender: profile.gender || '',
            addresses: profile.addresses || []
          }));
        } catch (error) {
          console.error("Fetch error:", error);
          toast.error(error.response?.data?.message || 'Failed to load profile');
        }
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            newAddress: {
                ...prev.newAddress,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleAddAddress = () => {
        const newAddresses = [...formData.addresses, formData.newAddress];
        // Ensure only one default address
        if (formData.newAddress.isDefault) {
            newAddresses.forEach(addr => addr.isDefault = false);
            newAddresses[newAddresses.length - 1].isDefault = true;
        }
        setFormData(prev => ({
            ...prev,
            addresses: newAddresses,
            newAddress: {
                type: 'Home',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                isDefault: false
            }
        }));
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = [...formData.addresses];
        newAddresses.splice(index, 1);
        setFormData(prev => ({ ...prev, addresses: newAddresses }));
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.put('/api/profile', {
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth,
                bloodGroup: formData.bloodGroup,
                gender: formData.gender
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Profile updated successfully');
            fetchUserData();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.put('/api/profile/address', {
                addresses: formData.addresses
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Addresses updated successfully');
            fetchUserData();
        } catch (error) {
            toast.error('Failed to update addresses');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put('/api/profile/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, {
                headers: {token}
            });
            localStorage.setItem('authToken', response.data.token);
            toast.success('Password changed successfully');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete('/api/profile/account', {
                data: { password: formData.deletePassword },
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Account deleted successfully');
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    if (!userData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`px-4 py-2 text-left rounded ${activeTab === 'personal' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            Personal Information
                        </button>
                        <button
                            onClick={() => setActiveTab('address')}
                            className={`px-4 py-2 text-left rounded ${activeTab === 'address' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            My Addresses
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 text-left rounded ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`px-4 py-2 text-left rounded ${activeTab === 'wishlist' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            Wishlist
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-4 py-2 text-left rounded ${activeTab === 'password' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => setActiveTab('delete')}
                            className={`px-4 py-2 text-left rounded text-red-600 ${activeTab === 'delete' ? 'bg-red-100' : 'hover:bg-gray-100'}`}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-lg shadow p-6">
                    {/* Personal Information */}
                    {activeTab === 'personal' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                            <form onSubmit={handleSubmitProfile}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Addresses */}
                    {activeTab === 'address' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Addresses</h2>
                            <form onSubmit={handleSubmitAddress}>
                                <div className="mb-6">
                                    {formData.addresses.map((address, index) => (
                                        <div key={index} className="border p-4 rounded-md mb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{address.type} {address.isDefault && '(Default)'}</p>
                                                    <p>{address.street}, {address.city}</p>
                                                    <p>{address.state}, {address.zipCode}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAddress(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                        <select
                                            name="type"
                                            value={formData.newAddress.type}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.newAddress.isDefault}
                                            onChange={handleAddressChange}
                                            className="mr-2"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Set as default address</label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.newAddress.street}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.newAddress.city}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.newAddress.state}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.newAddress.zipCode}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleAddAddress}
                                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Add Address
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Save All Addresses
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Orders */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                            <div className="bg-gray-100 p-4 rounded-md">
                                <p>Order history will appear here</p>
                                {/* You would map through orders here */}
                            </div>
                        </div>
                    )}

                    {/* Wishlist */}
                    {activeTab === 'wishlist' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {/* You would map through wishlist items here */}
                                <p>Wishlist items will appear here</p>
                            </div>
                        </div>
                    )}

                    {/* Change Password */}
                    {activeTab === 'password' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                            <form onSubmit={handleChangePassword}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Change Password
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Delete Account */}
                    {activeTab === 'delete' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Delete Account</h2>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <p className="text-red-700">Warning: This action is permanent and cannot be undone. All your data will be deleted.</p>
                            </div>
                            <form onSubmit={handleDeleteAccount}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter your password to confirm</label>
                                    <input
                                        type="password"
                                        name="deletePassword"
                                        value={formData.deletePassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete My Account
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;