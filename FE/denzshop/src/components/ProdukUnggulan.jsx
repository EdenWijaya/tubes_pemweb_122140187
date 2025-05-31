// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // <--- IMPORT ProductCard

// Data dummy untuk produk unggulan (masih sama)
const featuredProductsData = [
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
];

function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Bagian Produk Unggulan */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Produk Unggulan Kami</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Temukan koleksi terbaik dari jam tangan, smartphone, dan laptop pilihan.
            </p>
            <div className="mt-4 w-24 h-1 bg-indigo-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProductsData.map((product) => (
              // Gunakan komponen ProductCard di sini
              <ProductCard key={product.id} product={product} /> // <--- UBAH INI
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
