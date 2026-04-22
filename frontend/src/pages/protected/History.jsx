import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  History as HistoryIcon,
  Settings,
  LogOut,
  Menu,
  FileText,
  ArrowRight,
  Loader2,
  Calendar,
  Search,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

function History() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/analysis/my");
        setAnalyses(response.data.data);
      } catch (err) {
        console.error("History Fetch Error:", err);
        setError("Failed to load your scan history. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const filteredAnalyses = analyses.filter((item) =>
    item.resumeFileName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-300 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="font-black text-xl tracking-tighter text-white font-jetbrains">
            SkillSync
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard size={18} /> New Scan
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl font-medium transition-colors">
            <HistoryIcon size={18} /> Scan History
          </button>
          <Link to="/settings" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-colors">
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500 font-jetbrains truncate">
                {user?.email || "user@email.com"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden h-screen">
        <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
          <span className="font-black text-xl tracking-tighter text-gray-900 font-jetbrains">
            SkillSync
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Scan History
                </h1>
                <p className="text-gray-500 mt-2">
                  Review past resume analyses and track your optimization
                  progress.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-100">
                <Loader2
                  size={40}
                  className="animate-spin text-blue-600 mb-4"
                />
                <p className="text-gray-500 font-medium">
                  Retrieving database records...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-3xl border border-red-100 p-12 flex flex-col items-center justify-center min-h-100 text-center">
                <AlertCircle size={40} className="text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Connection Error
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredAnalyses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-100 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No scans found
                </h3>
                <p className="text-gray-500 max-w-md mb-8">
                  {searchQuery
                    ? "We couldn't find any documents matching your search. Try a different term."
                    : "Your database is currently empty. Deploy your first analysis to see data here."}
                </p>
                {!searchQuery && (
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                  >
                    Run New Scan
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider font-jetbrains">
                        <th className="px-6 py-4 font-medium">Document Name</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">ATS Score</th>
                        <th className="px-6 py-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAnalyses.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          {/* Document Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <FileText size={18} />
                              </div>
                              <span className="font-bold text-gray-900 truncate max-w-50 md:max-w-xs">
                                {item.resumeFileName}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Calendar size={14} />
                              {formatDate(item.createdAt)}
                            </div>
                          </td>

                          {/* Status / Score */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getScoreBadge(item.atsScore)}`}
                            >
                              {item.atsScore}% Match
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            <Link
                              to={`/results/${item._id}`}
                              className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-200"
                            >
                              View Report <ArrowRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
