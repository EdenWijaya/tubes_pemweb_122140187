import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  // Jika produk tidak ada atau tidak lengkap, tampilkan placeholder atau jangan render apa-apa
  if (!product) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col group transform hover:shadow-2xl transition-all duration-300 ease-in-out">
      <div className="h-56 w-full overflow-hidden bg-gray-200">
        <img
          src={product.imageUrl || "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=No+Image"}
          alt={product.name || "Gambar Produk"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 truncate" title={product.name}>
          {product.name || "Nama Produk Tidak Tersedia"}
        </h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-3 flex-grow">
          {product.description || "Deskripsi produk tidak tersedia."}
        </p>
        <p className="text-xl font-bold text-indigo-600 mb-4">{product.price || "Harga Tidak Tersedia"}</p>
        <Link
          to={`/produk/${product.id}`}
          className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
