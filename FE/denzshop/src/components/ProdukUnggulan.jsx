import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero"; // Asumsikan Hero.jsx ada di src/components/

// Data dummy untuk produk unggulan
const ProdukUnggulan = [
  {
    id: 1,
    name: "Jam Tangan Elegan XYZ",
    description: "Jam tangan pria dengan desain klasik modern, tahan air hingga 50m.",
    price: "Rp 1.250.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Jam+Tangan+XYZ",
    slug: "jam-tangan-xyz", // Untuk link ke detail produk nanti
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
    id: 4, // Tambahkan satu produk lagi agar terlihat lebih baik di grid 2 atau 4 kolom
    name: "Smartwatch ActiveFit Gen 2",
    description: "Pantau aktivitas dan kesehatan Anda dengan gaya. Berbagai fitur canggih.",
    price: "Rp 2.150.000",
    imageUrl: "https://via.placeholder.com/300x200/E2E8F0/4A5568?text=Smartwatch+ActiveFit",
    slug: "smartwatch-activefit",
  },
];

function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <section className="py-12 md:py-20 bg-white">
        {" "}
        {/* Atau bg-slate-100 jika ingin sedikit beda dari Hero */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Produk Unggulan Kami</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Temukan koleksi terbaik dari jam tangan, smartphone, dan laptop pilihan.
            </p>
            <div className="mt-4 w-24 h-1 bg-indigo-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ProdukUnggulan.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col group transform hover:shadow-2xl transition-all duration-300 ease-in-out"
              >
                <div className="h-56 w-full overflow-hidden bg-gray-200">
                  {" "}
                  {/* Latar untuk gambar */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-3 flex-grow">{product.description}</p>
                  <p className="text-xl font-bold text-indigo-600 mb-4">{product.price}</p>
                  <Link
                    to={`/produk/${product.slug}`} // Nanti arahkan ke detail produk dengan slug atau id
                    className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Anda bisa menambahkan bagian lain di sini, seperti Kategori, Testimoni, dll. */}
    </div>
  );
}

export default HomePage;
