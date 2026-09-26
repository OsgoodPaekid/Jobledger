import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Clients from "./pages/Clients.jsx";
import ClientDetail from "./pages/ClientDetail.jsx";
import Middlemen from "./pages/Middlemen.jsx";
import MiddlemanDetail from "./pages/MiddlemanDetail.jsx";
import Payments from "./pages/Payments.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-ink text-paper sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="p-1 -ml-1">
            <Menu size={22} />
          </button>
          <span className="font-serif text-lg tracking-tight">JobLedger</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/middlemen" element={<Middlemen />} />
            <Route path="/middlemen/:id" element={<MiddlemanDetail />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
