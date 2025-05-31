import React from "react";
import {
  ShieldCheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

const Pilihan = [
  {
    icon: <ShieldCheckIcon className="h-10 w-10 text-indigo-500 mb-4" />,
    name: "Produk Original & Berkualitas",
    description: "Kami hanya menjual produk asli dengan garansi resmi dan kualitas terjamin untuk kepuasan Anda.",
  },
  {
    icon: <TruckIcon className="h-10 w-10 text-indigo-500 mb-4" />,
    iconPlaceholder: "🚚",
    name: "Pengiriman Cepat & Aman",
    description: "Nikmati pengiriman yang cepat dan aman sampai ke depan pintu rumah Anda, di seluruh Indonesia.",
  },
  {
    icon: <CurrencyDollarIcon className="h-10 w-10 text-indigo-500 mb-4" />,
    iconPlaceholder: "💲",
    name: "Harga Terbaik & Kompetitif",
    description: "Dapatkan penawaran harga terbaik untuk gadget impian Anda dengan berbagai promo menarik.",
  },
  {
    icon: <ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-indigo-500 mb-4" />,
    iconPlaceholder: "💬",
    name: "Layanan Pelanggan Responsif",
    description: "Tim kami siap membantu Anda dengan cepat dan ramah untuk setiap pertanyaan atau kendala.",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-12 md:py-20 bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Kenapa Memilih DenzShop?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kami berkomitmen untuk memberikan pengalaman belanja teknologi terbaik untuk Anda.
          </p>
          <div className="mt-4 w-24 h-1 bg-indigo-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Pilihan.map((feature) => (
            <div
              key={feature.name}
              className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <div className="flex justify-center items-center mb-4 text-4xl text-indigo-500">
                {feature.iconPlaceholder}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.name}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
