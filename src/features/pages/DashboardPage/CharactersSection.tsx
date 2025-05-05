import React from "react";
import { Link } from "react-router-dom";
import { PALETTE } from "../../components/DashboardLayout";

export interface Character {
    name: string;
    hp: string;
    ac: number;
    init: number;
    level: number;
    img: string;
}

interface CharactersSectionProps {
    characters: Character[];
}

const CharactersSection: React.FC<CharactersSectionProps> = ({ characters }) => (
    <section className="space-y-6">
        {/* Section Header */}
        <div className="flex justify-between items-center">
            <h2
                className="text-2xl font-bold"
                style={{ color: PALETTE.accentYellow }}
            >
                Your Characters
            </h2>
            <Link
                to="/create"
                className="px-4 py-2 rounded shadow text-sm font-medium"
                style={{
                    backgroundColor: PALETTE.accentPurple,
                    color: PALETTE.accentYellow,
                }}
            >
                + New Character
            </Link>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {characters.map((c) => (
                <div
                    key={c.name}
                    className="p-6 rounded-lg flex flex-col shadow"
                    style={{ backgroundColor: PALETTE.sidebarBg }}
                >
                    {/* Character Image */}
                    <img
                        src={c.img}
                        alt={c.name}
                        className="h-32 w-full object-cover rounded"
                    />

                    {/* Name + Level */}
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-semibold text-white">{c.name}</span>
                        <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                                backgroundColor: PALETTE.accentYellow,
                                color: PALETTE.sidebarBg,
                            }}
                        >
                            Lvl {c.level}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-3 text-sm space-y-1">
                        <div>
                            <strong style={{ color: PALETTE.accentYellow }}>HP:</strong>{" "}
                            <span style={{ color: PALETTE.textPrimary }}>{c.hp}</span>
                        </div>
                        <div>
                            <strong style={{ color: PALETTE.accentYellow }}>AC:</strong>{" "}
                            <span style={{ color: PALETTE.textPrimary }}>{c.ac}</span>
                        </div>
                        <div>
                            <strong style={{ color: PALETTE.accentYellow }}>Init:</strong>{" "}
                            <span style={{ color: PALETTE.textPrimary }}>{c.init}</span>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-grow"></div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                        {["Edit", "Play"].map((label) => (
                            <button
                                key={label}
                                className="flex-1 px-3 py-1.5 rounded text-sm font-medium shadow"
                                style={{
                                    backgroundColor: PALETTE.accentPurple,
                                    color: PALETTE.accentYellow,
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default CharactersSection;
