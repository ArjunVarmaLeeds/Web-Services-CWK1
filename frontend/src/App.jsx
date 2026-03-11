import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PlayerAnalytics } from "./pages/PlayerAnalytics";
import { DeckIntelligence } from "./pages/DeckIntelligence";
import { Comparison } from "./pages/Comparison";
import { AdminUsers } from "./pages/AdminUsers";
import { PlayerSearch } from "./pages/PlayerSearch";
import { NotFound } from "./pages/NotFound";

const Private = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center">Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="d-flex bg-primary" style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-grow-1">
        <Topbar />
        <main className={collapsed ? "main-content collapsed" : "main-content"}>{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <Private>
                <Layout>
                  <Routes>
                        <Route path="" element={<Dashboard />} />
                    <Route path="player" element={<PlayerSearch />} />
                    <Route path="player/:tag" element={<PlayerAnalytics />} />
                    <Route path="deck/:tag" element={<DeckIntelligence />} />
                    <Route path="compare" element={<Comparison />} />
                    <Route path="admin/users" element={<AdminUsers />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Private>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
