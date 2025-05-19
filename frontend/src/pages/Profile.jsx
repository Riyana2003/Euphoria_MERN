/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Profile = () => { 
    const [activeTab, setActiveTab] = useState('personal');
    const { backendUrl } = useContext(ShopContext);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        dateOfBirth: '',
        bloodGroup: '',
        gender: '',
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
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Please login again');
                navigate('/login');
                return;
            }

            const response = await axios.get(`${backendUrl}/api/profile/get`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
      
            const user = response.data?.user || {};
            const profile = user.profile || {};
      
            setUserData(user);
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                dateOfBirth: profile.dateOfBirth.split('T')[0]  || '',
                bloodGroup: profile.bloodGroup || '',
                gender: profile.gender || ''
            }));
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.response?.data?.message || 'Failed to load profile');
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Please login again');
                navigate('/login');
                return;
            }
            
            const response = await axios.post(
                `${backendUrl}/api/profile/update`,
                {
                    username: formData.username,
                    dateOfBirth: formData.dateOfBirth,
                    bloodGroup: formData.bloodGroup,
                    gender: formData.gender
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    }
                }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully');
                await fetchUserData(); // Refresh data
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
            }
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
            const response = await axios.put(
                `${backendUrl}/api/profile/password`,
                {
                    currentPassword: formData.password,
                    newPassword: formData.newPassword
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    }
                }
            );

            setFormData(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmPassword: ''
            }));

            toast.success(response.data.message || 'Password updated successfully');
        } catch (error) {
            console.error('Password update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
            }
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${backendUrl}/api/profile`, {
                data: { password: formData.deletePassword },
                headers: { 
                    Authorization: `Bearer ${token}` }
            });
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('user_id');
            toast.success('Account deleted successfully');
            navigate('/');
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
            }
        }
    };


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