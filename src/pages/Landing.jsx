import AppLayout from "../layouts/AppLayout"; 

export default function Landing() {
    return (
        <AppLayout>
            <div className="relative max-w-7xl mx-auto px-4 lg:px-24 pb-12 overflow-hidden">

                {/* Sakura floating flowers */}
                <div className="sakura sakura-1">❀</div>
                <div className="sakura sakura-2">❀</div>
                <div className="sakura sakura-3">❀</div>
                <div className="sakura sakura-4">❀</div>
                <div className="sakura sakura-5">❀</div>

                {/* Animated pastel background */}
                <div className="fixed inset-0 -z-10 opacity-50 bg-gradient-to-br from-pink-200/40 via-purple-200/40 to-transparent blur-3xl"></div>

                {/* Cute heart stickers */}
                <div className="absolute left-5 top-10 text-pink-400 text-4xl animate-pulse">♡</div>
                <div className="absolute right-8 top-20 text-purple-400 text-3xl animate-ping">✦</div>

                {/* Title Section */}
                <div className="pt-20 text-center animate-fade-in relative z-20">

                    {/* Polaroid beside title */}
                    <div className="absolute -left-6 sm:-left-35 top-0 w-32 sm:w-48 rotate-[-8deg] hover:rotate-0 hover:scale-110 transition-all duration-500 polaroid">
                        <img src="/img/IMG-20251127-WA0013.jpg" className="w-full rounded-md" />
                        <p className="polaroid-text">my love ❤️</p>
                    </div>

                    <div className="inline-block mb-4 px-4 py-2 bg-pink-500/20 border border-pink-400/40 rounded-full text-pink-500 text-sm font-semibold backdrop-blur-sm">
                        Abadikan Momen Spesial Kita
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-transparent bg-clip-text
                        bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300 animate-bounce-slow drop-shadow-xl"
                    >
                        Foto Berdua,<br /> Kenangan Manis,<br /> Untuk Kita Selamanya
                    </h1>

                    <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Ambil foto lucu kita bareng, pilih frame romantis, atur tata letak,
                        dan jadikan momen berharga sebagai kenangan selamanya ✨💕
                    </p>

                </div>

                {/* Action Buttons */}
                <div className="mt-14 flex flex-col sm:flex-row justify-center text-center gap-4 sm:gap-6 z-30">
                    <a
                        href="/frames"
                        className="group px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-pink-400/40 shadow-lghover:shadow-pink-500/60 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                        <i data-lucide="camera" className="w-5 h-5 group-hover:rotate-12 transition-transform"></i>
                        Mulai Sekarang!
                    </a>

                    <a
                        href="/album"
                        className="group px-8 py-3 rounded-full border-2 border-purple-400 text-purple-300 hover:text-white hover:bg-purple-400/20 font-bold text-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-3"
                    >
                        <i data-lucide="images" className="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                        Lihat Album Kenangan
                    </a>
                </div>

                {/* Floating Polaroid Gallery */}
                <div className="relative mt-8 flex justify-center items-center floating-zone">

                    {/* NEW — Upper Floating Photo */}
                    <div className="absolute -left-4 sm:-left-20 -top-40 rotate-[14deg] hover:rotate-[6deg] hover:scale-110 transition-all duration-500 polaroid w-52 sm:w-48 md:w-64 kawaii-frame z-20">
                        <img src="/img/IMG-20251127-WA0009.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">our silly smiles 😆💗</p>
                    </div>

                    {/* Top Left */}
                    <div className="absolute -left-10 md:-left-45 -top-6 rotate-[-10deg] hover:rotate-[-3deg] hover:scale-110 transition-all duration-500 polaroid w-52 sm:w-60 md:w-96 kawaii-frame">
                        <img src="/img/photo1.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">forever us ♡</p>
                    </div>

                    {/* Top Right */}
                    <div className="absolute -right-10 sm:-right-35 top-1 rotate-[10deg] hover:rotate-[3deg] hover:scale-110 transition-all duration-500 polaroid w-52 md:w-96 kawaii-frame">
                        <img src="../img/IMG-20251127-WA0022.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">sweet moments ✨</p>
                    </div>

                    {/* Center Big */}
                    <div className="relative rotate-[4deg] hover:rotate-0 hover:scale-110 transition-all duration-500 polaroid w-56 md:w-96 kawaii-frame">
                        <img src="/img/IMG-20251127-WA0021.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">love of my life 💕</p>
                    </div>

                    {/* Bottom Left */}
                    <div className="absolute left-2 sm:left-45 bottom-0 top-1 rotate-[-6deg] hover:rotate-[-2deg] hover:scale-110 transition-all duration-500 polaroid w-52 md:w-80 kawaii-frame">
                        <img src="/img/IMG-20251127-WA0015.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">together always 🌸</p>
                    </div>

                    {/* NEW — Bottom Middle */}
                    <div className="absolute bottom-0 rotate-[2deg] hover:rotate-0 hover:scale-110 transition-all duration-500 polaroid w-52 md:w-96 kawaii-frame">
                        <img src="/img/photo3.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">you + me = 💗</p>
                    </div>

                </div>

                {/* Mascot Right */}
                <div className="hidden lg:block absolute right-10 top-52 animate-float z-20">
                    <div className="polaroid w-60 kawaii-frame hover:scale-110 transition-all duration-500">
                        <img src="/img/photo1.jpg" className="rounded-md kawaii-border" />
                        <p className="polaroid-text">kita berdua 😳💕</p>
                    </div>
                </div>

                {/* Embedded Styles */}
                <style>{`
                    .polaroid {
                        background: #fff;
                        padding: 10px 10px 30px;
                        border-radius: 14px;
                        border: 4px solid #fff;
                        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
                    }
                    .polaroid-text {
                        margin-top: 6px;
                        text-align: center;
                        color: rgb(10, 10, 10);
                        font-size: 1rem;
                        font-family: "Caveat", "Comic Sans MS", "Poppins", sans-serif;
                    }
                    .kawaii-frame {
                        position: relative;
                    }
                    .kawaii-frame::before {
                        content: "✿";
                        position: absolute;
                        top: -12px;
                        left: -12px;
                        font-size: 18px;
                        color: #f9a8d4;
                    }
                    .kawaii-frame::after {
                        content: "♡";
                        position: absolute;
                        bottom: -14px;
                        right: -10px;
                        font-size: 20px;
                        color: #c084fc;
                    }
                    .kawaii-border {
                        border: 3px dashed #fbcfe8;
                    }
                    .sakura {
                        position: absolute;
                        font-size: 22px;
                        opacity: 0.7;
                        animation: sakuraFall 6s infinite linear;
                        color: #f9a8d4;
                    }
                    @keyframes sakuraFall {
                        0% { transform: translateY(-20px) rotate(0deg); opacity: 0.9; }
                        100% { transform: translateY(60px) rotate(40deg); opacity: 0; }
                    }
                    .sakura-1 { left: 10%; top: 5%; animation-delay: 0s; }
                    .sakura-2 { left: 80%; top: 12%; animation-delay: 1.2s; }
                    .sakura-3 { left: 50%; top: 0%; animation-delay: 2s; }
                    .sakura-4 { left: 30%; top: 10%; animation-delay: 1.5s; }
                    .sakura-5 { left: 70%; top: 2%; animation-delay: 1.8s; }

                    @media (max-width: 640px) {
                        .polaroid { transform: scale(0.75); }
                        .floating-zone { margin-top: 4rem; }
                        .floating-zone > div {
                            position: relative !important;
                            top: auto !important;
                            left: auto !important;
                            right: auto !important;
                            margin-bottom: 1.5rem;
                        }
                    }

                    @media (max-width: 768px) {
                        .floating-zone .polaroid {
                            max-width: 70%;
                            margin-left: auto;
                            margin-right: auto;
                        }
                    }

                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-18px); }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-22px); }
                    }

                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
                    .animate-float { animation: float 4s ease-in-out infinite; }
                    .animate-fade-in { animation: fade-in 0.9s ease-out; }
                `}</style>
            </div>
        </AppLayout>
    );
}
