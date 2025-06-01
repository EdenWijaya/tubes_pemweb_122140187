import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Contoh ikon, Anda bisa menggunakan library seperti Heroicons atau React Icons
// import { StarIcon, ShoppingCartIcon, CreditCardIcon } from '@heroicons/react/24/solid';
// import { ChevronLeftIcon } from '@heroicons/react/24/outline';

function ProductDetailPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  // const [selectedColor, setSelectedColor] = useState(null); // Untuk pilihan warna nanti
  // const [mainImage, setMainImage] = useState(null); // Untuk galeri gambar nanti

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:6543/api/products/${productId}`);
        const productData = response.data.product;

        if (productData && typeof productData.price === "string") {
          const priceString = productData.price.replace(/[^0-9]/g, "");
          productData.price = parseInt(priceString, 10);
        } else if (productData && typeof productData.price !== "number") {
          productData.price = 0;
        }
        setProduct(productData);
        // setMainImage(productData?.image_url); // Set gambar utama awal
      } catch (err) {
        console.error("Error mengambil detail produk:", err);
        setError(err.response?.data?.error || err.message || "Gagal mengambil detail produk.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    if (product && newQuantity > product.stock_quantity) newQuantity = product.stock_quantity;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Anda harus login terlebih dahulu untuk menambahkan item ke keranjang.");
      navigate("/login"); // Arahkan ke halaman login
      return;
    }

    if (product && product.stock_quantity > 0 && quantity > 0) {
      const productToAdd = { ...product, price: Number(product.price) };
      addToCart(productToAdd, quantity);
      alert(`${quantity} x ${product.name} berhasil ditambahkan ke keranjang!`);
    } else {
      alert("Stok produk habis atau jumlah tidak valid.");
    }
  };

  // const handleBuyNow = () => {
  //   // Logika untuk langsung ke checkout
  //   if (product && product.stock_quantity > 0 && quantity > 0) {
  //     const productToAdd = { ...product, price: Number(product.price) };
  //     addToCart(productToAdd, quantity); // Tambahkan ke keranjang dulu
  //     // TODO: navigate('/checkout'); // Nanti arahkan ke halaman checkout
  //     alert('Proses Beli Sekarang (akan diarahkan ke checkout)');
  //   } else {
  //      alert('Stok produk habis atau jumlah tidak valid.');
  //   }
  // }

  // Placeholder untuk thumbnail, nanti bisa diisi dari data produk jika ada multiple images
  // const thumbnails = product?.galleryImages || [product?.image_url, 'https://via.placeholder.com/100', 'https://via.placeholder.com/100'];

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))] text-slate-700 text-xl bg-slate-50">
        <p>Memuat detail produk...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))] text-red-600 text-xl bg-slate-50">
        <p>Error: {error}</p>
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))] text-slate-700 text-xl bg-slate-50">
        <p>Produk tidak ditemukan.</p>
      </div>
    );

  return (
    <div className="bg-white min-h-screen py-8 md:py-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/produk"
            className="text-indigo-700 hover:text-indigo-900 font-medium inline-flex items-center text-sm"
          >
            {/* <ChevronLeftIcon className="h-5 w-5 mr-1" /> */}
            &larr; Semua Produk
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          {/* Kolom Gambar Produk */}
          <div className="sticky top-24">
            {" "}
            {/* Membuat gambar sticky saat scroll di layar besar */}
            <div className="mb-4">
              <img
                src={product.image_url || "https://via.placeholder.com/600x600/F3F4F6/9CA3AF?text=Gambar+Produk"}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg shadow-md aspect-square"
              />
            </div>
            {/* Galeri Thumbnail (Placeholder) */}
            {/* <div className="grid grid-cols-5 gap-2">
                            {thumbnails.map((thumb, index) => (
                                <button key={index} onClick={() => setMainImage(thumb)} className={`border rounded-md overflow-hidden ${mainImage === thumb ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-200'}`}>
                                    <img src={thumb || 'https://via.placeholder.com/100'} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                                </button>
                            ))}
                        </div> */}
          </div>

          {/* Kolom Detail Produk */}
          <div className="mt-8 lg:mt-0">
            {/* Nama Merek/Kategori (Opsional) */}
            {/* {product.brand && <p className="text-sm text-slate-500 mb-1">{product.brand}</p>} */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 leading-tight">{product.name}</h1>

            {/* Rating & Ulasan (Placeholder) */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {/* {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < (product.rating || 0) ? 'fill-current' : 'stroke-current text-gray-300'}`} />)} */}
                <span className="text-yellow-400">★★★★☆</span> {/* Placeholder rating */}
              </div>
              {/* <span className="ml-2 text-sm text-slate-500">({product.reviews_count || 0} ulasan)</span> */}
              <span className="ml-2 text-sm text-slate-500">(Placeholder Ulasan)</span>
            </div>

            <p className="text-4xl font-extrabold text-slate-800 mb-6">
              Rp {product.price ? Number(product.price).toLocaleString("id-ID") : "N/A"}
            </p>

            {/* Pilihan Warna (Placeholder) */}
            {/* <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-900 mb-2">Warna: <span className="font-normal text-slate-600">Putih</span></h3>
                            <div className="flex items-center space-x-2">
                                <button className="w-8 h-8 rounded-full bg-white border-2 border-indigo-500 ring-2 ring-offset-1 ring-indigo-500"></button>
                                <button className="w-8 h-8 rounded-full bg-black border border-slate-300"></button>
                                <button className="w-8 h-8 rounded-full bg-red-500 border border-slate-300"></button>
                            </div>
                        </div> */}

            {/* Pilihan Ukuran (Placeholder) */}
            {/* <div className="mb-6">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-slate-900">Ukuran:</h3>
                                <a href="#" className="text-sm text-indigo-600 hover:underline">Panduan Ukuran</a>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button key={size} className="px-4 py-2 rounded-md border border-slate-300 text-sm text-slate-700 hover:border-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div> */}

            <div className="mb-6 flex items-end space-x-4">
              {product.stock_quantity > 0 && (
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">
                    Jumlah:
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              )}
              <p className="text-sm text-slate-600 pb-2">
                Stok:
                <span
                  className={`font-semibold ml-1 ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {product.stock_quantity > 0 ? `${product.stock_quantity} tersedia` : "Habis"}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                // onClick={handleBuyNow}
                disabled={product.stock_quantity === 0 || quantity === 0 || quantity > product.stock_quantity}
                className={`w-full text-white font-semibold py-3 px-6 rounded-lg text-base shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  product.stock_quantity > 0 && quantity > 0 && quantity <= product.stock_quantity
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                Beli Sekarang
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || quantity === 0 || quantity > product.stock_quantity}
                className={`w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (product.stock_quantity === 0 || quantity === 0 || quantity > product.stock_quantity) &&
                  "border-slate-400 text-slate-400 hover:bg-transparent cursor-not-allowed"
                }`}
              >
                {/* <ShoppingCartIcon className="h-5 w-5 inline-block mr-2 -mt-1" /> */}+ Keranjang
              </button>
            </div>

            <div className="mt-8 text-sm text-slate-500 space-y-2">
              <p>
                <span className="font-semibold text-slate-700">Pengiriman:</span> Gratis ongkir untuk pesanan di atas Rp
                300.000.
              </p>
              <p>
                <span className="font-semibold text-slate-700">Retur:</span> Pengembalian mudah dalam 30 hari.{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Detail
                </a>
              </p>
            </div>

            {/* Deskripsi Lengkap Produk */}
            {product.description && (
              <div className="mt-10 pt-6 border-t border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Deskripsi Produk</h2>
                <div className="prose prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
