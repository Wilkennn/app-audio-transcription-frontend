import { Link, Outlet, useLocation } from "react-router-dom";
import { Cat, FileAudio, UploadCloud, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all 
    ${location.pathname === path ? "bg-neutral-900 text-white shadow-lg shadow-neutral-200" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"}
  `;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans">
      <aside className="w-[280px] p-6 flex flex-col hidden md:flex border-r border-neutral-100 bg-white">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
            <Cat size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-neutral-900">Bonnescription</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link to="/" className={navItemClass("/")}><FileAudio size={18} /> Seus Áudios</Link>
          <Link to="/upload" className={navItemClass("/upload")}><UploadCloud size={18} /> Transcrever</Link>
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-5 py-3.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-semibold text-sm transition-all mt-auto">
          <LogOut size={18} /> Sair
        </button>
      </aside>

      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;