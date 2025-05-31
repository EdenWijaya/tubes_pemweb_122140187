import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams
import axios from "axios";

function ProductDetailPage() {
  const { productId } = useParams(); // Ambil productId dari URL (sesuaikan nama param jika beda di App.jsx)
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pastikan URL ini cocok dengan endpoint backend Anda
        const response = await axios.get(`http://localhost:6543/api/products/${productId}`);
        setProduct(response.data.product); // Backend mengembalikan objek dengan key 'product'
        console.log("Data detail produk:", response.data.product);
      } catch (err) {
        console.error("Error mengambil detail produk:", err);
        setError(err.response?.data?.error || err.message || "Gagal mengambil detail produk.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]); // Jalankan efek ini setiap kali productId berubah

  if (isLoading) {
    return <div className="text-center py-10 text-slate-700">Memuat detail produk...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center py-10 text-slate-700">Produk tidak ditemukan.</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
          <div className="md:w-1/2 p-4">
            <Link
              to={product.image_url || "https://via.placeholder.com/600x400/E2E8F0/4A5568?text=No+Image"}
              target="_blank"
            >
              <img
                src={product.image_url || "https://via.placeholder.com/600x400/E2E8F0/4A5568?text=No+Image"}
                alt={product.name}
                className="w-full h-auto md:h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{product.name}</h1>
              {product.category && (
                <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {product.category}
                </span>
              )}
              <p className="text-3xl font-bold text-indigo-600 mb-6">
                Rp {product.price ? product.price.toLocaleString("id-ID") : "N/A"}
              </p>
              <div className="text-slate-700 mb-6 space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Deskripsi Produk:</h3>
                <p className="text-base leading-relaxed">{product.description || "Deskripsi tidak tersedia."}</p>
                {product.short_description && <p className="text-sm italic mt-2">{product.short_description}</p>}
              </div>
              <p className="text-sm text-slate-600 mb-1">
                Stok Tersedia: <span className="font-semibold">{product.stock_quantity}</span>
              </p>
            </div>
            <div className="mt-6">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
                Tambah ke Keranjang
              </button>
              <Link to="/produk" className="block text-center mt-4 text-indigo-600 hover:text-indigo-800">
                &larr; Kembali ke Daftar Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
