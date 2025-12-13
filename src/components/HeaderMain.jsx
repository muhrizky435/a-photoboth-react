import React from "react";
import { Link } from "react-router-dom";

export default function HeaderMain() {
  return (
    <header className="py-6 bg-gradient-to-r from-white via-pink-50 to-pink-100 border-b border-pink-100 backdrop-blur-xl sticky top-0 z-50 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
        
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
            💕
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent">
              Koleksi Foto Kita
            </h1>
            <p className="text-xs sm:text-sm text-pink-500/70 -mt-1 font-medium">
              Capture. Frame. Keep.
            </p>
          </div>
        </Link>

        {/* Navbar Menu */}
        <nav className="hidden md:flex gap-1 items-center text-md font-bold">
          <Link to="/" className="px-4 py-2 text-pink-500 hover:text-pink-700 transition duration-300">Home</Link>
          <Link to="/frame" className="px-4 py-2 text-pink-500 hover:text-pink-700 transition duration-300">Frame</Link>
          <Link to="/album" className="px-4 py-2 text-pink-500 hover:text-pink-700 transition duration-300">Album</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center ml-3 sm:ml-6">
          <Link
            to="/frame"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-700 hover:to-pink-700 hover:scale-105 text-white font-bold rounded-full shadow-lg hover:shadow-pink-500/50 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
          >
            Start ✨
          </Link>
        </div>
      </div>
    </header>
  );
}
