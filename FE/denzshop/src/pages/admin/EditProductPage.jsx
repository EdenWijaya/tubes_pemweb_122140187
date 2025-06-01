import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ProductForm from "./ProductForm";
import { toast } from "react-toastify";

function EditProductPage() {
  const { productId } = useParams(); // Ambil productId dari URL
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Untuk loading data awal
  const [isSubmitting, setIsSubmitting] = useState(false); // Untuk loading saat submit form
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:6543/api/products/${productId}`);
        // Pastikan harga dikonversi ke string jika ProductForm mengharapkannya sebagai string
        const productData = response.data.product;
        if (productData && productData.price !== undefined) {
          productData.price = String(productData.price);
        }
        if (productData && productData.stock_quantity !== undefined) {
          productData.stock_quantity = String(productData.stock_quantity);
        }
        setInitialData(productData);
      } catch (err) {
        console.error("Error mengambil data produk untuk diedit:", err);
        setError(err.response?.data?.error || err.message || "Gagal mengambil data produk.");
        toast.error(err.response?.data?.error || "Gagal mengambil data produk.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleEditProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`http://localhost:6543/api/admin/products/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message || "Produk berhasil diperbarui!");
      navigate("/admin/products"); // Arahkan kembali ke daftar produk admin
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal memperbarui produk.");
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Memuat data produk untuk diedit...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!initialData && !isLoading) {
    // Jika sudah tidak loading tapi initialData masih null
    return <div className="container mx-auto p-4 text-center text-red-500">Data produk tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <Link to="/admin/products" className="text-indigo-600 hover:text-indigo-800">
          &larr; Kembali ke Kelola Produk
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit Produk: {initialData?.name || ""}</h1>
      {initialData && ( // Hanya render form jika initialData sudah ada
        <ProductForm
          onSubmit={handleEditProduct}
          initialData={initialData}
          isLoading={isSubmitting}
          submitButtonText="Simpan Perubahan"
        />
      )}
    </div>
  );
}

export default EditProductPage;
