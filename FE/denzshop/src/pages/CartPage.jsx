import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getTotalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center bg-slate-50">
        <h1 className="text-3xl font-semibold text-slate-700 mb-4">Keranjang Belanja Anda Kosong</h1>
        <p className="text-slate-500 mb-6">Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
        <Link
          to="/produk"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    } else if (newQuantity === 0) {
      // Optional: konfirmasi sebelum menghapus, atau biarkan updateQuantity menghapusnya
      if (window.confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${itemName}" dari keranjang?`)) {
      // window.confirm masih oke untuk aksi destruktif
      removeFromCart(itemId);
      toast.info(`"${itemName}" telah dihapus dari keranjang.`); // Ganti alert dengan toast.info atau toast.success
    }
  };

  const handleClearCart = () => {
    if (cartItems.length > 0 && window.confirm("Apakah Anda yakin ingin mengosongkan seluruh keranjang?")) {
      clearCart();
      toast.success("Keranjang berhasil dikosongkan."); // Ganti alert dengan toast.success
    }
  };

  const totalItems = getTotalItems();
  const totalPrice = getCartTotal();

  return (
    <div className="bg-slate-100 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Keranjang Belanja Anda</h1>

        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-slate-200 last:border-b-0"
            >
              <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                <img
                  src={item.image_url || "https://via.placeholder.com/100x100/E2E8F0/CBD5E0?text=Produk"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-4 shadow"
                />
                <div className="flex-grow">
                  <Link
                    to={`/produk/${item.slug || item.id}`}
                    className="text-lg font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-slate-500">Harga: Rp {Number(item.price).toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Tombol Kuantitas */}
                <div className="flex items-center border border-slate-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                    className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                    // disabled={item.quantity <= 1} // Atau biarkan handleQuantityChange yg urus
                  >
                    {/* <MinusIcon className="h-5 w-5" /> */} -
                  </button>
                  <span className="px-4 py-1 text-slate-700">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    className="px-3 py-1 text-indigo-600 hover:bg-indigo-50"
                    // disabled={item.quantity >= item.stock_quantity} // Perlu data stok di item keranjang
                  >
                    {/* <PlusIcon className="h-5 w-5" /> */} +
                  </button>
                </div>

                <p className="text-md font-semibold text-slate-800 w-28 text-right">
                  Rp {Number(item.price * item.quantity).toLocaleString("id-ID")}
                </p>

                <button
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="text-red-500 hover:text-red-700"
                  title="Hapus item"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Total dan Checkout */}
          <div className="mt-8 pt-6 border-t border-slate-300">
            <div className="flex justify-end items-center mb-4">
              <span className="text-lg font-semibold text-slate-700 mr-2">Total ({totalItems} item):</span>
              <span className="text-2xl font-bold text-indigo-600">
                Rp {Number(totalPrice).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleClearCart}
                className="border border-slate-400 hover:bg-slate-100 text-slate-600 font-semibold py-2 px-6 rounded-lg transition duration-150"
              >
                Kosongkan Keranjang
              </button>
              <Link
                to="/checkout"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                Lanjut ke Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
