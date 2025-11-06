import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check } from "lucide-react";
import Layout from "../app/Layout";
import CustomerFormFields from "../components/clients/CustomerFormFields";

const tiposCliente = [
  { id: "fisica", nome: "Pessoa Física" },
  { id: "juridica", nome: "Pessoa Jurídica" },
];

export default function CustomerForm() {
  const [type, setType] = useState(tiposCliente[0]); // objeto {id, nome}
  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    telefone1: "",
    telefone2: "",
    celular: "",
    whatsapp1: false,
    whatsapp2: false,
    whatsappCelular: false,
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    cidade: "",
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  };

  const handleCepBlur = async () => {
    // chamar API de CEP
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, type: type.id });
  };

  return (
    <Layout title="Cadastro de Cliente">
      <form className="form-azul p-6 max-w-xl mx-auto" onSubmit={handleSubmit}>
        {/* Tipo de cliente */}
        <div className="campo">
          <label className="block font-semibold mb-1">Tipo de Cliente</label>
          <Listbox value={type} onChange={setType}>
            <div className="relative">
              <Listbox.Button className="w-full text-left bg-[#D6E4FF] p-2 rounded-tl-md rounded-tr-md shadow-sm flex justify-between items-center focus:outline-none focus:shadow-outline-blue">
                <span>{type.nome}</span>
                <span className="pointer-events-none">&#9662;</span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-full bg-[#D6E4FF] shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none z-10">
                  {tiposCliente.map((tipo) => (
                    <Listbox.Option
                      key={tipo.id}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                          active ? "bg-blue-200" : ""
                        }`
                      }
                      value={tipo}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block ${selected ? "font-semibold" : ""}`}>
                            {tipo.nome}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                              <Check size={16} />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Campos de acordo com o tipo */}
        {type.id === "fisica" ? (
          <>
            <div className="campo">
              <label className="block font-semibold mb-1">Nome</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="campo">
              <label className="block font-semibold mb-1">CPF</label>
              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </>
        ) : (
          <>
            <div className="campo">
              <label className="block font-semibold mb-1">Razão Social</label>
              <input
                type="text"
                name="razaoSocial"
                value={form.razaoSocial}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="campo">
              <label className="block font-semibold mb-1">Nome Fantasia</label>
              <input
                type="text"
                name="nomeFantasia"
                value={form.nomeFantasia}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="campo">
              <label className="block font-semibold mb-1">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Campos comuns */}
        <CustomerFormFields
          form={form}
          onChange={handleChange}
          onCepBlur={handleCepBlur}
        />

        {/* Botões */}
        <div className="flex items-center mt-6 gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => console.log("Cancelar")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
