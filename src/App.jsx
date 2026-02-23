import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, Suspense, lazy } from 'react';
import { ReservasProvider } from "./context/ReservasContext";
import { NotificationProvider } from "./context/NotificationContext";
import { RestaurantProvider } from "./context/RestaurantContext";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import FloatingActionButton from "./components/common/FloatingActionButton";
import ProtectedRoute from "./routes/ProtectedRoute";

// Home NO es lazy para que el LCP se renderice inmediatamente
import Home from "./pages/Home";

// Lazy loading de otras páginas para code splitting
const CrearReserva = lazy(() => import("./pages/CrearReserva"));
const VerReservas = lazy(() => import("./pages/VerReservas"));
const VerWaitlist = lazy(() => import("./pages/VerWaitlist"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const ConfirmarReserva = lazy(() => import("./pages/ConfirmarReserva"));
const CancelarReserva = lazy(() => import("./pages/CancelarReserva"));

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="app-bg min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mb-4"></div>
      <p className="text-white/60 text-sm">Cargando...</p>
    </div>
  </div>
);

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="w-full relative z-10" style={{ marginTop: '64px' }}>
        <div className="p-0">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/crear-reserva" element={<ProtectedRoute><CrearReserva /></ProtectedRoute>} />
              <Route path="/reservas" element={<ProtectedRoute><VerReservas /></ProtectedRoute>} />
              <Route path="/waitlist" element={<ProtectedRoute><VerWaitlist /></ProtectedRoute>} />
              <Route path="/configuracion" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <FloatingActionButton />
    </>
  );
}

export default function App() {
  return (
    <div className="bg-black text-white" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
      <Router>
        <ReservasProvider>
          <NotificationProvider>
            <RestaurantProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/login" element={<div className="h-full"><Login /></div>} />
                  <Route path="/confirmar" element={<ConfirmarReserva />} />
                  <Route path="/cancelar" element={<CancelarReserva />} />
                  <Route path="/*" element={<AppContent />} />
                </Routes>
              </Suspense>
            </RestaurantProvider>
          </NotificationProvider>
        </ReservasProvider>
      </Router>
    </div>
  );
}
