import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProdukUnggulan() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:6543/api/products");
        console.log("Full products data from API:", response.data.products);
        setFeaturedProducts((response.data.products || []).slice(0, 4));
        console.log("Data produk unggulan diterima:", (response.data.products || []).slice(0, 4));
      } catch (err) {
        console.error("Error mengambil produk unggulan:", err);
        setError(err.message || "Gagal mengambil produk unggulan.");
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Produk Unggulan Kami</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Temukan koleksi terbaik dari jam tangan, smartphone, dan laptop pilihan.
          </p>
          <div className="mt-4 w-24 h-1 bg-indigo-500 mx-auto"></div>
        </div>

        {isLoading && <p className="text-center text-slate-500 text-xl">Memuat produk unggulan...</p>}

        {error && !isLoading && <p className="text-center text-red-500 text-xl">Error: {error}</p>}

        {!isLoading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && featuredProducts.length === 0 && (
          <p className="text-center text-slate-500 text-xl">Belum ada produk unggulan yang tersedia saat ini.</p>
        )}
      </div>
    </section>
  );
}

export default ProdukUnggulan;
