import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  nationalId?: string | null;
  country: string;
  region?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  status?: string;
}

type AuthTab = "signin" | "register";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  authOpen: boolean;
  authTab: AuthTab;
}

const AuthContext = createContext<AuthContextType | null>(null);

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("signin");

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem("eaapa_session");
    if (!stored) { setIsLoading(false); return; }
    try {
      const { token: t, user: u } = JSON.parse(stored);
      if (!t || !u) { localStorage.removeItem("eaapa_session"); setIsLoading(false); return; }
      // Validate token with server
      fetch(`${API}/auth/session`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          setToken(t);
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem("eaapa_session");
        })
        .finally(() => setIsLoading(false));
    } catch {
      localStorage.removeItem("eaapa_session");
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("eaapa_session", JSON.stringify({ token: newToken, user: newUser }));
    setAuthOpen(false);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch(`${API}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* ignore */ }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("eaapa_session");
  }, [token]);

  const openAuth = useCallback((tab: AuthTab = "signin") => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!user,
      login, logout,
      openAuth, closeAuth,
      authOpen, authTab,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
