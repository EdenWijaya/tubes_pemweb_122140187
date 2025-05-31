// src/pages/ProductListPage.jsx
import React from "react";
import ProductCard from "../components/ProductCard"; // Impor komponen kartu produk Anda

// Data dummy untuk daftar produk (Anda bisa buat array yang lebih besar atau berbeda)
// Untuk contoh ini, kita bisa gunakan data yang mirip atau sama dengan featuredProductsData
// Idealnya, nanti data ini diambil dari API
const allProductsData = [
  {
    id: 1,
    name: "Jam Tangan Elegan XYZ",
    description: "Jam tangan pria dengan desain klasik modern, tahan air hingga 50m.",
    price: "Rp 1.250.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Jam+Tangan+XYZ",
    slug: "jam-tangan-xyz",
  },
  {
    id: 2,
    name: "Smartphone Canggih ProMax",
    description: "Performa tinggi dengan kamera 108MP dan layar AMOLED super jernih.",
    price: "Rp 8.799.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Smartphone+ProMax",
    slug: "smartphone-promax",
  },
  {
    id: 3,
    name: "Laptop Ultrabook SwiftBook",
    description: "Tipis, ringan, dan bertenaga. Cocok untuk produktivitas di mana saja.",
    price: "Rp 15.300.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Laptop+SwiftBook",
    slug: "laptop-swiftbook",
  },
  {
    id: 4,
    name: "Smartwatch ActiveFit Gen 2",
    description: "Pantau aktivitas dan kesehatan Anda dengan gaya. Berbagai fitur canggih.",
    price: "Rp 2.150.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Smartwatch+ActiveFit",
    slug: "smartwatch-activefit",
  },
  // Tambahkan lebih banyak produk di sini jika mau untuk halaman daftar produk
  {
    id: 5,
    name: "Headphone Pro Audio X1",
    description: "Kualitas suara studio dengan noise cancellation aktif dan kenyamanan maksimal.",
    price: "Rp 3.500.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Headphone+Pro+X1",
    slug: "headphone-pro-x1",
  },
  {
    id: 6,
    name: "Tablet Kreatif TabPlus",
    description: "Layar sentuh responsif dengan stylus presisi untuk para profesional kreatif.",
    price: "Rp 6.200.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Tablet+TabPlus",
    slug: "tablet-tabplus",
  },
];

function ProductListPage() {
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
        {/* <div className="mb-8 flex justify-between items-center">
          <div>Filter Kategori</div>
          <div>Urutkan Berdasarkan</div>
        </div> */}

        {allProductsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {allProductsData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 text-xl">Oops! Belum ada produk yang tersedia saat ini.</p>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
