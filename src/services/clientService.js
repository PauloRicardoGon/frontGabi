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

export const selectPreferredPhone = (customer = {}) =>
  customer.celularwhatsapp ||
  customer.telefonewhatsapp1 ||
  customer.telefonewhatsapp2 ||
  customer.telefone1 ||
  customer.telefone2 ||
  "";

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

export const mapCustomerToCard = (customer = {}) => ({
  id: customer.idCliente,
  name: customer.razaoSocial ?? "",
  document: formatCpfCnpj(customer.cpfCnpj ?? ""),
  phone: selectPreferredPhone(customer),
  address: formatAddress(customer.endereco),
});

export const mapCustomersToCards = (customers = []) =>
  customers.map((customer) => mapCustomerToCard(customer));

export const mapCustomerForEdition = (customer = {}) => {
  const { idCliente: _idCliente, ...rest } = customer;
  return { ...rest };
};

export const mapCustomersForEdition = (customers = []) =>
  customers.map((customer) => mapCustomerForEdition(customer));
