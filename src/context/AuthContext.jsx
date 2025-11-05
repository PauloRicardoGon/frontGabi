/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://192.168.0.11:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password }),
      });

      if (!response.ok) throw new Error("Erro ao fazer login");

      const data = await response.json();
      if (!data.token) throw new Error("Token não recebido");

      const userData = { name: data.user?.login || "Usuário" };

      setUser(userData);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
