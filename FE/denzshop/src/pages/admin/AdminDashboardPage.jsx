import React from "react";
import { useAuth } from "../../context/AuthContext"; // Sesuaikan path jika perlu

function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-8 min-h-[calc(100vh-8rem)] bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      <p className="text-lg text-slate-700">Selamat datang di area admin, {user?.username}!</p>
      <p className="text-slate-600">Peran Anda: {user?.role}</p>
      {/* Konten dashboard admin lainnya akan ada di sini nanti */}
    </div>
  );
}
export default AdminDashboardPage;
