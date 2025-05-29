import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logoutAction } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 text-slate-200 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          DenzShop
        </Link>

        {/* Menu Navigasi */}
        <div className="space-x-6 flex items-center">
          <Link to={isAuthenticated ? "/home" : "/"} className="hover:text-indigo-300 transition-colors">
            Home
          </Link>
          <Link to="/produk" className="hover:text-indigo-300 transition-colors">
            Produk
          </Link>
          <Link to="/keranjang" className="hover:text-indigo-300 transition-colors">
            Keranjang
          </Link>

          {isAuthenticated && user ? (
            <>
              <span className="text-slate-300">Halo, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-300 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
