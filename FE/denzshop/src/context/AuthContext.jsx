import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

const getInitialUser = () => {
  const userDataString = localStorage.getItem("userData");
  if (userDataString) {
    try {
      return JSON.parse(userDataString);
    } catch (e) {
      console.error("Gagal parse userData dari localStorage", e);
      localStorage.removeItem("userData"); // Hapus item yang rusak
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(getInitialUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setIsAuthenticated(false);
    }
  }, [token]);

  const loginAction = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    setIsAuthenticated(true);
  };

  const logoutAction = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
