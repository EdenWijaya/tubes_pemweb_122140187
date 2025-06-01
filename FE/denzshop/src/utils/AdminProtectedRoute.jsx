import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Jika tidak login, arahkan ke halaman login
    // Simpan lokasi saat ini agar bisa kembali setelah login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== "admin") {
    // Jika sudah login TAPI bukan admin, arahkan ke halaman lain (misalnya, beranda atau halaman "tidak diizinkan")
    return <Navigate to="/home" replace />;
  }

  // Jika sudah login DAN adalah admin, tampilkan komponen/halaman yang diminta
  return Component ? <Component {...rest} /> : <Outlet />;
};

export default AdminProtectedRoute;
