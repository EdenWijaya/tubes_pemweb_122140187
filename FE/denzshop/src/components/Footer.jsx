import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-slate-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kolom 1: Tentang Toko */}
          <div>
            <h3 className="text-xl font-bold text-indigo-400 mb-4">DenzShop</h3>
            <p className="text-sm mb-4">
              Toko online terpercaya untuk kebutuhan gadget Anda. Jam tangan, ponsel, dan laptop dengan kualitas terbaik
              dan harga bersaing.
            </p>
          </div>

          {/* Kolom 2: Link Cepat */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Link Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/produk" className="hover:text-indigo-300">
                  Semua Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Informasi Kontak */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hubungi Kami</h4>
            <address className="text-sm not-italic space-y-2">
              <p>Jl. denzshop No. 123</p>
              <p>Bandar Lampung, Indonesia</p>
              <p>Email: denzshop@gmail.com</p>
              <p>Telepon: (0721) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} DenzShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
