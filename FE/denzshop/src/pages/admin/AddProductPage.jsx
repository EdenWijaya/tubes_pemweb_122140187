import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAddProduct = async (productData) => {
    setIsLoading(true);
    try {
      console.log("Mengirim produk dengan token:", token);
      const response = await axios.post("http://localhost:6543/api/admin/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pastikan formatnya benar
          "Content-Type": "application/json",
        },
      });
      console.log("Respons dari Backend:", response.data); // <--- TAMBAHKAN INI
      if (response.data && response.data.product && response.data.message) {
        // Cek jika ada produk & message sukses
        toast.success(response.data.message || "Produk berhasil ditambahkan!");
        navigate("/admin/products");
      } else if (response.data && response.data.error) {
        // Cek jika backend kirim error di body tapi statusnya sukses
        toast.error(response.data.error);
      } else {
        // Respons sukses tapi format tidak dikenal
        toast.warn("Menerima respons tidak dikenal dari server.");
      }
    } catch (error) {
      // Ini blok catch yang sudah ada
      toast.error(error.response?.data?.error || "Gagal menambahkan produk.");
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <Link to="/admin/products" className="text-indigo-600 hover:text-indigo-800">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Tambah Produk Baru</h1>
      <ProductForm onSubmit={handleAddProduct} isLoading={isLoading} submitButtonText="Tambah Produk" />
    </div>
  );
}

export default AddProductPage;
