/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, refreshTokens as refreshTokensApi } from "../api/auth";
import { buildApiUrl } from "../config/api";

export const AuthContext = createContext();

const getStoredObject = (key) => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.error(`Não foi possível ler o valor salvo para ${key}:`, error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredObject("user"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((value) => {
    setUser(value);

    if (value) {
      localStorage.setItem("user", JSON.stringify(value));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const persistToken = useCallback((value) => {
    setToken(value);

    if (value) {
      localStorage.setItem("token", value);
    } else {
      localStorage.removeItem("token");
    }
  }, []);

  const persistRefreshToken = useCallback((value) => {
    setRefreshToken(value);

    if (value) {
      localStorage.setItem("refreshToken", value);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, []);

  const clearSession = useCallback(() => {
    persistUser(null);
    persistToken(null);
    persistRefreshToken(null);
  }, [persistRefreshToken, persistToken, persistUser]);

  const logout = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

  const refreshTokens = useCallback(async () => {
    if (!refreshToken) {
      throw new Error("Refresh token ausente");
    }

    try {
      const payload = await refreshTokensApi(refreshToken);
      persistToken(payload.token);

      const nextRefreshToken =
        typeof payload.refreshToken === "string"
          ? payload.refreshToken
          : refreshToken ?? null;

      persistRefreshToken(nextRefreshToken);

      if (payload.user) {
        persistUser(payload.user);
      }

      return payload.token;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, [
    clearSession,
    persistRefreshToken,
    persistToken,
    persistUser,
    refreshToken,
  ]);

  const authorizedRequest = useCallback(
    async (endpoint, options = {}, tokenOverride) => {
      const tokenToUse = tokenOverride ?? token;

      if (!tokenToUse) {
        throw new Error("Usuário não autenticado");
      }

      const attempt = async (tokenCandidate) => {
        const providedHeaders = options.headers ?? {};
        let headers;

        if (providedHeaders instanceof Headers) {
          headers = Object.fromEntries(providedHeaders.entries());
        } else if (Array.isArray(providedHeaders)) {
          headers = Object.fromEntries(providedHeaders);
        } else {
          headers = { ...providedHeaders };
        }

        if (!("Accept" in headers) && !("accept" in headers)) {
          headers.Accept = "application/json";
        }

        headers.Authorization = `Bearer ${tokenCandidate}`;

        return fetch(buildApiUrl(endpoint), {
          ...options,
          headers,
        });
      };

      let response = await attempt(tokenToUse);

      if (response.status === 401 && refreshToken) {
        try {
          const freshToken = await refreshTokens();
          response = await attempt(freshToken);
        } catch (error) {
          clearSession();
          throw error;
        }
      }

      if (response.status === 401) {
        clearSession();
        throw new Error("Não autorizado");
      }

      return response;
    },
    [clearSession, refreshToken, refreshTokens, token]
  );

  const fetchUserDetails = useCallback(
    async (tokenOverride) => {
      const tokenToUse = tokenOverride ?? token;

      if (!tokenToUse) {
        throw new Error("Token ausente");
      }

      const response = await authorizedRequest(
        "/users",
        {
          headers: {
            Accept: "application/json",
          },
        },
        tokenToUse
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(
          payload?.error ?? "Erro ao carregar dados do usuário"
        );
        error.status = response.status;
        throw error;
      }

      const userDetails = payload?.user ?? null;

      if (userDetails) {
        persistUser(userDetails);
      }

      return userDetails;
    },
    [authorizedRequest, persistUser, token]
  );

  const login = useCallback(
    async (username, password) => {
      const payload = await loginApi(username, password);
      persistToken(payload.token);
      persistRefreshToken(payload.refreshToken ?? null);

      if (payload.user) {
        persistUser(payload.user);
      } else {
        persistUser({ login: username });
      }

      try {
        await fetchUserDetails(payload.token);
      } catch (error) {
        console.warn(
          "Não foi possível carregar os detalhes do usuário:",
          error
        );
      }

      navigate("/dashboard");
    },
    [fetchUserDetails, navigate, persistRefreshToken, persistToken, persistUser]
  );

  const updatePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      const response = await authorizedRequest("/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Não foi possível atualizar a senha");
      }

      if (payload?.user) {
        persistUser(payload.user);
      }

      return payload;
    },
    [authorizedRequest, persistUser]
  );

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchUserDetails(token);
      } catch (error) {
        console.error("Sessão inválida, tentando renovar o token:", error);

        if (refreshToken) {
          try {
            const newToken = await refreshTokens();
            await fetchUserDetails(newToken);
          } catch (refreshError) {
            console.error("Não foi possível renovar a sessão:", refreshError);
            clearSession();
          }
        } else {
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [clearSession, fetchUserDetails, refreshToken, refreshTokens, token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        logout,
        loading,
        refreshTokens,
        authorizedRequest,
        updatePassword,
        fetchUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
