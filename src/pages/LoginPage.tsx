import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cat, Sparkles, Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { setAccessToken, accessToken, apiFetch } = useAuth();
  const navigate = useNavigate();

  // Estados do formulário e interface
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    const endpoint = isRegister ? "/auth/register" : "/auth/login";

    try {
      const res = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Miau! Verifique seus dados.");
      }

      if (isRegister) {
        setIsRegister(false);
        setFormData({ name: "", email: "", password: "" });
        alert("Conta criada com sucesso! Agora é só entrar.");
      } else {
        setAccessToken(data.accessToken);
      }
    } catch (err: any) {
      setError(
        err.message === "Failed to fetch"
          ? "Não consegui conectar ao servidor BonneScribe."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 animate-in fade-in zoom-in duration-500">
        
        {/* Header da Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 mb-5 shadow-inner rotate-3">
            <Cat size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">BonneScription</h2>
          <p className="text-neutral-400 text-sm mt-2 font-medium flex items-center gap-1.5">
            Sua inteligência auditiva <Sparkles size={14} className="text-orange-300" />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {/* Campo Nome (Apenas no Registro) */}
          {isRegister && (
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                required
                name="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-[#F8F8F8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-neutral-800 placeholder:text-neutral-400 font-medium transition-all border border-transparent focus:bg-white focus:border-neutral-200"
              />
            </div>
          )}

          {/* Campo E-mail */}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              required
              name="email"
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-5 py-4 bg-[#F8F8F8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-neutral-800 placeholder:text-neutral-400 font-medium transition-all border border-transparent focus:bg-white focus:border-neutral-200"
            />
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              required
              name="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-5 py-4 bg-[#F8F8F8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-neutral-800 placeholder:text-neutral-400 font-medium transition-all border border-transparent focus:bg-white focus:border-neutral-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 mt-4 bg-neutral-900 text-white rounded-[1.5rem] font-bold text-sm tracking-wide hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-neutral-200"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Aguarde um miau...</span>
              </>
            ) : (
              <span>{isRegister ? "Criar Minha Conta" : "Entrar no BonneScription"}</span>
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            disabled={isLoading}
            className="text-sm text-neutral-400 font-bold hover:text-neutral-900 transition-colors"
          >
            {isRegister
              ? "Já tem uma conta? Faça login aqui"
              : "Ainda não tem conta? Clique para criar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;