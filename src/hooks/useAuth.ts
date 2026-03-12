const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    let currentToken = accessToken;
    const headers = new Headers(options.headers || {});
    if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`);

    let response = await fetch(`http://localhost:3000${endpoint}`, { ...options, headers });

    if (response.status === 401) {
      try {
        const refreshResponse = await fetch("http://localhost:3000/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          currentToken = data.accessToken;
          setAccessToken(currentToken);
          headers.set("Authorization", `Bearer ${currentToken}`);
          response = await fetch(`http://localhost:3000${endpoint}`, { ...options, headers });
        } else {
          setAccessToken(null);
          throw new Error("Sessão expirada");
        }
      } catch (error) {
        setAccessToken(null);
        throw error;
      }
    }
    return response;
  }, [accessToken]);

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/refresh", { method: "POST", credentials: "include" });
        if (res.ok) setAccessToken((await res.json()).accessToken);
      } catch (e) {
        // Sem sessão
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

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
