import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CharacterPage from "./features/pages/CharacterPage";
import CreateCharacterPage from "./features/pages/CreateCharacterPage";

// 4-color mapping from your new green palette
const PALETTE = {
  gradientFrom: "#74C69D",   // mid-green
  gradientVia:  "#52B788",   // darker-green
  gradientTo:   "#081C15",   // almost-black

  headerBg:     "#081C15",   // almost-black
  sidebarBg:    "#1B4332",   // dark-grey-green
  textPrimary:  "#74C69D",   // mid-green
  borderAccent: "#52B788",   // darker-green

  signOutBg:    "#74C69D",   // mid-green
  signOutHover: "#52B788",   // darker-green
  signOutText:  "#081C15",   // almost-black
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
        {/* Header */}
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

        {/* Sidebar + Toggle */}
        <div
          className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-0 -left-10 z-50 p-4 rounded-l-full"
            style={{ backgroundColor: "transparent", color: PALETTE.textPrimary }}
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {isSidebarOpen ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>

          <aside
            className="w-64 h-full shadow-xl border-l p-6 flex flex-col gap-4"
            style={{
              backgroundColor: PALETTE.sidebarBg,
              borderColor: PALETTE.borderAccent,
              color: PALETTE.textPrimary,
            }}
          >
            <h2 className="text-xl font-bold">User Profile</h2>
            <div className="text-sm">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.attributes?.email}</p>
            </div>

            <hr className="my-2" style={{ borderColor: PALETTE.borderAccent }} />

            <button
              onClick={signOut}
              className="rounded px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: PALETTE.signOutBg,
                color: PALETTE.signOutText,
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PALETTE.signOutHover)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PALETTE.signOutBg)}
            >
              Sign Out
            </button>
          </aside>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<CharacterPage />} />
          <Route path="/create" element={<CreateCharacterPage />} />
        </Routes>
      </main>
    </Router>
  );
}
