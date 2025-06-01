import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const { isAuthenticated, user, logoutAction } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    toast.info("Anda telah berhasil logout.");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 text-slate-200 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center">
        {" "}
        {/* Hapus justify-between untuk sementara */}
        {/* Logo/Nama Toko (Kiri) */}
        <div className="flex-shrink-0">
          {" "}
          {/* Gunakan flex-shrink-0 agar tidak mengecil jika nama panjang */}
          <Link to={"/home"} className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            DenzShop
          </Link>
        </div>
        {/* Menu Navigasi Utama (Tengah) - Kita akan menggunakan flex-grow dan text-center */}
        <div className="hidden md:flex flex-grow justify-center space-x-6 items-center">
          <Link to={"/home"} className="hover:text-indigo-300 transition-colors">
            Beranda
          </Link>
          <Link to="/produk" className="hover:text-indigo-300 transition-colors">
            Produk
          </Link>
          <Link to="/keranjang" className="hover:text-indigo-300 transition-colors">
            Keranjang
          </Link>
        </div>
        {/* Bagian User/Login (Kanan) */}
        <div className="flex-shrink-0 flex items-center">
          {" "}
          {/* Gunakan flex-shrink-0 */}
          {isAuthenticated && user ? (
            <>
              <span className="text-slate-300 mr-4 truncate">Halo, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out cursor-pointer mr-2"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
              >
                Masuk
              </Link>
            </>
          )}
          {isAuthenticated && user && user.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Navigasi Mobile (Opsional, ditampilkan di layar kecil) */}
      <div className="md:hidden flex flex-col items-center space-y-2 mt-3 pt-3 border-t border-slate-700">
        <Link to={isAuthenticated ? "/home" : "/"} className="hover:text-indigo-300 transition-colors py-1">
          Beranda
        </Link>
        <Link to="/produk" className="hover:text-indigo-300 transition-colors py-1">
          Produk
        </Link>
        <Link to="/keranjang" className="hover:text-indigo-300 transition-colors py-1">
          Keranjang
        </Link>
        {/* Anda bisa menambahkan link login/register/logout di sini juga untuk mobile jika perlu */}
      </div>
    </nav>
  );
}

export default Navbar;
