import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, setAuthToken } from "../services/api";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("clash-intel-token", null);
  const [currentEmail, setCurrentEmail] = useLocalStorage("clash-intel-email", null);
  const [sessions, setSessions] = useLocalStorage("clash-intel-sessions", {});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        setLoading(true);
        const { data } = await auth.me();
        setUser(data);
        setError(null);
      } catch (err) {
        setUser(null);
        setToken(null);
        setCurrentEmail(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token, setToken, setCurrentEmail]);

  const login = async (email, password) => {
    const response = await auth.login(email, password);
    const tokenValue = response?.data?.token;
    if (!tokenValue) {
      throw new Error("Invalid login response");
    }

    setToken(tokenValue);
    setCurrentEmail(email);
    setSessions((prev) => ({ ...prev, [email]: tokenValue }));
    setAuthToken(tokenValue);

    const me = await auth.me();
    setUser(me.data);
    return me.data;
  };

  const switchAccount = async (email) => {
    const storedToken = sessions[email];
    if (!storedToken) {
      throw new Error("Account not found");
    }

    setToken(storedToken);
    setCurrentEmail(email);
    setAuthToken(storedToken);

    const me = await auth.me();
    setUser(me.data);
    return me.data;
  };

  const register = async (email, password) => {
    await auth.register(email, password);
    return await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setCurrentEmail(null);
    setUser(null);
    setError(null);
    setAuthToken(null);
  };

  const removeAccount = (email) => {
    setSessions((prev) => {
      const next = { ...prev };
      delete next[email];
      return next;
    });

    if (email === currentEmail) {
      logout();
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      currentEmail,
      sessions,
      login,
      logout,
      register,
      switchAccount,
      removeAccount,
      loading,
      error,
    }),
    [
      user,
      token,
      currentEmail,
      sessions,
      login,
      logout,
      register,
      switchAccount,
      removeAccount,
      loading,
      error,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
