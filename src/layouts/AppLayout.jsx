import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout({ children }) {
  return (
    <div className="text-white" style={{ background: "radial-gradient(circle at top, #1d0b2d, #0d0616)" }}>
      <Header />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </div>
  );
}
