import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, getTotalItems } = useCart();
  const { user } = useAuth(); // Ambil info user yang login
  const navigate = useNavigate();

  // State untuk form alamat pengiriman
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.username || "", // Isi otomatis jika ada, atau biarkan user isi
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.phoneNumber
    ) {
      toast.error("Mohon lengkapi semua informasi pengiriman.");
      return;
    }

    console.log("Informasi Pesanan:");
    console.log("Items:", cartItems);
    console.log("Total Harga:", getCartTotal());
    console.log("Info Pengiriman:", shippingInfo);

    // Simulasi proses pemesanan
    toast.success("Pesanan Anda telah berhasil dibuat! Terima kasih telah berbelanja di DenzShop!");

    clearCart(); // Kosongkan keranjang
    navigate("/home"); // Arahkan ke beranda atau halaman "Terima Kasih" nanti
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center bg-slate-50">
        <h1 className="text-3xl font-semibold text-slate-700 mb-4">Keranjang Anda Kosong</h1>
        <p className="text-slate-500 mb-6">
          Anda tidak bisa melanjutkan ke checkout karena tidak ada item di keranjang.
        </p>
        <Link
          to="/produk"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Kembali Belanja
        </Link>
      </div>
    );
  }

  const totalPrice = getCartTotal();
  const totalItems = getTotalItems();

  return (
    <div className="bg-slate-100 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Checkout</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
          {/* Kolom Form Informasi Pengiriman & Pembayaran */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6 md:p-8 mb-8 lg:mb-0">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-3">Informasi Pengiriman</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows="3"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                    Kota/Kabupaten
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={shippingInfo.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-3">Metode Pembayaran</h2>
                <div className="bg-indigo-50 p-4 rounded-md">
                  <p className="text-slate-700 text-sm">
                    Untuk saat ini, kami hanya menerima{" "}
                    <span className="font-semibold">Pembayaran di Tempat (Cash on Delivery - COD)</span> saat barang
                    diterima.
                  </p>
                  <p className="text-slate-700 text-sm mt-1">Pastikan Anda menyiapkan uang pas.</p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Buat Pesanan
                </button>
              </div>
            </form>
          </div>

          {/* Kolom Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 sticky top-24">
              {" "}
              {/* Dibuat sticky */}
              <h2 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-3">Ringkasan Pesanan</h2>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {item.name} <span className="text-sm text-slate-500">x {item.quantity}</span>
                    </p>
                    <p className="text-xs text-slate-500">Rp {Number(item.price).toLocaleString("id-ID")} / item</p>
                  </div>
                  <p className="font-semibold text-slate-800">
                    Rp {Number(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-slate-600">Subtotal ({totalItems} item)</p>
                  <p className="text-slate-800 font-semibold">Rp {Number(totalPrice).toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between items-center mb-2"></div>
                <div className="flex justify-between items-center text-xl font-bold text-indigo-600 mt-3 pt-3 border-t border-indigo-200">
                  <p>Total Pembayaran</p>
                  <p>Rp {Number(totalPrice).toLocaleString("id-ID")}</p> {/* Asumsi belum ada biaya tambahan */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
