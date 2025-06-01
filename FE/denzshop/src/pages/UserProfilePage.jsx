import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Untuk tombol/link

function UserProfilePage() {
  const { user, logoutAction } = useAuth(); // Ambil user dan logoutAction dari context
  const navigate = useNavigate(); // Jika ingin menggunakan navigate untuk logout

  const handleLogout = () => {
    logoutAction();
    navigate("/login"); // Arahkan ke login setelah logout
  };

  if (!user) {
    // Ini seharusnya tidak terjadi jika rute sudah diproteksi,
    // tapi sebagai fallback atau jika ada delay dalam context update.
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center bg-slate-50">
        <p className="text-slate-700 text-xl">Memuat data pengguna atau Anda tidak login...</p>
        <Link
          to="/login"
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Profil Pengguna</h1>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-600">Username:</label>
              <p className="text-lg text-slate-800 font-semibold p-3 bg-slate-50 rounded-md">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Email:</label>
              <p className="text-lg text-slate-800 font-semibold p-3 bg-slate-50 rounded-md">{user.email}</p>
            </div>
            {/* Tambahkan informasi lain yang ingin ditampilkan, misalnya tanggal bergabung jika ada */}
            {/* <p className="text-sm text-slate-500">ID Pengguna: {user.id}</p> */}
          </div>

          <div className="mt-6 border-t pt-6 space-y-3">
            {/* Nanti bisa tambahkan link untuk "Ubah Password" atau "Edit Profil" di sini */}
            <Link
              to="/riwayat-pesanan" // Contoh link, halaman ini belum kita buat
              className="block w-full text-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
            >
              Lihat Riwayat Pesanan (Placeholder)
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
