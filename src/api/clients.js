const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    console.warn("Resposta sem JSON válido ao carregar clientes:", error);
    return null;
  }
};

export const fetchCustomers = async (authorizedRequest) => {
  const response = await authorizedRequest("/customers?razaoSocial=");
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Erro ao carregar clientes");
  }

  if (!Array.isArray(payload)) {
    throw new Error("Resposta inválida ao carregar clientes");
  }

  return payload;
};

const resolveCustomerErrorMessage = (status, payload) => {
  switch (status) {
    case 401:
    case 403:
      return "Você não tem permissão para acessar este cliente";
    case 404:
      return "Cliente não encontrado";
    case 500:
      return "Erro interno ao carregar dados do cliente";
    default:
      return payload?.error ?? "Erro ao carregar dados do cliente";
  }
};

export const getCustomerById = async (authorizedRequest, id) => {
  const response = await authorizedRequest(
    `/customers/${encodeURIComponent(id)}`
  );
  const payload = await parseJson(response);

  if (!response.ok) {
    const error = new Error(resolveCustomerErrorMessage(response.status, payload));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Resposta inválida ao carregar dados do cliente");
  }

  return payload;
};
