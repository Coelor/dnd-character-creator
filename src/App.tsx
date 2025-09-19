import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Auth } from "./components/Auth";

import DashboardLayout from "./features/components/DashboardLayout";
import CreateCharacterPage from "./features/pages/CreateCharacterPage";
import DashboardPage from "./features/pages/DashboardPage";

function AppContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <DashboardLayout user={user} signOut={signOut}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create" element={<CreateCharacterPage />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
