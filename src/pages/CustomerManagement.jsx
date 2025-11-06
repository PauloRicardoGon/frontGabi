import { useMemo, useState } from "react";
import Layout from "../app/Layout";
import CustomerCard from "../components/clients/CustomerCard";
import { StatusNotice } from "../components/ui";
import { useCustomers } from "../hooks/useCustomers";

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { customersForCards, fetchCustomers, loading, error } = useCustomers();

  const normalizedTerm = searchTerm.trim().toLowerCase();

  const filteredCustomers = useMemo(() => {
    if (!normalizedTerm) {
      return customersForCards;
    }

    return customersForCards.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedTerm) ||
        customer.document.toLowerCase().includes(normalizedTerm)
    );
  }, [customersForCards, normalizedTerm]);

  const hasCustomers = customersForCards.length > 0;
  const hasFilteredCustomers = filteredCustomers.length > 0;
  const isSearching = Boolean(normalizedTerm);

  const resolveErrorMessage = () => {
    if (!error) {
      return null;
    }

    if (error.name === "TypeError") {
      return {
        variant: "error",
        title: "Erro de conexão",
        description:
          "Não foi possível carregar a lista de clientes. Verifique sua conexão e tente novamente.",
      };
    }

    return {
      variant: "error",
      title: "Não foi possível carregar os clientes",
      description: error.message ?? "Tente novamente em instantes.",
    };
  };

  const errorMessage = resolveErrorMessage();

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

        {!loading && errorMessage && (
          <div className="mt-6">
            <StatusNotice
              variant={errorMessage.variant}
              title={errorMessage.title}
              description={errorMessage.description}
              actionLabel="Tentar novamente"
              onAction={fetchCustomers}
            />
          </div>
        )}

        {!loading && !error && !hasCustomers && (
          <div className="mt-6">
            <StatusNotice
              variant="warning"
              title="Clientes indisponíveis"
              description="Não há clientes cadastrados ou eles estão indisponíveis no momento."
              actionLabel="Recarregar"
              onAction={fetchCustomers}
            />
          </div>
        )}

        {!loading && !error && hasCustomers && (
          <div className="mt-6">
            {hasFilteredCustomers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredCustomers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
              </div>
            ) : (
              <StatusNotice
                variant={isSearching ? "info" : "warning"}
                title={
                  isSearching
                    ? "Nenhum cliente encontrado"
                    : "Clientes indisponíveis"
                }
                description={
                  isSearching
                    ? "Ajuste os filtros ou tente pesquisar por outro nome ou documento."
                    : "Não há clientes disponíveis para exibição no momento."
                }
                actionLabel={isSearching ? undefined : "Recarregar"}
                onAction={isSearching ? undefined : fetchCustomers}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
