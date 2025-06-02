import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (!agreedToTerms) {
      toast.error("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:6543/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success(response.data.message || "Registrasi berhasil!");
      console.log("Respons registrasi:", response.data);
      setFormData({ username: "", email: "", password: "" });
      setAgreedToTerms(false);
    } catch (err) {
      console.error("Error saat registrasi:", err);
      const errorMessage =
        err.response?.data?.error || (err.request ? "Tidak bisa terhubung ke server." : "Terjadi kesalahan.");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
              href="#"
              className="text-sm text-indigo-200 hover:text-white absolute top-8 right-8 md:top-12 md:right-12"
            ></a>
          </div>
          <div className="mt-auto md:mt-20">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Jam Tangan, Ponsel, Laptop</h1>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">Temukan yang Terbaik</h1>
            <div className="flex space-x-2">
              <span className="block w-3 h-3 bg-white rounded-full"></span>
              <span className="block w-3 h-3 bg-white rounded-full"></span>
              <span className="block w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Form Registrasi */}
        <div className="w-full md:w-3/5 bg-slate-800 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-1">Create an account</h2>
          <p className="text-slate-400 mb-8 text-center md:text-left">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Log in
            </Link>
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
                  <span className="text-slate-400 cursor-pointer"></span>
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

          {message && <p className="mt-4 text-sm text-center text-green-400">{message}</p>}
          {error && <p className="mt-4 text-sm text-center text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
