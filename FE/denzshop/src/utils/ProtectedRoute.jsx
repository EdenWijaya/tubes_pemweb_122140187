// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Jika pengguna tidak terautentikasi, arahkan ke halaman login
    // Anda juga bisa menyimpan lokasi saat ini untuk redirect kembali setelah login
    // menggunakan prop `state` pada Navigate, contoh:
    // return <Navigate to="/login" state={{ from: location }} replace />;
    // Untuk sekarang, kita redirect sederhana ke /login
    return <Navigate to="/login" replace />;
  }

  // Jika terautentikasi, render komponen yang diminta (melalui Outlet jika ini wrapper route)
  // atau langsung render element jika ini untuk satu route spesifik
  return Component ? <Component {...rest} /> : <Outlet />;
};

export default ProtectedRoute;
