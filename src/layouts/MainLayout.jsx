import React from "react";
import HeaderMain from "../components/HeaderMain";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="text-white">
      <HeaderMain />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </div>
  );
}
