import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Animasi bentuk hati */}
      <div className="relative w-20 h-20 animate-pulse">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-16 bg-pink-500 rounded-full rotate-45"></div>
        <div className="absolute top-0 left-1/2 -translate-x-full w-10 h-16 bg-pink-500 rounded-full -rotate-45"></div>
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-pink-500 rounded-full"></div>
      </div>

      {/* Text animasi */}
      <p className="mt-6 text-lg font-semibold text-pink-700 animate-bounce">
        Loading Frame Cantik...
      </p>
    </div>
  );
}
