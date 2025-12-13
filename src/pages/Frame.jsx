import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";


// AUTO LOAD FRAMES DARI SRC
const frames = import.meta.glob("../assets/frame-assets/*.{png,jpg,jpeg}", {
  eager: true,
});

export default function Frames() {
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  // SIMULASI LOADING BIAR SMOOTH SAAT MASUK HALAMAN
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  // Convert frame menjadi { id, url, type }
  const frameList = Object.entries(frames)
    .map(([path, module]) => {
      const filename = path.split("/").pop();
      const id = filename.split(".")[0];

      // DETEKSI TIPE FRAME → ambil pola di awal nama file
      const matchType = id.match(/^(1x3|2x2|2x3)/);
      const type = matchType ? matchType[1] : "other";

      return {
        id,
        url: module.default,
        type,
      };
    })
    .sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ""));
      const numB = parseInt(b.id.replace(/\D/g, ""));
      return numA - numB;
    });

  // FILTERING LOGIC
  const filteredFrames =
    selectedType === "all"
      ? frameList
      : frameList.filter((f) => f.type === selectedType);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16 px-6 sm:px-20 relative">
        <h2 className="text-center text-5xl font-extrabold text-pink-700 mb-10">
          Pilih Frame Favorit Kita ♡
        </h2>

        {/* === FILTER BUTTONS === */}
        <div className="flex justify-center gap-4 mb-12">
          {["all", "1x3", "2x2", "2x3"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-5 py-2 rounded-full border text-sm font-semibold transition 
                ${
                  selectedType === t
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
                }`}
            >
              {t === "all" ? "Semua Frame" : t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* === FRAME LIST === */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {filteredFrames.map((f) => (
            <Link
              to={`/photo?frame=${f.id}`}
              key={f.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-pink-200 p-3 flex flex-col items-center hover:-translate-y-1 transition overflow-hidden"
            >
              {/* Thumbnail */}
              <div
                className="w-full bg-white rounded-xl overflow-hidden flex items-center justify-center"
                style={{ height: "360px" }}
              >
                <img
                  src={f.url}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                />
              </div>

              {/* Title */}
              <div className="py-4 text-center bg-pink-50 w-full mt-3 rounded-xl shadow-inner">
                <p className="text-sm text-pink-600 font-medium tracking-wide">
                  Free • Verified ✦
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  Frame {f.id}
                </p>
                <p className="text-xs text-gray-500">Tipe: {f.type}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
