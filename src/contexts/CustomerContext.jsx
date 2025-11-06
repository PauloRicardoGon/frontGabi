/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchCustomers as fetchCustomersApi } from "../api/clients";
import { useAuth } from "../hooks/useAuth";
import {
  mapCustomerForEdition,
  mapCustomersForEdition,
  mapCustomersToCards,
} from "../services/clientService";

export const CustomerContext = createContext();

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
      const payload = await fetchCustomersApi(authorizedRequest);
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
    () => mapCustomersToCards(customers),
    [customers]
  );

  const customersForEdition = useMemo(
    () => mapCustomersForEdition(customers),
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

      return mapCustomerForEdition(match);
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
