import { getCustomerById as getCustomerByIdApi } from "../api/clients.js";

export const formatCpfCnpj = (value = "") => {
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

const parseBooleanFlag = (value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["s", "sim", "y", "yes", "true", "1"].includes(normalized)) {
      return true;
    }

    if (["n", "nao", "não", "false", "0"].includes(normalized)) {
      return false;
    }
  }

  return Boolean(value);
};

const coalesce = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
};

const parseCustomerType = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["f", "pf", "fisica", "física"].includes(normalized)) {
      return "fisica";
    }

    if (["j", "pj", "juridica", "jurídica"].includes(normalized)) {
      return "juridica";
    }
  }

  return null;
};

const normalizeCustomerPayload = (customer = {}) => {
  const rawType = customer.TIPOFJ ?? customer.tipo ?? customer.type;
  let type = parseCustomerType(rawType);

  const rawCpf = customer.cpf ?? "";
  const rawCnpj = customer.cnpj ?? "";
  const rawCpfCnpj = coalesce(customer.cpfCnpj, customer.documento, customer.document);
  const combinedDocument = coalesce(rawCpfCnpj, rawCpf, rawCnpj);
  const documentDigits = combinedDocument.replace(/\D/g, "");

  if (!type) {
    if (documentDigits.length === 14) {
      type = "juridica";
    } else if (documentDigits.length === 11) {
      type = "fisica";
    } else if (rawCnpj) {
      type = "juridica";
    } else {
      type = "fisica";
    }
  }

  const cpfValue = coalesce(rawCpf, type === "fisica" ? rawCpfCnpj : "");
  const cnpjValue = coalesce(rawCnpj, type === "juridica" ? rawCpfCnpj : "");
  const formattedCpf = formatCpfCnpj(cpfValue);
  const formattedCnpj = formatCpfCnpj(cnpjValue);
  const baseDocument = coalesce(
    type === "juridica" ? cnpjValue : "",
    type === "fisica" ? cpfValue : "",
    combinedDocument
  );
  const formattedDocument = formatCpfCnpj(baseDocument);

  const rawAddress = customer.endereco;
  const addressPayload =
    rawAddress && typeof rawAddress === "object" && !Array.isArray(rawAddress)
      ? rawAddress
      : {
          logradouro: coalesce(rawAddress, customer.logradouro, customer.rua),
          numero: coalesce(customer.numero, customer.num),
          complemento: coalesce(customer.complemento),
          bairro: coalesce(customer.bairro),
          cidade: coalesce(customer.cidade),
        };
  const address = formatAddress(addressPayload);
  const cep = coalesce(customer.cep, rawAddress?.cep);

  const telefone1 = coalesce(
    customer.telefone1,
    customer.telefone,
    customer.telefonewhatsapp1
  );
  const telefone2 = coalesce(customer.telefone2, customer.telefonewhatsapp2);
  const celular = coalesce(
    customer.celular,
    customer.telefoneCelular,
    customer.celularwhatsapp
  );

  const whatsapp1 = parseBooleanFlag(
    coalesce(customer.whatsapp1, customer.telefonewhatsapp1)
  );
  const whatsapp2 = parseBooleanFlag(
    coalesce(customer.whatsapp2, customer.telefonewhatsapp2)
  );
  const whatsappCelular = parseBooleanFlag(
    coalesce(customer.whatsappCelular, customer.celularwhatsapp)
  );

  return {
    id: customer.idCliente ?? customer.id ?? null,
    type,
    nome: customer.nome ?? "",
    razaoSocial: customer.razaoSocial ?? "",
    nomeFantasia: customer.nomeFantasia ?? "",
    document: formattedDocument,
    cpf: formattedCpf,
    cnpj: formattedCnpj,
    telefone1,
    telefone2,
    celular,
    whatsapp1,
    whatsapp2,
    whatsappCelular,
    email: customer.email ?? "",
    address,
    cep,
    endereco: address.street,
    numero: address.number,
    complemento: address.complement,
    bairro: address.district,
    cidade: address.city,
  };
};

export const selectPreferredPhone = (customer = {}) => {
  const celular = coalesce(customer.celular, customer.celularwhatsapp);
  const telefone1 = coalesce(customer.telefone1, customer.telefonewhatsapp1);
  const telefone2 = coalesce(customer.telefone2, customer.telefonewhatsapp2);

  const whatsappCelular = parseBooleanFlag(
    coalesce(customer.whatsappCelular, customer.celularwhatsapp)
  );
  const whatsapp1 = parseBooleanFlag(
    coalesce(customer.whatsapp1, customer.telefonewhatsapp1)
  );
  const whatsapp2 = parseBooleanFlag(
    coalesce(customer.whatsapp2, customer.telefonewhatsapp2)
  );

  if (whatsappCelular && celular) {
    return celular;
  }

  if (whatsapp1 && telefone1) {
    return telefone1;
  }

  if (whatsapp2 && telefone2) {
    return telefone2;
  }

  return celular || telefone1 || telefone2 || "";
};

export const formatAddress = (address) => {
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

export const mapCustomerToCard = (customer = {}) => {
  const normalized = normalizeCustomerPayload(customer);
  const isJuridica = normalized.type === "juridica";

  const name = isJuridica
    ? normalized.razaoSocial || normalized.nomeFantasia || normalized.nome || ""
    : normalized.nome || normalized.razaoSocial || "";

  const document = isJuridica
    ? normalized.cnpj || normalized.document
    : normalized.cpf || normalized.document;

  return {
    id: normalized.id,
    type: normalized.type,
    name,
    document,
    phone: selectPreferredPhone(normalized),
    address: normalized.address,
  };
};

export const mapCustomersToCards = (customers = []) =>
  customers.map((customer) => mapCustomerToCard(customer));

export const mapCustomerForEdition = (customer = {}) => {
  const normalized = normalizeCustomerPayload(customer);

  return {
    id: normalized.id,
    type: normalized.type,
    nome: normalized.nome,
    razaoSocial: normalized.razaoSocial,
    nomeFantasia: normalized.nomeFantasia,
    cpf: normalized.cpf,
    cnpj: normalized.cnpj,
    telefone1: normalized.telefone1,
    telefone2: normalized.telefone2,
    celular: normalized.celular,
    whatsapp1: normalized.whatsapp1,
    whatsapp2: normalized.whatsapp2,
    whatsappCelular: normalized.whatsappCelular,
    email: normalized.email,
    cep: normalized.cep,
    endereco: normalized.endereco,
    numero: normalized.numero,
    complemento: normalized.complemento,
    bairro: normalized.bairro,
    cidade: normalized.cidade,
  };
};

export const mapCustomersForEdition = (customers = []) =>
  customers.map((customer) => mapCustomerForEdition(customer));

export const getCustomerById = async (authorizedRequest, id) => {
  const payload = await getCustomerByIdApi(authorizedRequest, id);
  const normalized = normalizeCustomerPayload(payload);

  return {
    customer: normalized,
    form: mapCustomerForEdition(payload),
  };
};
