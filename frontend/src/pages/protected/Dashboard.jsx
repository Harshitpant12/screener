import React, { useState, useRef, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    UploadCloud, FileText, X, CheckCircle2, 
    LayoutDashboard, History, Settings, LogOut, 
    AlertCircle, Loader2, Menu, Target
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [jdText, setJdText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const wakeUpServices = async () => {
            try {
                await api.get('/analysis/wake-python');
                console.log("Pre-flight: Optimization engines initialized.");
            } catch (err) {
                console.log("Pre-flight ping failed, but signal was sent.");
            }
        };
        wakeUpServices();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;
        
        if (selectedFile.type !== 'application/pdf') {
            toast.error("Invalid file type. Please upload a PDF.");
            return;
        }
        
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File is too large. Maximum size is 5MB.");
            return;
        }

        setFile(selectedFile);
        toast.success("Resume loaded successfully.");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileInput = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const executeScan = async () => {
        if (!file) return;
        
        setIsAnalyzing(true);
        const toastId = toast.loading('Uploading and executing NLP pipeline...');

        try {
            const formData = new FormData();
            formData.append('resume', file);
            
            if (jdText.trim()) {
                formData.append('jdText', jdText);
            }

            const response = await api.post('/analysis/run', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            toast.success('Analysis complete.', { id: toastId });
            navigate(`/results/${response.data.data._id}`);
            
        } catch (error) {
            console.error("Analysis Error:", error);
            toast.error(error.response?.data?.message || 'Sorry! Failed to process resume.', { id: toastId });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex font-sans">
            <Toaster position="top-center" />

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-300 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
                    <span className="font-black text-xl tracking-tighter text-white font-jetbrains">SkillSync</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <button onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl font-medium transition-colors">
                        <LayoutDashboard size={18} /> New Scan
                    </button>
                    <Link to="/history" onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-colors">
                        <History size={18} /> Scan History
                    </Link>
                    <Link to="/settings" onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-colors">
                        <Settings size={18} /> Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800 shrink-0">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
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

            <div className="flex-1 flex flex-col relative overflow-hidden h-screen w-full">
                <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
                    <span className="font-black text-xl tracking-tighter text-gray-900 font-jetbrains">SkillSync</span>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="9" x2="20" y2="9"></line>
                            <line x1="4" y1="15" x2="20" y2="15"></line>
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 md:mb-10">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Deploy new analysis</h1>
                            <p className="text-gray-500 mt-2 text-sm sm:text-base">Upload your resume in PDF format to process against ATS algorithms.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {!file ? (
                                <motion.div 
                                    key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                                    className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-200 ease-in-out flex flex-col items-center justify-center py-16 sm:py-24 px-4 sm:px-6 text-center cursor-pointer
                                        ${isDragging ? 'border-blue-500 bg-blue-50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'}
                                    `}
                                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileInput} accept=".pdf" className="hidden" />
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <UploadCloud size={32} />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Click or drag resume here</h3>
                                    <p className="text-gray-500 text-xs sm:text-sm max-w-sm mb-6">
                                        SkillSync engine exclusively processes <span className="font-medium text-gray-700">PDF documents</span> to guarantee accurate parsing. Max file size 5MB.
                                    </p>
                                    <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                                        Select File
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="loaded" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-full bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-8"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-gray-100">
                                        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                                                <FileText size={24} className="sm:w-7 sm:h-7" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden w-full">
                                                <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate pr-2">{file.name}</h3>
                                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-jetbrains mt-1">
                                                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></span>
                                                    <span className="text-green-600 flex items-center gap-1 shrink-0">
                                                        <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" /> Validated
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setFile(null)} disabled={isAnalyzing}
                                            className="absolute top-4 right-4 sm:static sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="py-6 sm:py-8">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <Target size={18} className="text-blue-600 shrink-0" />
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Target Job Description</h4>
                                            <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-medium">Recommended</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mb-4">Paste the job description here to enable the NLP engine to calculate keyword matches and ATS gap analysis.</p>
                                        <textarea 
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                            disabled={isAnalyzing}
                                            placeholder="Paste the job description requirements and responsibilities here..."
                                            className="w-full h-32 sm:h-40 bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none disabled:opacity-60"
                                        />
                                    </div>

                                    <div className="pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                        <div className="w-full sm:w-auto flex justify-center sm:justify-start gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg font-medium border border-gray-100">
                                            <AlertCircle size={14} className="shrink-0" />
                                            ETA: ~10-15 seconds (Gemini + Python)
                                        </div>

                                        <button 
                                            onClick={executeScan}
                                            disabled={isAnalyzing}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin shrink-0" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Execute ATS Scan'
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;