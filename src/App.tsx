import { useAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CharacterPage from "./features/pages/CharacterPage";
import CreateCharacterPage from "./features/pages/CreateCharacterPage"; // We'll create this

export default function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <Router>
      <main className="min-h-screen w-full bg-gradient-to-b from-[#a68b5b] via-[#f3e9d2] to-[#ffffff] p-4">
        {/* Ribbon-like user bar */}
        <header className="absolute top-0 right-0 p-4 z-50">
          <div className="border-[#7c5e3c] rounded-bl-2xl shadow-xl px-6 py-3 flex items-center gap-4 text-[#4b3b28]">
            <button className="hover:underline font-bold text-lg">
              {user?.signInDetails?.loginId}
            </button>
            <span className="text-[#7c5e3c]">|</span>
            <button
              onClick={signOut}
              className="hover:text-red-700 text-sm underline underline-offset-2"
            >
              Sign out
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<CharacterPage />} />
          <Route path="/create" element={<CreateCharacterPage />} />
        </Routes>
      </main>
    </Router>
  );
}
