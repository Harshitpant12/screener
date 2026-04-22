import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, History, Settings as SettingsIcon, LogOut, 
    Menu, User, Mail, Lock, Shield, CreditCard, AlertTriangle, Loader2 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name || '', email: user.email || '' });
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        const toastId = toast.loading('Updating profile...');

        try {
            // We will need to add an app.put('/api/auth/me') route in our backend for this
            await api.put('/auth/me', profileData);
            toast.success('Profile updated successfully.', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update endpoint not implemented yet.', { id: toastId });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setIsSavingPassword(true);
        const toastId = toast.loading('Securing new password...');

        try {
            await api.put('/auth/password', passwords);
            toast.success('Password updated successfully.', { id: toastId });
            setPasswords({ currentPassword: '', newPassword: '' }); // Clear fields
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update endpoint not implemented yet.', { id: toastId });
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex font-sans">
            <Toaster position="top-center" />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-300 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <span className="font-black text-xl tracking-tighter text-white font-jetbrains">SkillSync</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-colors">
                        <LayoutDashboard size={18} /> New Scan
                    </Link>
                    <Link to="/history" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-colors">
                        <History size={18} /> Scan History
                    </Link>
                    {/* Active State */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl font-medium transition-colors cursor-default">
                        <SettingsIcon size={18} /> Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">{user?.name || 'User'}</span>
                            <span className="text-xs text-gray-500 font-jetbrains truncate">{user?.email || 'user@email.com'}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                        <LogOut size={16} /> Disconnect
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-y-auto h-screen">
                <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0 sticky top-0 z-40">
                    <span className="font-black text-xl tracking-tighter text-gray-900 font-jetbrains">SkillSync</span>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <Menu size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-12 pb-24">
                    <div className="max-w-3xl mx-auto space-y-10">
                        
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace Settings</h1>
                            <p className="text-gray-500 mt-2">Manage your account parameters, security credentials, and billing.</p>
                        </div>

                        {/* SECTION 1: Profile Information */}
                        <motion.section 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                                    <p className="text-sm text-gray-500">Update your account identity.</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={16} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <input 
                                                type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <input 
                                                type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={isSavingProfile} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-70">
                                        {isSavingProfile && <Loader2 size={16} className="animate-spin" />} Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.section>

                        {/* SECTION 2: Security & Password */}
                        <motion.section 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Security Credentials</h2>
                                    <p className="text-sm text-gray-500">Ensure your account uses a strong, 256-bit encrypted password.</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Current Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock size={16} className="text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                            </div>
                                            <input 
                                                type="password" placeholder="••••••••" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock size={16} className="text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                            </div>
                                            <input 
                                                type="password" placeholder="••••••••" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={isSavingPassword} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-70">
                                        {isSavingPassword && <Loader2 size={16} className="animate-spin" />} Update Password
                                    </button>
                                </div>
                            </form>
                        </motion.section>

                        {/* SECTION 3: The Danger Zone */}
                        <motion.section 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-red-50 flex items-center gap-3 bg-red-50/30">
                                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
                                    <p className="text-sm text-red-500/80">Destructive actions for your workspace.</p>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Delete Workspace</h3>
                                    <p className="text-sm text-gray-500">Permanently remove your account, billing data, and all associated resume vectors. This action cannot be undone.</p>
                                </div>
                                <button 
                                    onClick={() => toast.error("Account deletion requires admin authorization in v1.0.")}
                                    className="shrink-0 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </motion.section>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;