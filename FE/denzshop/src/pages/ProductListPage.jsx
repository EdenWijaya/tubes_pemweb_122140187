import React, { useState, useEffect } from "react"; // Import useState dan useEffect
import axios from "axios"; // Import axios
import ProductCard from "../components/ProductCard"; // Komponen kartu produk Anda

function ProductListPage() {
  const [products, setProducts] = useState([]); // State untuk menyimpan daftar produk dari API
  const [isLoading, setIsLoading] = useState(true); // State untuk status loading
  const [error, setError] = useState(null); // State untuk menyimpan pesan error jika ada

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:6543/api/products");
        console.log("Data dari /api/products di ProductListPage:", response.data.products);
        setProducts(response.data.products || []);
        console.log("Data produk diterima dari API:", response.data.products);
      } catch (err) {
        console.error("Error mengambil data produk:", err);
        setError(err.message || "Gagal mengambil data produk dari server.");
        setProducts([]); // Kosongkan produk jika error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Array dependensi kosong berarti useEffect ini hanya berjalan sekali saat komponen dimuat

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Semua Produk Kami</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Jelajahi koleksi lengkap gadget terbaru dan terbaik dari DenzShop.
          </p>
          <div className="mt-4 w-20 h-1 bg-indigo-500 mx-auto"></div>
        </div>

        {/* Nanti bisa tambahkan filter dan sorting di sini */}

        {isLoading && <p className="text-center text-slate-500 text-xl">Memuat produk...</p>}

        {error && !isLoading && <p className="text-center text-red-500 text-xl">Error: {error}</p>}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="text-center text-slate-500 text-xl">Oops! Belum ada produk yang tersedia saat ini.</p>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
