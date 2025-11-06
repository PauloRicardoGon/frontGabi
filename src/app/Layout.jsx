import { useState } from "react";
import { X, Menu } from "lucide-react";

export default function Layout({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#37618E] text-white p-4 shadow-md flex items-center">
        <button
          className="text-2xl mr-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        {title ? (
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold">
            {title}
          </h1>
        ) : null}
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar esquerda */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Menu</h2>
        </div>
        <nav className="p-4 flex flex-col gap-4">
          <a href="/" className="hover:text-blue-600">Dashboard</a>
          <a href="/clientes" className="hover:text-blue-600">Clientes</a>
          <a href="/equipamentos" className="hover:text-blue-600">Equipamentos</a>
          <a href="/ordens" className="hover:text-blue-600">Ordens de Serviço</a>
        </nav>
      </div>

      {/* Conteúdo da página */}
      <main className="w-full">{children}</main>
    </div>
  );
}
