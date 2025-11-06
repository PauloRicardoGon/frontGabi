import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../app/Layout";
import CustomerFormFields from "../components/clients/CustomerFormFields";

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

  useEffect(() => {
    // substituir depois pela API real
    const fetchedCustomer = {
      id,
      type: "fisica",
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      telefone1: "(11) 99999-9999",
      whatsapp1: true,
      telefone2: "(11) 98888-7777",
      whatsapp2: false,
      celular: "(11) 97777-6666",
      whatsappCelular: true,
      email: "maria@email.com",
      cep: "01000-000",
      endereco: "Rua das Flores",
      numero: "123",
      complemento: "Apto 12",
      bairro: "Centro",
      cidade: "São Paulo",
    };

    setCustomer(fetchedCustomer);
    setForm((prev) => ({
      ...prev,
      ...Object.keys(initialFormState).reduce((acc, key) => {
        if (fetchedCustomer[key] !== undefined) {
          acc[key] = fetchedCustomer[key];
        }
        return acc;
      }, {}),
    }));
  }, [id]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!customer) {
    return (
      <Layout title="Detalhes do Cliente">
        <div className="p-10 text-gray-500">Carregando...</div>
      </Layout>
    );
  }

  const isPessoaFisica = customer.type === "fisica";
  const displayName = isPessoaFisica
    ? customer.nome ?? customer.name ?? "Cliente"
    : customer.razaoSocial ?? customer.nome ?? customer.name ?? "Cliente";
  const documentLabel = isPessoaFisica ? "CPF" : "CNPJ";
  const documentValue = isPessoaFisica
    ? customer.cpf ?? customer.document
    : customer.cnpj ?? customer.document;

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
