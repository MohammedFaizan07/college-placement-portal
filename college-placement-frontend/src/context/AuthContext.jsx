import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  clearStoredAuth,
  readStoredAuth,
  setUnauthorizedHandler,
  writeStoredAuth,
} from "@/api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUserState] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from localStorage on first render
  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setToken(stored.token);
      setRole(stored.role);
      setUserState(stored.user);
    }
    setIsReady(true);
  }, []);

  const login = useCallback((nextToken, nextRole, nextUser) => {
    writeStoredAuth({ token: nextToken, role: nextRole, user: nextUser });
    setToken(nextToken);
    setRole(nextRole);
    setUserState(nextUser);
  }, []);

  // Update user in state and localStorage (used after profile save)
  const setUser = useCallback((nextUser) => {
    setUserState(nextUser);
    const stored = readStoredAuth();
    if (stored) writeStoredAuth({ ...stored, user: nextUser });
  }, []);

  const logout = useCallback(
    (message) => {
      clearStoredAuth();
      setToken(null);
      setRole(null);
      setUserState(null);
      if (message) toast.error(message);
      navigate("/login", { replace: true });
    },
    [navigate]
  );

  // Let the Axios interceptor trigger logout when a token expires
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearStoredAuth();
      setToken(null);
      setRole(null);
      setUserState(null);
      toast.error("Your session has expired. Please login again.");
      navigate("/login", { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const value = useMemo(
    () => ({
      token,
      role,
      user,
      isReady,
      isAuthenticated: !!token,
      login,
      setUser,
      logout,
    }),
    [token, role, user, isReady, login, setUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
