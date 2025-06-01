import React, { useState, useEffect } from "react";

function ProductForm({ onSubmit, initialData = null, isLoading = false, submitButtonText = "Simpan Produk" }) {
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    stock_quantity: "",
    category: "",
    image_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setProduct({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        short_description: initialData.short_description || "",
        price: initialData.price !== undefined ? String(initialData.price) : "",
        stock_quantity: initialData.stock_quantity !== undefined ? String(initialData.stock_quantity) : "",
        category: initialData.category || "",
        image_url: initialData.image_url || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productDataToSubmit = {
      ...product,
      price: parseInt(product.price, 10),
      stock_quantity: parseInt(product.stock_quantity, 10),
    };
    onSubmit(productDataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nama Produk
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={product.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
          Slug (untuk URL)
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          value={product.slug}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-slate-500">
          Contoh: jam-tangan-keren-model-xyz (gunakan huruf kecil, angka, dan tanda hubung)
        </p>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Deskripsi Lengkap
        </label>
        <textarea
          name="description"
          id="description"
          rows="4"
          value={product.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        ></textarea>
      </div>
      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-slate-700">
          Deskripsi Singkat (Opsional)
        </label>
        <input
          type="text"
          name="short_description"
          id="short_description"
          value={product.short_description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700">
            Harga (Angka saja, misal: 1250000)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-medium text-slate-700">
            Jumlah Stok
          </label>
          <input
            type="number"
            name="stock_quantity"
            id="stock_quantity"
            value={product.stock_quantity}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          Kategori (misal: Jam Tangan, Smartphone)
        </label>
        <input
          type="text"
          name="category"
          id="category"
          value={product.category}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-slate-700">
          URL Gambar Produk
        </label>
        <input
          type="url"
          name="image_url"
          id="image_url"
          value={product.image_url}
          onChange={handleChange}
          placeholder="https://example.com/gambar.jpg"
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Menyimpan..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
