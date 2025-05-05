import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserSidebarProps {
    user: { username?: string; userId?: string };
    signOut: () => void;
    isOpen: boolean;
    toggleOpen: () => void;
    palette: {
        sidebarBg: string;
        borderAccent: string;
        textPrimary: string;
        signOutBg: string;
        signOutHover: string;
        signOutText: string;
    };
}

const UserSidebar: React.FC<UserSidebarProps> = ({
    user,
    signOut,
    isOpen,
    toggleOpen,
    palette,
}) => (
    <div
        className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
    >
        <button
            className="absolute top-0 -left-10 z-50 p-4 rounded-l-full"
            style={{ backgroundColor: "transparent", color: palette.textPrimary }}
            onClick={toggleOpen}
        >
            {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        <aside
            className="w-64 h-full shadow-xl border-l p-6 flex flex-col gap-4"
            style={{
                backgroundColor: palette.sidebarBg,
                borderColor: palette.borderAccent,
                color: palette.textPrimary,
            }}
        >
            <h2 className="text-xl font-bold" style={{color: palette.textPrimary}}>User Profile</h2>
            <div className="text-sm">
                <p>
                    <strong>Username:</strong> {user?.userId}
                </p>
                <p>
                    <strong>Email:</strong> {user?.userId}
                </p>
            </div>

            <hr className="my-2" style={{ borderColor: palette.borderAccent }} />

            <button
                onClick={signOut}
                className="rounded px-4 py-2 text-sm font-semibold"
                style={{
                    backgroundColor: palette.signOutBg,
                    color: palette.signOutText,
                }}
                onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = palette.signOutHover)
                }
                onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = palette.signOutBg)
                }
            >
                Sign Out
            </button>
        </aside>
    </div>
);

export default UserSidebar;
