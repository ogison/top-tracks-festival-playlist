"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-green-500 font-mono">
      <div className="text-center">
        <motion.h1
          className="text-4xl mb-8 pixel-font"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          PLAYLISTER X
        </motion.h1>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </motion.div>
        <motion.a
          id="spotify-login-button"
          href="/api/login"
          className={`inline-block px-8 py-3 rounded-full text-black ${
            isHovered ? "bg-green-400" : "bg-green-500"
          } hover:bg-green-400 transition-colors duration-300 pixel-font`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MAKE YOUR PLAYLIST
        </motion.a>
      </div>
    </div>
  );
}
