import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  LogOut, 
  Shield,
  Key,
  Mail,
  Globe,
  Loader2
} from "lucide-react";

export default function AuthSuccess() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "Checking authentication..." });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");

    if (statusParam === "cancelled") {
      setStatus({ 
        type: "warning", 
        message: "Login was cancelled", 
        icon: AlertCircle 
      });
      setLoading(false);
      return;
    }

    checkAuth();
  }, [location]);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStatus({ 
          type: "success", 
          message: "Successfully authenticated", 
          icon: CheckCircle 
        });
      } else {
        setStatus({ 
          type: "error", 
          message: "Authentication failed", 
          icon: XCircle 
        });
      }
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: "Network error. Please try again.", 
        icon: XCircle 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (res.ok) {
        navigate("/");
      }
    } catch (e) {
      setStatus({ 
        type: "error", 
        message: "Logout failed", 
        icon: XCircle 
      });
    }
  };

  const StatusIcon = () => {
    switch (status.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Authentication Status</h1>
            <p className="text-gray-400 mt-2">Secure Google OAuth 2.0 with HttpOnly Cookies</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              status.type === "success" ? "bg-green-500/10 border border-green-500/20" :
              status.type === "error" ? "bg-red-500/10 border border-red-500/20" :
              status.type === "warning" ? "bg-yellow-500/10 border border-yellow-500/20" :
              "bg-blue-500/10 border border-blue-500/20"
            }`}>
              <StatusIcon />
              <span className={`font-medium ${
                status.type === "success" ? "text-green-400" :
                status.type === "error" ? "text-red-400" :
                status.type === "warning" ? "text-yellow-400" :
                "text-blue-400"
              }`}>
                {status.message}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-600 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="mt-6 text-gray-300">Verifying your session...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
            </div>
          ) : !user ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No Active Session</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You are not currently authenticated. Please log in to access your account.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                {/* Profile Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-gray-700/50">
                        {user.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{user.name}</h2>
                      <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                          Google OAuth
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
                          Secure Session
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 border border-gray-600"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>

              {/* Session Details */}
              <div className="mt-8 pt-8 border-t border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Session Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Key className="w-5 h-5 text-blue-400" />
                      <h4 className="font-medium text-gray-300">User ID</h4>
                    </div>
                    <p className="text-sm text-gray-400 font-mono bg-gray-900/50 p-3 rounded-lg">
                      {user.sub}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-green-400" />
                      <h4 className="font-medium text-gray-300">Security Features</h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        HttpOnly Secure Cookies
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Server-side Token Validation
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        OAuth 2.0 Compliance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 md:px-8 py-4 bg-gray-900/50 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
              <p>Built with React & Flask • Secure Authentication System</p>
              <p className="mt-2 md:mt-0">Session: {user ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500">
              Your session is secured with HttpOnly cookies. These cookies cannot be accessed by client-side JavaScript.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}