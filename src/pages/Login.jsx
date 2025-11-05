// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { branding } from "../config/branding";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      console.error("Falha no login:", err);
      setError(err.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#3b6490] to-white overflow-hidden">
      <div className="w-[100%] max-w-lg p-8 rounded bg-transparent">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex justify-center mb-8">
            <img
              src={branding.logoUrl}
              alt={`${branding.name} logo`}
              className="w-64 h-auto object-contain"
            />
          </div>

          {/* Campo Usuário */}
          <div className="mb-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite seu usuário"
              className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#37618E] focus:border-[#37618E]"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#37618E] focus:border-[#37618E]"
              required
            />
            <div className="flex justify-between mt-5">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Manter conectado
                </label>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Esqueci a senha
              </a>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#37618E] text-white rounded hover:bg-[#2E5078] transition duration-200 disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
