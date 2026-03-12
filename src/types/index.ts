export interface AIInsights {
  resumo: string;
  topicos_chave: string[];
  frases_destaque: string[];
  videos_recomendados: { titulo: string; termoDeBusca: string }[];
  artigos_recomendados: { titulo: string; termoDeBusca: string }[];
  perguntas_treino: { pergunta: string; resposta_esperada: string }[];
}

export interface Transcription {
  id: number;
  originalName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR";
  createdAt: string;
  content?: string;
  aiInsights?: AIInsights;
}

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
  logout: () => void;
  isLoadingSession: boolean;
}