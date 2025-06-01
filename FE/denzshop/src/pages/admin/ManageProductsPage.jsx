import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Untuk mendapatkan token jika diperlukan untuk API admin

function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Ambil token untuk otentikasi permintaan API admin

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Kita menggunakan endpoint publik /api/products untuk menampilkan data
      // Jika Anda memiliki endpoint admin khusus untuk membaca produk, gunakan itu
      const response = await axios.get("http://localhost:6543/api/products");
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Error mengambil produk untuk admin:", err);
      setError(err.response?.data?.error || err.message || "Gagal mengambil data produk.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${productName}" (ID: ${productId})?`)) {
      try {
        // Pastikan Anda mengirim token di header untuk endpoint delete admin
        await axios.delete(`http://localhost:6543/api/admin/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh daftar produk setelah berhasil menghapus
        fetchProducts();
        alert(`Produk "${productName}" berhasil dihapus.`); // Ganti dengan toast nanti
      } catch (err) {
        console.error("Error menghapus produk:", err);
        alert(`Gagal menghapus produk: ${err.response?.data?.error || err.message}`); // Ganti dengan toast nanti
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Memuat data produk...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Kelola Produk</h1>
        <Link
          to="/admin/products/add"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          + Tambah Produk Baru
        </Link>
      </div>

      {products.length === 0 && !isLoading && (
        <p className="text-center text-slate-500">Belum ada produk untuk dikelola.</p>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    Rp {product.price ? Number(product.price).toLocaleString("id-ID") : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{product.category || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/products/edit/${product.id}`} // Nanti kita buat halaman/form ini
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageProductsPage;
