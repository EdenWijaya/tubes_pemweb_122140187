import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginAction } = useAuth(); // DAPATKAN loginAction DARI CONTEXT

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = "http://localhost:6543/api/login";
      const payload = {
        identifier: formData.identifier,
        password: formData.password,
      };

      console.log("Mengirim data login:", payload);
      const response = await axios.post(apiUrl, payload);

      console.log("Respons login:", response.data);

      // Panggil loginAction dari AuthContext untuk menyimpan token dan data user secara global
      if (response.data.token && response.data.user) {
        loginAction({ token: response.data.token, user: response.data.user }); // GUNAKAN loginAction
        setMessage(response.data.message || "Login berhasi! Anda akan diarahkan...");
      } else {
        // Jika respons backend tidak sesuai harapan (tidak ada token atau user)
        setError("Respons login tidak valid dari server.");
      }

      setFormData({ identifier: "", password: "" });
    } catch (err) {
      console.error("Error saat login:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.request) {
        setError("Tidak bisa terhubung ke server. Pastikan server backend berjalan.");
      } else {
        setError("Terjadi kesalahan saat mengirim data. Coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden">
        <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-700 to-indigo-800 p-8 md:p-12 text-white flex flex-col justify-between relative">
          <div>
            <div className="text-3xl font-bold mb-2">DenzShop</div>
          </div>
          <div className="mt-auto md:mt-20">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Jam Tangan, Ponsel, Laptop</h1>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">Temukan yang Terbaik</h1>
            <div className="flex space-x-2">
              <span className="block w-3 h-3 bg-white rounded-full"></span>
              <span className="block w-3 h-3 bg-white opacity-50 rounded-full"></span>
              <span className="block w-3 h-3 bg-white opacity-50 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Form Login */}
        <div className="w-full md:w-3/5 bg-slate-800 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-1 text-center md:text-left">Log in to your account</h2>
          <p className="text-slate-400 mb-8 text-center md:text-left">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-300 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                name="identifier"
                id="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                placeholder="Enter your username or email"
                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {message && !error && <p className="mt-4 text-sm text-center text-green-400">{message}</p>}
          {error && <p className="mt-4 text-sm text-center text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
