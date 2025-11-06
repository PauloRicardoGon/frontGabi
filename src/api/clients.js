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
