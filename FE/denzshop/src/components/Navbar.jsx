import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// Ikon Hamburger dan Close
const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

function Navbar() {
  const { isAuthenticated, user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutAction();
    toast.info("Anda telah berhasil keluar.");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // Tutup menu mobile setiap kali path URL berubah
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const homePath = isAuthenticated ? "/home" : "/";

  return (
    <nav className="bg-slate-800 text-slate-200 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center">
        {/* Logo/Nama Toko (Kiri) */}
        <div className="flex-shrink-0">
          <Link to={homePath} className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            DenzShop
          </Link>
        </div>

        {/* Menu Navigasi Utama (Tengah - Desktop) */}
        <div className="hidden md:flex flex-grow justify-center space-x-6 items-center">
          <Link to={homePath} className="hover:text-indigo-300 transition-colors">
            Beranda
          </Link>
          <Link to="/produk" className="hover:text-indigo-300 transition-colors">
            Produk
          </Link>
          <Link to="/keranjang" className="hover:text-indigo-300 transition-colors">
            Keranjang
          </Link>
        </div>

        {/* Bagian User/Login/Admin (Kanan - Desktop) */}
        <div className="hidden md:flex flex-shrink-0 items-center space-x-3">
          {isAuthenticated && user ? (
            <>
              <span className="text-slate-300 truncate">Halo, {user.username}!</span>
              {user.role === "admin" && (
                <Link
                  to="/admin/products"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md text-sm"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-md text-sm"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="border border-indigo-500 hover:bg-indigo-500 text-indigo-300 hover:text-white font-semibold py-2 px-3 rounded-md text-sm"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Tombol Hamburger Menu (Hanya tampil di mobile) */}
        <div className="md:hidden flex items-center ml-auto">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-200 hover:text-white focus:outline-none focus:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* Panel Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-700">
          <div className="flex flex-col space-y-2 px-2 pb-3">
            <Link
              to={homePath}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-white"
            >
              Beranda
            </Link>
            <Link
              to="/produk"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-white"
            >
              Produk
            </Link>
            <Link
              to="/keranjang"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-white"
            >
              Keranjang
            </Link>

            <div className="border-t border-slate-700 my-2"></div>

            {isAuthenticated && user ? (
              <>
                <span className="px-3 py-2 text-slate-400 text-sm">Halo, {user.username}!</span>
                {user.role === "admin" && (
                  <Link
                    to="/admin/products"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-white"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700 hover:text-red-300"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-white"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
