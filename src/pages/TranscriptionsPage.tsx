import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Cat, Trash2, Calendar, FileAudio, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Transcription } from "../types";
import { StatusBadge } from "../components/StatusBadge";

const TranscriptionsPage = () => {
  const { apiFetch } = useAuth();
  const [list, setList] = useState<Transcription[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/transcriptions");
      if (res.ok) setList(await res.json());
    } catch (e) { console.error("Erro ao carregar lista:", e); }
  }, [apiFetch]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apagar este registro? O gato não vai gostar...")) return;
    try {
      const res = await apiFetch(`/transcriptions/${id}`, { method: "DELETE" });
      if (res.ok) setList(list.filter(t => t.id !== id));
    } catch (e) { console.error("Erro ao deletar:", e); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">Seus Áudios</h2>
          <p className="text-neutral-400 font-medium mt-1">Acompanhe suas transcrições e insights</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-neutral-100 p-20 text-center flex flex-col items-center text-neutral-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Cat size={48} strokeWidth={1} className="mb-4 opacity-50" />
            <p className="font-medium">Nenhum áudio por aqui. Que silêncio!</p>
            <Link to="/upload" className="mt-6 px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-colors">
              Fazer primeiro upload
            </Link>
          </div>
        ) : (
          list.map((t) => (
            <div 
              key={t.id} 
              className="group bg-white rounded-3xl p-5 md:p-6 border border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-neutral-200 transition-all"
            >
              <div className="flex items-center gap-5 overflow-hidden">
                <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-[#FAFAFA] rounded-2xl items-center justify-center text-neutral-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors">
                  <FileAudio size={24} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-neutral-800 text-lg truncate mb-1">{t.originalName}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <Calendar size={14} />
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t border-neutral-50 md:border-0 pt-4 md:pt-0">
                <StatusBadge status={t.status} />
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(t.id)} className="p-3 text-neutral-400 hover:text-red-500 bg-neutral-50 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                  <Link to={`/transcription/${t.id}`} className="flex items-center gap-2 p-3 md:px-5 md:py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all font-bold text-sm">
                    <span className="hidden md:inline">Abrir</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TranscriptionsPage;