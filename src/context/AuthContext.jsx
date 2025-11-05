/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../config/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

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
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
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
    const tokenToRefresh = refreshToken ?? localStorage.getItem("refreshToken");

    if (!tokenToRefresh) {
      throw new Error("Refresh token ausente");
    }

    const response = await fetch(buildApiUrl("/users/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: tokenToRefresh }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      clearSession();
      throw new Error(payload?.error ?? "Não foi possível renovar a sessão");
    }

    if (!payload?.token) {
      clearSession();
      throw new Error("Resposta inválida do servidor");
    }

    persistToken(payload.token);
    if (payload.refreshToken) {
      persistRefreshToken(payload.refreshToken);
    }

    if (payload.user) {
      persistUser(payload.user);
    }

    return payload.token;
  }, [clearSession, persistRefreshToken, persistToken, persistUser, refreshToken]);

  const authorizedRequest = useCallback(
    async (endpoint, options = {}) => {
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const attempt = async (tokenToUse) =>
        fetch(buildApiUrl(endpoint), {
          ...options,
          headers: {
            Accept: "application/json",
            ...(options.headers || {}),
            Authorization: `Bearer ${tokenToUse}`,
          },
        });

      let response = await attempt(token);

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

      const attempt = async (authToken) => {
        const response = await fetch(buildApiUrl("/users/user-details"), {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const error = new Error(payload?.error ?? "Erro ao carregar dados do usuário");
          error.status = response.status;
          throw error;
        }

        if (payload?.user) {
          persistUser(payload.user);
          return payload.user;
        }

        return null;
      };

      try {
        return await attempt(tokenToUse);
      } catch (error) {
        if (error.status === 401 && refreshToken) {
          const newToken = await refreshTokens();
          return attempt(newToken);
        }

        throw error;
      }
    },
    [persistUser, refreshToken, refreshTokens, token]
  );

  const login = useCallback(
    async (username, password) => {
      const response = await fetch(buildApiUrl("/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Erro ao fazer login");
      }

      if (!payload?.token) {
        throw new Error("Token não recebido");
      }

      persistToken(payload.token);
      if (payload.refreshToken) {
        persistRefreshToken(payload.refreshToken);
      }

      if (payload.user) {
        persistUser(payload.user);
      } else {
        persistUser({ login: username });
      }

      try {
        await fetchUserDetails(payload.token);
      } catch (error) {
        console.warn("Não foi possível carregar os detalhes do usuário:", error);
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
        console.error("Sessão inválida ao restaurar dados do usuário:", error);

        const availableRefreshToken = refreshToken ?? localStorage.getItem("refreshToken");

        if (error?.status === 401) {
          if (availableRefreshToken) {
            try {
              const newToken = await refreshTokens();
              await fetchUserDetails(newToken);
              return;
            } catch (refreshError) {
              console.error("Não foi possível renovar a sessão:", refreshError);
              clearSession();
            }
          } else {
            console.warn(
              "Refresh token indisponível durante a restauração da sessão; limpando sessão."
            );
            clearSession();
          }
        } else {
          console.warn(
            "Mantendo a sessão ativa apesar do erro, pois a falha não foi de autenticação."
          );
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
