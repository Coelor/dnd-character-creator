import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import CharacterPage from "./features/pages/CharacterPage";
import CreateCharacterPage from "./features/pages/CreateCharacterPage";
import UserSidebar from "./features/components/UserSiderbar";

// 11-step palette + pure white
export const PALETTE = {
  gradientFrom:   "#0077B6", // strong blue
  gradientVia:    "#0096C7", // medium cyan-blue
  gradientTo:     "#48CAE4", // light cyan

  headerBg:       "#03045E", // darkest navy
  sidebarBg:      "#023E8A", // dark blue
  textPrimary:    "#CAF0F8", // very pale cyan
  borderAccent:   "#0096C7", // medium cyan-blue

  signOutBg:      "#ADE8F4", // pale cyan
  signOutHover:   "#90E0EF", // lighter cyan
  signOutText:    "#03045E", // darkest navy

  white:          "#FFFFFF", // pure white
};

export default function App() {
  const { user, signOut } = useAuthenticator();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <main
        className="relative min-h-screen w-full pt-20 p-4"
        style={{
          background: `linear-gradient(
            to bottom,
            ${PALETTE.gradientFrom},
            ${PALETTE.gradientVia},
            ${PALETTE.gradientTo}
          )`,
        }}
      >
        {/* Global Header */}
        <header
          className="fixed top-0 left-0 w-full z-30 py-4 px-6 shadow-md"
          style={{ backgroundColor: PALETTE.headerBg }}
        >
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <h1
              className="text-2xl font-bold"
              style={{ color: PALETTE.textPrimary }}
            >
              DnD Character Manager
            </h1>
          </div>
        </header>

        {/* Extracted Sidebar */}
        <UserSidebar
          user={user}
          signOut={signOut}
          isOpen={isSidebarOpen}
          toggleOpen={() => setSidebarOpen(o => !o)}
          palette={PALETTE}
        />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<CharacterPage />} />
          <Route path="/create" element={<CreateCharacterPage />} />
        </Routes>
      </main>
    </Router>
  );
}
