import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCpfCnpj,
  selectPreferredPhone,
  formatAddress,
  mapCustomerToCard,
  mapCustomerForEdition,
  mapCustomersForEdition,
} from "../clientService.js";

describe("clientService", () => {
  it("formata CPF corretamente", () => {
    const formatted = formatCpfCnpj("12345678901");
    assert.equal(formatted, "123.456.789-01");
  });

  it("formata CNPJ corretamente", () => {
    const formatted = formatCpfCnpj("12345678000199");
    assert.equal(formatted, "12.345.678/0001-99");
  });

  it("mantém valor original quando não é possível formatar", () => {
    const formatted = formatCpfCnpj("123");
    assert.equal(formatted, "123");
  });

  it("seleciona o telefone prioritário disponível", () => {
    const phone = selectPreferredPhone({
      telefone1: "1234",
      telefone2: "5678",
      celular: "9999",
      whatsappCelular: "S",
      whatsapp1: "N",
      whatsapp2: false,
    });
    assert.equal(phone, "9999");
  });

  it("formata endereço completo", () => {
    const address = formatAddress({
      logradouro: "Rua Um",
      numero: "123",
      complemento: "Apto 4",
      bairro: "Centro",
      cidade: "Cidade",
    });

    assert.deepEqual(address, {
      street: "Rua Um",
      number: "123",
      complement: "Apto 4",
      district: "Centro",
      city: "Cidade",
      formatted: "Rua Um, 123, Apto 4, Centro, Cidade",
    });
  });

  it("mapeia cliente pessoa jurídica para cartão com dados formatados", () => {
    const customer = {
      idCliente: 1,
      razaoSocial: "Empresa",
      cpfCnpj: "12345678000199",
      TIPOFJ: "J",
      telefone1: "1133224455",
      telefonewhatsapp1: "1133224455",
      celular: "1199999999",
      whatsapp1: "S",
      endereco: {
        logradouro: "Rua",
        numero: "10",
        cidade: "São Paulo",
      },
    };

    const card = mapCustomerToCard(customer);

    assert.deepEqual(card, {
      id: 1,
      type: "juridica",
      name: "Empresa",
      document: "12.345.678/0001-99",
      phone: "1133224455",
      address: {
        street: "Rua",
        number: "10",
        complement: "",
        district: "",
        city: "São Paulo",
        formatted: "Rua, 10, São Paulo",
      },
    });
  });

  it("normaliza dados para edição incluindo tipo, documentos e WhatsApp", () => {
    const customer = {
      idCliente: 5,
      TIPOFJ: "F",
      nome: "Maria Silva",
      cpf: "12345678901",
      telefone1: "1133332222",
      telefonewhatsapp1: "1133332222",
      telefone2: "1144445555",
      telefonewhatsapp2: "1144445555",
      celular: "1199999999",
      celularwhatsapp: "1199999999",
      email: "maria@email.com",
      endereco: {
        logradouro: "Rua das Flores",
        numero: "123",
        complemento: "Apto 12",
        bairro: "Centro",
        cidade: "São Paulo",
        cep: "01000000",
      },
    };

    const result = mapCustomerForEdition(customer);

    assert.deepEqual(result, {
      id: 5,
      type: "fisica",
      nome: "Maria Silva",
      razaoSocial: "",
      nomeFantasia: "",
      cpf: "123.456.789-01",
      cnpj: "",
      telefone1: "1133332222",
      telefone2: "1144445555",
      celular: "1199999999",
      whatsapp1: true,
      whatsapp2: true,
      whatsappCelular: true,
      email: "maria@email.com",
      cep: "01000000",
      endereco: "Rua das Flores",
      numero: "123",
      complemento: "Apto 12",
      bairro: "Centro",
      cidade: "São Paulo",
    });
  });

  it("normaliza uma lista de clientes para edição", () => {
    const customers = [
      { idCliente: 1, TIPOFJ: "F", nome: "Cliente 1", cpf: "12345678901" },
      { idCliente: 2, TIPOFJ: "J", razaoSocial: "Empresa", cnpj: "12345678000199" },
    ];

    const result = mapCustomersForEdition(customers);

    assert.deepEqual(result, [
      {
        id: 1,
        type: "fisica",
        nome: "Cliente 1",
        razaoSocial: "",
        nomeFantasia: "",
        cpf: "123.456.789-01",
        cnpj: "",
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
      },
      {
        id: 2,
        type: "juridica",
        nome: "",
        razaoSocial: "Empresa",
        nomeFantasia: "",
        cpf: "",
        cnpj: "12.345.678/0001-99",
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
      },
    ]);
  });
});
