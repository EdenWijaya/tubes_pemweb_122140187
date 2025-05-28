// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import axios from "axios"; // <--- PASTIKAN AXIOS SUDAH DIIMPORT

// Anda mungkin perlu menginstal dan mengimpor ikon jika ingin menggunakannya, misal dari react-icons
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Contoh

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // State untuk pesan error dari API
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  // const [showPassword, setShowPassword] = useState(false); // Untuk toggle password nanti

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setAgreedToTerms(checked);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Bersihkan pesan sukses sebelumnya
    setError(""); // Bersihkan pesan error sebelumnya

    if (!agreedToTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan."); // Set error jika terms tidak disetujui
      return;
    }

    setIsLoading(true); // Mulai loading

    try {
      // URL ke endpoint register di backend Anda
      const apiUrl = "http://localhost:6543/api/register"; // Pastikan port dan path benar

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      console.log("Mengirim data registrasi:", payload); // Log data yang akan dikirim
      const response = await axios.post(apiUrl, payload);

      // Jika request berhasil
      setMessage(response.data.message || "Registrasi berhasil!");
      console.log("Respons registrasi:", response.data);
      // Kosongkan form setelah berhasil
      setFormData({ username: "", email: "", password: "" });
      setAgreedToTerms(false);
    } catch (err) {
      // Jika request gagal
      console.error("Error saat registrasi:", err); // Log error lengkap di konsol browser
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Ambil pesan error dari backend
      } else if (err.request) {
        setError("Tidak bisa terhubung ke server. Pastikan server backend berjalan.");
      } else {
        setError("Terjadi kesalahan saat mengirim data. Coba lagi nanti.");
      }
    } finally {
      setIsLoading(false); // Selesai loading, baik sukses maupun gagal
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden">
        {/* Kolom Kiri - Informasi & Gambar Latar */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-700 to-indigo-800 p-8 md:p-12 text-white flex flex-col justify-between relative">
          <div>
            <div className="text-3xl font-bold mb-2">DenzShop</div>
            <a
              href="#" // Sebaiknya ini link ke halaman utama atau relevan
              className="text-sm text-indigo-200 hover:text-white absolute top-8 right-8 md:top-12 md:right-12"
            >
              {/* Back to website &rarr; (Bisa ditambahkan teksnya jika mau) */}
            </a>
          </div>
          <div className="mt-auto md:mt-20">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Jam Tangan, Ponsel, Laptop</h1>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">Temukan yang Terbaik</h1>
            <div className="flex space-x-2">
              <span className="block w-3 h-3 bg-white rounded-full"></span>
              <span className="block w-3 h-3 bg-white opacity-50 rounded-full"></span>{" "}
              {/* Ubah opacity jika ingin beda */}
              <span className="block w-3 h-3 bg-white opacity-50 rounded-full"></span>{" "}
              {/* Ubah opacity jika ingin beda */}
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Form Registrasi */}
        <div className="w-full md:w-3/5 bg-slate-800 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-1">Create an account</h2>
          <p className="text-slate-400 mb-8">
            Already have an account?{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Log in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <span className="text-slate-400 cursor-pointer">
                    {/* (eye) - Placeholder untuk ikon toggle password */}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-slate-500 rounded focus:ring-indigo-500 bg-slate-700"
                disabled={isLoading}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-slate-400">
                I agree to the{" "}
                <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Mendaftar..." : "Create account"}
            </button>
          </form>

          {/* Menampilkan pesan sukses atau error dari API */}
          {message && ( // Pesan sukses dari operasi sebelumnya (seperti 'Formulir siap dikirim')
            <p className="mt-4 text-sm text-center text-green-400">{message}</p>
          )}
          {error && ( // Pesan error dari API atau validasi client-side
            <p className="mt-4 text-sm text-center text-red-400">{error}</p>
          )}
          {/* Placeholder untuk social login bisa ditambahkan di sini jika perlu */}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
