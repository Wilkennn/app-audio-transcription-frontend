import { PawPrint } from "lucide-react";

export const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "COMPLETED": return <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-orange-100 text-orange-700 flex items-center gap-1.5"><PawPrint size={14} /> Pronto</span>;
    case "PROCESSING": return <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-neutral-100 text-neutral-600 animate-pulse">Ronronando...</span>;
    case "PENDING": return <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-neutral-100 text-neutral-400">Na caixinha...</span>;
    case "ERROR": return <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-red-100 text-red-600">Bola de pelo (Erro)</span>;
    default: return null;
  }
};