import { useMemo, useState } from "react";
import Layout from "../app/Layout";
import CustomerCard from "../components/clients/CustomerCard";
import { useCustomers } from "../hooks/useCustomers";

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { customersForCards, loading, error } = useCustomers();

  const filteredCustomers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return customersForCards;
    }

    return customersForCards.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedTerm) ||
        customer.document.toLowerCase().includes(normalizedTerm)
    );
  }, [customersForCards, searchTerm]);

  return (
    <Layout title="Clientes">
      <div className="p-5">
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar por nome ou CPF/CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg p-3 mb-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading && <p className="text-gray-500">Carregando clientes...</p>}
        {error && !loading && (
          <p className="text-red-500">Não foi possível carregar a lista de clientes.</p>
        )}

        {/* Exibe os cards filtrados */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))
            ) : (
              <p className="text-gray-500">Nenhum cliente encontrado.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
