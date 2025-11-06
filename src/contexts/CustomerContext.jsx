/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";

export const CustomerContext = createContext();

const formatCpfCnpj = (value = "") => {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (digits.length === 14) {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return value;
};

const selectPreferredPhone = (customer) =>
  customer.celularwhatsapp ||
  customer.telefonewhatsapp1 ||
  customer.telefonewhatsapp2 ||
  customer.telefone1 ||
  customer.telefone2 ||
  "";

const formatAddress = (address) => {
  if (!address) {
    return {
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      formatted: "",
    };
  }

  const street = address.logradouro ?? "";
  const number = address.numero ?? "";
  const complement = address.complemento ?? "";
  const district = address.bairro ?? "";
  const city = address.cidade ?? "";

  const formatted = [street, number, complement, district, city]
    .filter(Boolean)
    .join(", ");

  return {
    street,
    number,
    complement,
    district,
    city,
    formatted,
  };
};

export const CustomerProvider = ({ children }) => {
  const { token, authorizedRequest } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    if (!token) {
      setCustomers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authorizedRequest("/customers?razaoSocial=");
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Erro ao carregar clientes");
      }

      if (!Array.isArray(payload)) {
        throw new Error("Resposta inválida ao carregar clientes");
      }

      setCustomers(payload);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      setCustomers([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [authorizedRequest, token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const customersForCards = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.idCliente,
        name: customer.razaoSocial ?? "",
        document: formatCpfCnpj(customer.cpfCnpj ?? ""),
        phone: selectPreferredPhone(customer),
        address: formatAddress(customer.endereco),
      })),
    [customers]
  );

  const customersForEdition = useMemo(
    () =>
      customers.map((customer) => {
        const { idCliente: _idCliente, ...rest } = customer;
        return { ...rest };
      }),
    [customers]
  );

  const getCustomerForEdition = useCallback(
    (id) => {
      const match = customers.find(
        (customer) => String(customer.idCliente) === String(id)
      );

      if (!match) {
        return null;
      }

      const { idCliente: _idCliente, ...rest } = match;
      return { ...rest };
    },
    [customers]
  );

  return (
    <CustomerContext.Provider
      value={{
        customersForCards,
        customersForEdition,
        getCustomerForEdition,
        fetchCustomers,
        loading,
        error,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
