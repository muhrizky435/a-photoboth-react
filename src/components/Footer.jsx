import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-800 border-t border-pink-400/20 backdrop-blur-xl py-16 sm:py-20 mt-24 shadow-[0_-10px_50px_rgba(255,100,170,0.15)]">
      
      {/* Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-10 left-10 text-pink-400 text-3xl animate-fall-slow">✿</div>
        <div className="absolute top-5 left-5 text-pink-500 text-3xl animate-fall-slow">✿</div>
        <div className="absolute top-14 left-14 text-pink-500 text-4xl rotate-12 animate-fall-medium">❀</div>
        <div className="absolute top-24 right-24 text-purple-400 text-4xl rotate-12 animate-fall-medium">❀</div>
        <div className="absolute top-16 right-16 text-purple-500 text-4xl animate-fall-medium">❀</div>
        <div className="absolute bottom-8 left-1/3 text-pink-400 text-3xl animate-fall-fast">✿</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">

        <p className="text-lg sm:text-xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
          "Kamu bukan cuma bagian dari hidupku, tapi alasan terindah aku tersenyum setiap hari ♡."
        </p>

        <div className="flex justify-center gap-3 text-4xl mb-10">
          <span className="animate-pulse text-pink-400">♡</span>
          <span className="animate-bounce text-pink-500">♡</span>
          <span className="animate-pulse text-pink-400">♡</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-6 sm:gap-10 justify-center font-bold mb-10">
          <Link to="/" className="text-pink-300 hover:text-pink-400 hover:scale-110 transition">Home</Link>
          <Link to="/frames" className="text-pink-300 hover:text-pink-400 hover:scale-110 transition">Frame</Link>
          <Link to="/photo" className="text-pink-300 hover:text-pink-400 hover:scale-110 transition">Kamera Kita</Link>
          <Link to="/album" className="text-pink-300 hover:text-pink-400 hover:scale-110 transition">Album Kita</Link>
        </nav>

        <div className="border-t border-pink-400/20 pt-6">
          <p className="text-xs text-pink-300 mb-1">© 2025 Kenangan Kita — Dibuat dengan ♡.</p>
          <p className="text-xs text-pink-400">✨ Setiap foto adalah cerita indah buat kita.</p>
        </div>

      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fall-slow {
          0% { transform: translateY(-10px) rotate(0deg); }
          50% { transform: translateY(40px) rotate(10deg); }
          100% { transform: translateY(90px) rotate(-10deg); }
        }
        @keyframes fall-medium {
          0% { transform: translateY(-20px) rotate(0deg); }
          50% { transform: translateY(60px) rotate(-12deg); }
          100% { transform: translateY(120px) rotate(12deg); }
        }
        @keyframes fall-fast {
          0% { transform: translateY(-30px) rotate(0deg); }
          50% { transform: translateY(80px) rotate(20deg); }
          100% { transform: translateY(150px) rotate(-20deg); }
        }
        .animate-fall-slow { animation: fall-slow 6s infinite ease-in-out; }
        .animate-fall-medium { animation: fall-medium 4s infinite ease-in-out; }
        .animate-fall-fast { animation: fall-fast 3s infinite ease-in-out; }
      `}</style>
    </footer>
  );
}
