import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Download, Loader2, Cat, PawPrint, Lightbulb, 
  BookOpen, List, Quote, Youtube, PlayCircle, Search, HelpCircle, 
  ExternalLink, FileText, 
  FileAudio
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Transcription } from "../types";

const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    COMPLETED: { icon: <PawPrint size={14} />, text: "Pronto", class: "bg-orange-100 text-orange-700" },
    PROCESSING: { icon: null, text: "Ronronando...", class: "bg-neutral-100 text-neutral-600 animate-pulse" },
    PENDING: { icon: null, text: "Na Fila", class: "bg-neutral-50 text-neutral-400" },
    ERROR: { icon: null, text: "Erro", class: "bg-red-100 text-red-600" }
  };
  const config = configs[status as keyof typeof configs] || configs.PENDING;
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 ${config.class}`}>
      {config.icon} {config.text}
    </span>
  );
};

const DetailPage = () => {
  const { id } = useParams();
  const { apiFetch } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Transcription | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    try {
      const res = await apiFetch(`/transcriptions/${id}`);
      if (!res.ok) return;
      const json = await res.json();
      setData(json);

      if (json.status === "PENDING" || json.status === "PROCESSING") {
        setTimeout(loadDetail, 3000);
      } else if (json.status === "COMPLETED" && !audioUrl) {
        const audioRes = await apiFetch(`/audio/${id}`);
        if (audioRes.ok) {
          const blob = await audioRes.blob();
          setAudioUrl(URL.createObjectURL(blob));
        }
      }
    } catch (e) { console.error(e); }
  }, [id, apiFetch, audioUrl]);

  useEffect(() => { loadDetail(); }, [loadDetail]);

  const exportTxt = () => {
    if (!data?.content) return;
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([data.content], { type: 'text/plain;charset=utf-8' }));
    el.download = `${data.originalName.split('.')[0]}_bonnescribe.txt`;
    el.click();
  };

  if (!data) return <div className="h-full flex items-center justify-center text-neutral-400"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-neutral-400 hover:text-neutral-900 flex items-center gap-2 font-bold text-sm transition-colors bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-neutral-100">
          <ArrowLeft size={18} /> Voltar
        </button>
        <StatusBadge status={data.status} />
      </div>

      <h2 className="text-4xl font-black tracking-tight text-neutral-900">{data.originalName}</h2>

      {data.status !== "COMPLETED" ? (
        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-neutral-100 text-center">
            <div className="flex flex-col items-center">
                <Cat size={64} className="animate-bounce mb-6 text-orange-200" />
                <h3 className="text-xl font-bold text-neutral-700">O gato está trabalhando...</h3>
                <p className="text-neutral-400 font-medium mt-2">Estamos ouvindo seu áudio e preparando o dossiê completo.</p>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* DOSSIÊ DA IA */}
          {data.aiInsights && (
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-neutral-100 space-y-10">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 text-orange-600 p-3.5 rounded-2xl shadow-inner"><Lightbulb size={28} strokeWidth={2.5} /></div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900">Dossiê de Estudos</h3>
                  <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                </div>
              </div>

              {/* Card de Resumo */}
              <section className="bg-orange-50/40 p-8 rounded-[2.5rem] border border-orange-100/50">
                <h4 className="flex items-center gap-2 font-black text-orange-800 mb-4"><BookOpen size={20} /> RESUMO EXECUTIVO</h4>
                <p className="text-neutral-700 leading-relaxed font-semibold text-lg">{data.aiInsights.resumo}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tópicos */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                  <h4 className="flex items-center gap-2 font-black text-neutral-900 mb-5 text-sm uppercase tracking-widest"><List size={18} className="text-blue-500" /> Tópicos</h4>
                  <ul className="space-y-4">
                    {data.aiInsights.topicos_chave.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm font-bold text-neutral-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Frases */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                  <h4 className="flex items-center gap-2 font-black text-neutral-900 mb-5 text-sm uppercase tracking-widest"><Quote size={18} className="text-purple-500" /> Frases Relevantes</h4>
                  <div className="space-y-5">
                    {data.aiInsights.frases_destaque.map((f, i) => (
                      <blockquote key={i} className="text-sm font-bold text-neutral-500 border-l-4 border-purple-100 pl-4 italic">"{f}"</blockquote>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links de Mídia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-black text-red-600 text-xs uppercase tracking-widest ml-4"><Youtube size={16} /> Aprofundamento em Vídeo</h4>
                  {data.aiInsights.videos_recomendados.map((v, i) => (
                    <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.termoDeBusca)}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-5 bg-neutral-50 rounded-[1.5rem] hover:bg-red-50 group transition-all">
                      <PlayCircle className="text-neutral-300 group-hover:text-red-500 transition-colors" size={24} />
                      <span className="font-bold text-sm text-neutral-700 group-hover:text-red-700">{v.titulo}</span>
                    </a>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-black text-blue-600 text-xs uppercase tracking-widest ml-4"><Search size={16} /> Artigos e Pesquisa</h4>
                  {data.aiInsights.artigos_recomendados.map((a, i) => (
                    <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(a.termoDeBusca)}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-5 bg-neutral-50 rounded-[1.5rem] hover:bg-blue-50 group transition-all">
                      <ExternalLink className="text-neutral-300 group-hover:text-blue-500 transition-colors" size={24} />
                      <span className="font-bold text-sm text-neutral-700 group-hover:text-blue-700">{a.titulo}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quiz Interativo */}
              <div className="pt-6 border-t border-neutral-100">
                  <h4 className="flex items-center gap-2 font-black text-green-700 text-xs uppercase tracking-widest mb-6 ml-4"><HelpCircle size={16} /> Teste seu Conhecimento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.aiInsights.perguntas_treino.map((q, i) => (
                      <div key={i} className="group relative bg-neutral-50 p-6 rounded-[2rem] border border-transparent hover:border-green-200 transition-all cursor-help overflow-hidden h-40">
                        <p className="font-bold text-neutral-800 text-sm">{q.pergunta}</p>
                        <div className="absolute inset-0 bg-green-600 p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                          <p className="text-white font-bold text-sm text-center">{q.resposta_esperada}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          )}

          {/* Player e Transcrição Original */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-neutral-100 space-y-8">
            {audioUrl && (
              <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100">
                <div className="flex items-center justify-between mb-4 px-2">
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Player de Áudio</p>
                    <FileAudio size={18} className="text-neutral-300" />
                </div>
                <audio controls className="w-full h-12 outline-none" src={audioUrl}></audio>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Transcrição Completa</p>
                <button onClick={exportTxt} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl transition-colors">
                  <Download size={14} /> Exportar TXT
                </button>
              </div>
              <div className="bg-[#FAFAFA] p-8 rounded-[2rem] min-h-[200px] max-h-[500px] overflow-y-auto border border-neutral-50">
                <p className="text-neutral-500 font-medium leading-relaxed whitespace-pre-wrap text-[15px]">
                  {data.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;