import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Auth } from "./components/Auth";
import { store } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearch } from './components/layout/GlobalSearch';
import CreateCharacterPage from "./features/pages/CreateCharacterPage";
import DashboardPage from "./features/pages/DashboardPage";
import CharactersListPage from "./features/pages/CharactersListPage";
import CampaignsPage from "./features/pages/CampaignsPage";
import SessionsPage from "./features/pages/SessionsPage";

function AppContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg)">
        <div className="text-lg" style={{ color: 'var(--color-text)' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-(--color-bg)">
        <Sidebar user={user} signOut={signOut} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="D&D Character & Campaign Manager" />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/create" element={<CreateCharacterPage />} />
                <Route path="/characters" element={<CharactersListPage />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/settings" element={<div className="text-center py-12">Settings (Coming Soon)</div>} />
              </Routes>
            </div>
          </main>
        </div>
        
        <GlobalSearch />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}
