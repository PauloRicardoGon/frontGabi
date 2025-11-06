import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../app/Layout";
import CustomerFormFields from "../components/clients/CustomerFormFields";
import useAuth from "../hooks/useAuth";
import { getCustomerById } from "../services/clientService";

const initialFormState = {
  telefone1: "",
  telefone2: "",
  celular: "",
  whatsapp1: false,
  whatsapp2: false,
  whatsappCelular: false,
  email: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
};

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authorizedRequest } = useAuth();

  useEffect(() => {
    let isActive = true;

    const fetchCustomer = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { customer: fetchedCustomer, form: fetchedForm } =
          await getCustomerById(authorizedRequest, id);

        if (!isActive) {
          return;
        }

        setCustomer(fetchedCustomer);

        const nextFormState = { ...initialFormState };

        Object.keys(initialFormState).forEach((key) => {
          if (fetchedForm && fetchedForm[key] !== undefined) {
            nextFormState[key] = fetchedForm[key];
          } else if (fetchedCustomer && fetchedCustomer[key] !== undefined) {
            nextFormState[key] = fetchedCustomer[key];
          }
        });

        setForm(nextFormState);
      } catch (err) {
        if (!isActive) {
          return;
        }

        console.error("Erro ao carregar cliente:", err);
        setCustomer(null);
        setError(err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchCustomer();

    return () => {
      isActive = false;
    };
  }, [authorizedRequest, id]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return (
      <Layout title="Detalhes do Cliente">
        <div className="p-10 text-gray-500">Carregando...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Detalhes do Cliente">
        <div className="p-10 text-red-600">
          {error.message ?? "Não foi possível carregar os dados do cliente."}
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout title="Detalhes do Cliente">
        <div className="p-10 text-gray-500">Cliente não encontrado.</div>
      </Layout>
    );
  }

  const isPessoaFisica = customer.type === "fisica";
  const displayName = isPessoaFisica
    ? customer.nome || customer.nomeFantasia || customer.name || "Cliente"
    :
        customer.razaoSocial ||
        customer.nomeFantasia ||
        customer.nome ||
        customer.name ||
        "Cliente";
  const documentLabel = isPessoaFisica ? "CPF" : "CNPJ";
  const documentValue = isPessoaFisica
    ? customer.cpf || customer.document
    : customer.cnpj || customer.document;

  return (
    <Layout title="Detalhes do Cliente">
      <div className="p-10 space-y-8">
        <section>
          <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
          <p className="text-gray-700">
            <strong>Tipo:</strong> {isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"}
          </p>
          <p className="text-gray-700">
            <strong>{documentLabel}:</strong> {documentValue || "Não informado"}
          </p>
        </section>

        <section className="form-azul p-6 max-w-xl">
          <h2 className="text-lg font-semibold mb-4">Informações de contato</h2>
          <CustomerFormFields form={form} onChange={handleChange} disabled />
        </section>

        <div className="mt-4 flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Editar Cliente
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Equipamentos
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Ordens de Serviço
          </button>
        </div>
      </div>
    </Layout>
  );
}
