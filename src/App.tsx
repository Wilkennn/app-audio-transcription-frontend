import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";
import DashboardLayout from "./layouts/DashboardLayout";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import TranscriptionsPage from "./pages/TranscriptionsPage";
import UploadPage from "./pages/UploadPage";


const ProtectedRoute = () => {
  const { accessToken, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="text-neutral-500 font-bold animate-pulse">Reconhecendo gatinho...</p>
      </div>
    );
  }

  return accessToken ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<TranscriptionsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/transcription/:id" element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}