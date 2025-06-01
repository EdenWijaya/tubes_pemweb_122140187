import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Rute Publik */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rute yang mungkin sebagian publik, sebagian perlu login untuk fungsionalitas penuh */}
          <Route path="/produk" element={<ProductListPage />} />
          <Route path="/produk/:productId" element={<ProductDetailPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/keranjang" element={<CartPage />} />

          <Route path="/admin/dashboard" element={<AdminProtectedRoute element={AdminDashboardPage} />} />
          <Route path="/admin/products" element={<AdminProtectedRoute element={ManageProductsPage} />} />

          {/* Rute Terproteksi */}
          {/* Tambahkan halaman checkout atau profil di sini nanti juga dengan ProtectedRoute */}
          <Route path="/checkout" element={<ProtectedRoute element={CheckoutPage} />} />
          <Route path="/profil" element={<ProtectedRoute element={UserProfilePage} />} />

          {/* Rute default, arahkan ke home (yang sekarang terproteksi) atau login */}
          <Route path="/" element={<Navigate replace to="/home" />} />

          {/* Rute untuk halaman tidak ditemukan (404) - Opsional */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      <ToastContainer
        position="top-right" // Posisi toast (bisa: top-left, top-center, bottom-left, bottom-right, bottom-center)
        autoClose={5000} // Durasi toast tampil (ms), 5 detik
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
