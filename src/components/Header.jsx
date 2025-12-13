import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="py-6 bg-gradient-to-r from-gray-900/80 via-pink-900/30 to-gray-900/80 border-b border-pink-500/30 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
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

        {/* Menu */}
        <nav className="hidden md:flex gap-1 items-center text-md font-bold">
          <Link to="/" className="px-4 py-2 text-gray-200 hover:text-pink-400 transition">Home</Link>
          <Link to="/frame" className="px-4 py-2 text-gray-200 hover:text-pink-400 transition">Frame</Link>
          <Link to="/album" className="px-4 py-2 text-gray-200 hover:text-pink-400 transition">Album</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center ml-3 sm:ml-6">
          <Link
            to="/frame"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-700 hover:to-purple-700 hover:scale-105 text-white font-bold rounded-full shadow-lg hover:shadow-pink-500/50 transition-all duration-300 text-sm sm:text-base"
          >
            Start ✨
          </Link>
        </div>
      </div>
    </header>
  );
}
