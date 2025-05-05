import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

import DashboardLayout from "./features/components/DashboardLayout";
import CreateCharacterPage from "./features/pages/CreateCharacterPage";
import DashboardPage from "./features/pages/DashboardPage";

export default function App() {
  const { user, signOut } = useAuthenticator();

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
