import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Download, CheckCircle2, AlertTriangle, 
    XCircle, Zap, Target, TrendingUp, Sparkles, FileText, Briefcase
} from 'lucide-react';
import api from '../api/axios';

function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the data
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`/analysis/${id}`);
                setData(response.data.data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Failed to load analysis results. The scan may not exist or you lack permission.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Decoding Results...</h2>
                <p className="text-gray-500">Parsing NLP matrices and AI feedback.</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={() => navigate('/dashboard')} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Return to Dashboard
                </button>
            </div>
        );
    }
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-500 border-green-500";
        if (score >= 60) return "text-yellow-500 border-yellow-500";
        return "text-red-500 border-red-500";
    };

    // Animation settings
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 pb-24 font-sans">
            
            {/* Top Nav Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline-block text-sm text-gray-400 font-jetbrains">
                            ID: {id.substring(0, 8)}...
                        </span>
                        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer">
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>
            </div>

            <motion.div 
                variants={containerVariants} initial="hidden" animate="show"
                className="max-w-7xl mx-auto px-6 mt-8"
            >
                {/* Hero section */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-blue-600 font-bold tracking-widest text-xs uppercase mb-3 font-jetbrains">
                                <Target size={14} /> Pipeline Execution Complete
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                                {data.resumeFileName}
                            </h1>
                            <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
                                {data.overallFeedback || "Your resume has been processed against enterprise ATS parameters. Review the critical action items below."}
                            </p>
                        </div>

                        <div className="flex items-center gap-8 shrink-0">
                            <div className="flex flex-col items-center">
                                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${getScoreColor(data.atsScore)} shadow-lg bg-white`}>
                                    <span className="text-4xl font-black tracking-tighter text-gray-900">{data.atsScore}%</span>
                                </div>
                                <span className="mt-3 font-bold text-gray-900">ATS Score</span>
                            </div>
                            
                            {data.fitScore && (
                                <div className="flex flex-col items-center opacity-70">
                                    <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50">
                                        <span className="text-2xl font-bold text-gray-500">{data.fitScore}%</span>
                                    </div>
                                    <span className="mt-3 text-sm font-medium text-gray-500">Role Fit</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        
                        {/* Skills Gap Analysis */}
                        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Zap className="text-yellow-500" /> Keyword Alignment
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider font-jetbrains">Missing Skills (Critical)</h4>
                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">{data.missingSkills?.length || 0}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.missingSkills?.length > 0 ? (
                                            data.missingSkills.map((skill, i) => (
                                                <span key={i} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                                                    <XCircle size={14} /> {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">No critical skills missing.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gray-100"></div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider font-jetbrains">Matched Skills</h4>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{data.matchedSkills?.length || 0}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.matchedSkills?.length > 0 ? (
                                            data.matchedSkills.map((skill, i) => (
                                                <span key={i} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                                                    <CheckCircle2 size={14} /> {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">No matches found against JD.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Document Details */}
                        <motion.div variants={itemVariants} className="bg-gray-900 rounded-3xl p-6 border border-gray-800 text-white shadow-xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-blue-400" /> Document Metrics
                            </h3>
                            <div className="space-y-4 font-jetbrains text-sm">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Total Extracted Skills</span>
                                    <span className="font-bold text-blue-400">{data.extractedSkills?.length || 0}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Target JD Present</span>
                                    <span className="font-bold text-green-400">{data.jobDescription ? "YES" : "NO"}</span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="text-gray-400">Parsing Engine</span>
                                    <span className="font-bold text-white">scikit-learn (v1.2)</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <Sparkles className="text-blue-200" /> AI Optimization Strategy
                                </h3>
                                <p className="text-blue-100 text-sm mt-2 opacity-80">Generated by Gemini NLP</p>
                            </div>

                            <div className="p-6 space-y-8">
                                
                                {/* Strengths */}
                                {data.strengths?.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <TrendingUp size={18} className="text-green-500" /> Current Strengths
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.strengths.map((str, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 text-sm">{str}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Weaknesses */}
                                {data.weaknesses?.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <AlertTriangle size={18} className="text-red-500" /> Parsing Red Flags
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.weaknesses.map((weak, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-red-50/50 p-3 rounded-xl border border-red-100">
                                                    <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                                    <span className="text-gray-800 text-sm">{weak}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {data.suggestions?.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Briefcase size={18} className="text-blue-500" /> Required Action Items
                                        </h4>
                                        <div className="grid gap-3">
                                            {data.suggestions.map((sug, i) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 font-jetbrains">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{sug}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Results;