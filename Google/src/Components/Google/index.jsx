import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const handleLogin = () => {
    window.location.href = "https://google-integration-1-6ytp.onrender.com/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-[0_0_80px_10px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <h1 className="text-3xl font-semibold text-white text-center tracking-wide mb-6">
          Google Login Portal
        </h1>
        <div className="flex flex-col items-center text-center">
          <p className="text-gray-300 mb-6 text-lg">
            Sign in using your Google account
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-lg rounded-xl shadow-xl hover:opacity-90 transition-all"
          >
            Login with Google
          </motion.button>
        </div>

        <div className="mt-10 text-center text-gray-500 text-xs">
          Built with ❤️ — Secure OAuth • React • Tailwind • Framer Motion
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
