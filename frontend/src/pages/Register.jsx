import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2, FileText, Search, Loader2, EyeOff, Eye } from 'lucide-react';
import { AuthContext } from "../context/AuthContext"
import toast, { Toaster } from 'react-hot-toast';

function Register() {

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [scanStep, setScanStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const toastId = toast.loading('Initializing workspace...');

    try {
      await register(formData.name, formData.email, formData.password);
      
      toast.success('Workspace created successfully! Redirecting to login...', { 
        id: toastId,
        duration: 3300
       });
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Registration Error:", err);

      toast.error(err.response?.data?.message || 'Failed to initialize workspace.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 relative items-center justify-center overflow-hidden border-r border-gray-200">
            
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>

            {/* The Animated UI Widget */}
            <div className="relative z-10 w-full max-w-md">
                
                {/* Main Card */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative"
                >
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Kognise_Resume_v4.pdf</h3>
                            <p className="text-sm text-gray-500 font-jetbrains">Size: 142kb</p>
                        </div>
                    </div>

                    {/* Animated Scanning Status */}
                    <div className="h-24 flex items-center justify-center relative">
                        <AnimatePresence mode="wait">
                            {scanStep === 0 && (
                                <motion.div key="extract" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center text-gray-500 gap-2">
                                    <Search className="animate-pulse text-blue-500" />
                                    <span className="font-jetbrains text-sm">Extracting text vectors...</span>
                                </motion.div>
                            )}
                            {scanStep === 1 && (
                                <motion.div key="compare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center text-gray-500 gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="font-jetbrains text-sm">Running TF-IDF Model...</span>
                                </motion.div>
                            )}
                            {scanStep === 2 && (
                                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-green-600 gap-2">
                                    <CheckCircle2 size={32} />
                                    <span className="font-bold text-xl tracking-tight text-gray-900">Match Rate: 87%</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Fake Loading Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            className="h-full bg-blue-600"
                            animate={{ width: scanStep === 2 ? "100%" : scanStep === 1 ? "60%" : "30%" }}
                            transition={{ duration: 0.5 }}
                        ></motion.div>
                    </div>
                </motion.div>

                {/* Floating Element 1 */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-12 -top-12 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-bold text-gray-900">Keywords Aligned</span>
                </motion.div>
                
            </div>
        </div>

        {/* Right Side form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative z-10 bg-white">
            
            {/* Mobile only subtle background */}
            <div className="absolute inset-0 bg-blue-50/50 lg:hidden -z-10"></div>

            <div className="max-w-md w-full mx-auto">
                {/* Branding */}
                <div className="mb-10">
                    <Link to="/" className="font-black text-2xl tracking-tighter text-gray-900 font-jetbrains">
                        SkillSync
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mt-6">Create your account</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Start optimizing your resume for enterprise ATS parsers.
                    </p>
                </div>

                {/* OAuth Buttons */}
                <div className="flex flex-col gap-3 mb-8">
                    <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm shadow-sm">
                        {/* Google Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-0.5 flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-jetbrains bg-white px-2">Or Email</span>
                    <div className="h-0.5 flex-1 bg-gray-200"></div>
                </div>

                {/* The Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" required disabled={isLoading}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all disabled:opacity-60"
                      />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            <>
                                Initialize Workspace
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Workspace already initialized?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                        Authenticate here
                    </Link>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Register;