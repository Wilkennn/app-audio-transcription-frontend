import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthContextType } from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true); 

  const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    let currentToken = accessToken;
    const headers = new Headers(options.headers || {});
    
    if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`);

    let response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", 
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          currentToken = data.accessToken;
          setAccessToken(currentToken);
          
          headers.set("Authorization", `Bearer ${currentToken}`);
          response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        } else {
          setAccessToken(null);
        }
      } catch (error) {
        setAccessToken(null);
      }
    }
    return response;
  }, [accessToken]);

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
    } finally {
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, { 
            method: "POST", 
            credentials: "include" 
        });
        if (res.ok) {
            const data = await res.json();
            setAccessToken(data.accessToken);
        } else {
            setAccessToken(null);
        }
      } catch (e) {
        setAccessToken(null);
      } finally {
        setIsLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, apiFetch, logout, isLoadingSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};