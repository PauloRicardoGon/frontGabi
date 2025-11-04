import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check } from "lucide-react";
import Layout from "../components/Layout";
import { FaWhatsapp } from "react-icons/fa";

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
{["telefone1", "telefone2", "celular"].map((campo, i) => {
  const whatsappKey = `whatsapp${i === 2 ? "Celular" : i + 1}`;
  const isChecked = form[whatsappKey];

  return (
    <div key={campo} className="campo flex items-center gap-2">
      <div className="flex-1">
        <label className="block font-semibold mb-1">{campo}</label>
        <input
          type="text"
          name={campo}
          value={form[campo]}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <label className="flex items-center gap-1 mt-6 cursor-pointer">
        <input
          type="checkbox"
          name={whatsappKey}
          checked={isChecked}
          onChange={handleChange}
        />
        <FaWhatsapp
          className={`text-xl transition-colors duration-200 ${
            isChecked ? "text-green-500" : "text-black"
          }`}
        />
      </label>
    </div>
  );
})}


        {/* Email */}
        <div className="campo">
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Endereço */}
        <div className="campo">
          <label className="block font-semibold mb-1">CEP</label>
          <input
            type="text"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            className="w-full"
          />
        </div>
        <div className="campo">
          <label className="block font-semibold mb-1">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Número / Complemento / Bairro */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div>
            <label className="block font-semibold mb-1">Número</label>
            <input
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Complemento</label>
            <input
              type="text"
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Bairro</label>
            <input
              type="text"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Cidade */}
        <div className="campo">
          <label className="block font-semibold mb-1">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            className="w-full"
          />
        </div>

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
