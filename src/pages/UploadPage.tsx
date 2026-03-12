import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2, Cat } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const UploadPage = () => {
  const { apiFetch } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await apiFetch("/upload", { 
        method: "POST", 
        body: formData 
      });
      if (res.ok) navigate("/");
    } catch (e) {
      console.error("Erro no upload:", e);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tight text-neutral-900">Novo Áudio</h2>
        <p className="text-neutral-400 font-medium text-lg">
          Arraste seus arquivos para a caixa de areia.
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-neutral-100 transition-all">
        <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-neutral-200 border-dashed rounded-[2.5rem] cursor-pointer bg-[#FAFAFA] hover:bg-neutral-50 hover:border-orange-200 transition-all group">
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-orange-500 group-hover:scale-110 transition-all mb-4">
              <UploadCloud size={32} strokeWidth={1.5} />
            </div>
            <p className="font-bold text-neutral-600 text-lg mb-1">
              {files.length > 0 ? `${files.length} arquivos selecionados` : "Clique ou arraste os áudios"}
            </p>
            <p className="text-sm font-medium text-neutral-400">
              MP3, WAV, M4A ou MP4 (vídeo)
            </p>
          </div>
          <input 
            type="file" 
            multiple 
            className="hidden" 
            accept="audio/*, video/*" 
            onChange={(e) => setFiles(Array.from(e.target.files || []))} 
          />
        </label>

        {files.length > 0 && (
            <div className="mt-6 space-y-2 max-h-32 overflow-y-auto px-2">
                {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-neutral-500 bg-neutral-50 p-2 rounded-lg">
                        <Cat size={14} className="text-orange-400" /> {f.name}
                    </div>
                ))}
            </div>
        )}

        <button 
          onClick={handleUpload} 
          disabled={files.length === 0 || uploading} 
          className={`w-full py-5 mt-8 rounded-[1.5rem] font-bold tracking-wide transition-all flex justify-center items-center gap-3 text-lg ${
            files.length > 0 
            ? "bg-neutral-900 text-white shadow-xl hover:bg-neutral-800 hover:-translate-y-1 active:translate-y-0" 
            : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {uploading ? (
            <><Loader2 className="animate-spin" size={24} /> Processando Lote...</>
          ) : (
            `Iniciar Transcrição`
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;