// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Rute default, bisa diarahkan ke login atau register untuk awal */}
          <Route path="/" element={<Navigate replace to="/register" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/produk" element={<ProductListPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
