import React from "react";
import { Link } from "react-router-dom";

export const PALETTE = {
    gradientFrom: "var(--gradient-from)",
    gradientVia: "var(--gradient-via)",
    gradientTo: "var(--gradient-to)",
    sidebarBg: "var(--sidebar-bg)",
    borderAccent: "var(--border-accent)",
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    accentYellow: "var(--accent-yellow)",
    accentPurple: "var(--accent-purple)",
};

interface DashboardLayoutProps {
    user: {
      attributes?: {
        email?: string;
        picture?: string;
        [key: string]: unknown;
      };
    };
    signOut: () => void;
    children: React.ReactNode;
  }
  

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    user,
    signOut,
    children,
}) => (
    <div className="flex h-screen">
        {/* ── Left-Hand Sidebar ── */}
        <nav
            className="w-48 flex-shrink-1 p-8 flex flex-col justify-between"
            style={{
                backgroundColor: PALETTE.sidebarBg,
                borderRight: `2px solid ${PALETTE.borderAccent}`,
            }}
        >
            {/* Top Section: Avatar & Nav Links */}
            <div>
                <div className="flex items-center mb-6 space-x-3">
                    <img
                        src={user?.attributes?.picture || "/default-avatar.png"}
                        alt="avatar"
                        className="h-10 w-10 rounded-full border-2"
                        style={{ borderColor: PALETTE.textPrimary }}
                    />
                    <span
                        className="font-medium"
                        style={{ color: PALETTE.textPrimary }}
                    >
                        {user?.attributes?.email}
                    </span>
                </div>

                {/* Navigation Links */}
                <ul className="space-y-4">
                    <li>
                        <Link
                            to="/"
                            className="block"
                            style={{ color: PALETTE.textPrimary }}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/characters"
                            className="block"
                            style={{ color: PALETTE.textSecondary }}
                        >
                            My Characters
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/campaigns"
                            className="block"
                            style={{ color: PALETTE.textSecondary }}
                        >
                            My Campaigns
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/sessions"
                            className="block"
                            style={{ color: PALETTE.textSecondary }}
                        >
                            Sessions
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Bottom Section: Sign Out */}
            <button
                onClick={signOut}
                className="w-full px-3 py-2 rounded"
                style={{
                    backgroundColor: PALETTE.accentPurple,
                    color: PALETTE.accentYellow,
                }}
            >
                Sign Out
            </button>
        </nav>

        {/* ── Main Content ── */}
        <div
            className="flex-1 flex flex-col overflow-y-auto min-h-0"
            style={{
                background: `linear-gradient(
      to bottom,
      ${PALETTE.gradientFrom},
      ${PALETTE.gradientVia},
      ${PALETTE.gradientTo}
    )`,
            }}
        >
            {/* Top Title Bar */}
            <div className="px-4 sm:px-8 pt-6 pb-4">
                <h1 className="text-2xl font-semibold" style={{ color: PALETTE.accentYellow }}>
                    D&amp;D Character &amp; Campaign Manager
                </h1>
            </div>

            {/* Routed Views with Even Spacing + container */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4">
                <div className="max-w-7xl mx-auto space-y-12">
                    {children}</div>
            </div>
        </div>
    </div>
);

export default DashboardLayout;
