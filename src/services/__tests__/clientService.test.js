import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCpfCnpj,
  selectPreferredPhone,
  formatAddress,
  mapCustomerToCard,
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
      celularwhatsapp: "9999",
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

  it("mapeia cliente para cartão com dados formatados", () => {
    const customer = {
      idCliente: 1,
      razaoSocial: "Empresa",
      cpfCnpj: "12345678000199",
      celularwhatsapp: "1199999999",
      endereco: {
        logradouro: "Rua",
        numero: "10",
        cidade: "São Paulo",
      },
    };

    const card = mapCustomerToCard(customer);

    assert.deepEqual(card, {
      id: 1,
      name: "Empresa",
      document: "12.345.678/0001-99",
      phone: "1199999999",
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

  it("remove idCliente ao preparar dados para edição", () => {
    const customers = [
      { idCliente: 1, nome: "Cliente 1" },
      { idCliente: 2, nome: "Cliente 2" },
    ];

    const result = mapCustomersForEdition(customers);

    assert.deepEqual(result, [
      { nome: "Cliente 1" },
      { nome: "Cliente 2" },
    ]);
  });
});
