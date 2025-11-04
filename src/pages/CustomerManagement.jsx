import { useState } from "react";
import Layout from "../components/Layout";
import CustomerCard from "../components/CustomerCard";

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");


  // Lista de clientes — futuramente virá do backend
  const customers = [
    { name: "Gabrielli Silva", cpf: "123.456.789-00", phone: "(11) 99999-9999" },
    { name: "Maria Souza", cpf: "987.654.321-00", phone: "(21) 98888-8888" },
    { name: "João Oliveira", cpf: "456.789.123-00", phone: "(31) 97777-7777" },
  ];

  // Filtro: busca por nome ou CPF
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm)
  );

  return (
    <Layout title="Clientes">
    <div className="p-5">

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Buscar por nome ou CPF..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg p-3 mb-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Exibe os cards filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer, index) => (
            <CustomerCard key={index} customer={customer} />
          ))
        ) : (
          <p className="text-gray-500">Nenhum cliente encontrado.</p>
        )}
      </div>
    </div>
    </Layout>
  );
}
