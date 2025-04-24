/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Profile = () => { 
    const [activeTab, setActiveTab] = useState('personal');
    const { backendUrl} = useContext(ShopContext);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: '', 
        dateOfBirth: '',
        bloodGroup: '',
        gender: '',
        addresses: [],
        newAddress: {
            type: 'Home',
            address_details: '',
            number: ''
        },
        password: '',
        newPassword: '',
        confirmPassword: '',
        deletePassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                toast.error('User ID not found. Please login again.');
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${backendUrl}/api/profile/`, {
                headers: { token }
            });
      
            const user = response.data?.user || {};
            const profile = user.profile || {};
      
            setUserData(user);
            setFormData(prev => ({
                ...prev,
                username: user.username || '', 
                dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
                bloodGroup: profile.bloodGroup || '',
                gender: profile.gender || '',
                addresses: profile.addresses || []
            }));
            setIsEditing(false);
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            newAddress: {
                ...prev.newAddress,
                [name]: value
            }
        }));
    };

    const handleAddAddress = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                toast.error('User ID not found. Please login again.');
                return;
            }

            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${backendUrl}/api/profile/address`,
                formData.newAddress,
                { headers: { token } }
            );
            
            toast.success('Address added successfully');
            fetchUserData();
            setFormData(prev => ({
                ...prev,
                newAddress: {
                    type: 'Home',
                    address_details: '',
                    number: ''
                }
            }));
        } catch (error) {
            console.error("Add address error:", error);
            toast.error(error.response?.data?.message || 'Failed to add address');
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Authentication token not found');
                return;
            }
            
            // Update profile info
            const response = await axios.put(
                `${backendUrl}/api/profile`,
                {
                    username: formData.username,
                    dateOfBirth: formData.dateOfBirth,
                    bloodGroup: formData.bloodGroup,
                    gender: formData.gender
                },
                {
                    headers: { token }
                }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully');
                // Update local state with the new data
                setUserData(response.data.user);
                setIsEditing(false);
            } else {
                toast.error(response.data.message || 'Profile update failed');
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
    
        if (formData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `${backendUrl}/api/profile/password`,
                {
                    currentPassword: formData.password,
                    newPassword: formData.newPassword
                },
                {
                    headers: { token }
                }
            );
    
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
    
            setFormData(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmPassword: ''
            }));
    
            toast.success('Password updated successfully');
        } catch (error) {
            console.error('Password update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${backendUrl}/api/profile/password`, {
                data: { password: formData.deletePassword },
                headers: { token }
            });
            toast.success('Account deleted successfully');
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error("Delete account error:", error);
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
                            onClick={() => {
                                setActiveTab('personal');
                                setIsEditing(false);
                            }}
                            className={`px-4 py-2 text-left rounded transition-colors ${activeTab === 'personal' ? 'bg-pink-100 text-pink-500' : 'hover:bg-gray-100'}`}
                        >
                            Personal Information
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('address');
                                setIsEditing(false);
                            }}
                            className={`px-4 py-2 text-left rounded transition-colors ${activeTab === 'address' ? 'bg-pink-100 text-pink-500' : 'hover:bg-gray-100'}`}
                        >
                            My Addresses
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-4 py-2 text-left rounded transition-colors ${activeTab === 'password' ? 'bg-pink-100 text-pink-500' : 'hover:bg-gray-100'}`}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => setActiveTab('delete')}
                            className={`px-4 py-2 text-left rounded transition-colors text-red-600 ${activeTab === 'delete' ? 'bg-red-100' : 'hover:bg-gray-100'}`}
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
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-pink-500">Personal Information</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                            
                            {isEditing ? (
                                <form onSubmit={handleSubmitProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                            <select
                                                name="bloodGroup"
                                                value={formData.bloodGroup}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                     <div className="border-b pb-4">
                                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                                        <p className="mt-1 text-lg">{formData.username || 'Not provided'}</p>
                                    </div>
                                    <div className="border-b pb-4">
                                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                                        <p className="mt-1 text-lg">{formData.dateOfBirth || 'Not provided'}</p>
                                    </div>
                                    <div className="border-b pb-4">
                                        <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
                                        <p className="mt-1 text-lg">{formData.bloodGroup || 'Not provided'}</p>
                                    </div>
                                    <div className="border-b pb-4">
                                        <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                                        <p className="mt-1 text-lg">{formData.gender || 'Not provided'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Addresses */}
                    {activeTab === 'address' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-pink-500">My Addresses</h2>
                            <div className="mb-6">
                                {formData.addresses.length > 0 ? (
                                    formData.addresses.map((address, index) => (
                                        <div key={address._id || index} className="border p-4 rounded-md mb-4 hover:border-pink-300 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{address.type}</p>
                                                    <p>{address.address_details}</p>
                                                    <p>Contact Number: {address.number}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAddress(address._id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No addresses saved yet.</p>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold mb-4 text-pink-500">Add New Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                    <select
                                        name="type"
                                        value={formData.newAddress.type}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <input
                                        type="text"
                                        name="number"
                                        value={formData.newAddress.number}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Details</label>
                                    <textarea
                                        name="address_details"
                                        value={formData.newAddress.address_details}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddAddress}
                                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                            >
                                Add Address
                            </button>
                        </div>
                    )}

                    {/* Change Password */}
                    {activeTab === 'password' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-pink-500">Change Password</h2>
                            <form onSubmit={handleChangePassword}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                                >
                                    Change Password
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Delete Account */}
                    {activeTab === 'delete' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-pink-500">Delete Account</h2>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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