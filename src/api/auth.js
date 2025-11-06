import { buildApiUrl } from "../config/api";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    console.warn("Resposta sem JSON válido:", error);
    return null;
  }
};

export const login = async (username, password) => {
  const response = await fetch(buildApiUrl("/users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: username, password }),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Erro ao fazer login");
  }

  if (!payload?.token) {
    throw new Error("Token não recebido");
  }

  return payload;
};

export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token ausente");
  }

  const response = await fetch(buildApiUrl("/users/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Não foi possível renovar a sessão");
  }

  if (!payload?.token) {
    throw new Error("Resposta inválida do servidor");
  }

  return payload;
};

export const fetchUserDetails = async (token) => {
  if (!token) {
    throw new Error("Token ausente");
  }

  const response = await fetch(buildApiUrl("/users"), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const error = new Error(
      payload?.error ?? "Erro ao carregar dados do usuário"
    );
    error.status = response.status;
    throw error;
  }

  return payload?.user ?? null;
};
