import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Coba ambil data keranjang dari localStorage saat inisialisasi
    const localData = localStorage.getItem("cartItems");
    return localData ? JSON.parse(localData) : [];
  });

  // Simpan ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Jika item sudah ada, update kuantitasnya
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Jika item belum ada, tambahkan item baru
        return [...prevItems, { ...product, quantity }];
      }
    });
    console.log(`Ditambahkan ke keranjang: ${quantity} x ${product.name}`);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    console.log(`Produk dengan ID ${productId} dihapus dari keranjang.`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      // Jika kuantitas 0 atau kurang, hapus item
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems"); // Hapus juga dari localStorage
    console.log("Keranjang dibersihkan.");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook kustom untuk menggunakan CartContext
export const useCart = () => {
  return useContext(CartContext);
};
