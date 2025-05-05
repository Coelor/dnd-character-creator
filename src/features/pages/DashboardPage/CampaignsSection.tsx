import React from "react";
import { PALETTE } from "../../components/DashboardLayout";

export interface Campaign {
    title: string;
    dm: string;
    lastSession?: string;
    nextSession?: string;
    players: number;
    img: string;
}

interface CampaignsSectionProps {
    campaigns: Campaign[];
}

const CampaignsSection: React.FC<CampaignsSectionProps> = ({ campaigns }) => (
    <section>
        <div className="flex justify-between items-center mb-4">
            <h2
                className="text-xl font-semibold"
                style={{ color: PALETTE.accentYellow }}
            >
                Your Campaigns
            </h2>
            <button
                className="px-3 py-1 rounded"
                style={{
                    backgroundColor: PALETTE.accentPurple,
                    color: PALETTE.accentYellow,
                }}
            >
                + New Campaign
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
                <div
                    key={camp.title}
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: PALETTE.sidebarBg }}
                >
                    <img
                        src={camp.img}
                        alt={camp.title}
                        className="h-32 w-full object-cover"
                    />
                    <div className="p-4 space-y-1">
                        <div
                            className="font-semibold text-lg"
                            style={{ color: PALETTE.textPrimary }}
                        >
                            {camp.title}
                        </div>
                        <div className="text-sm" style={{ color: PALETTE.textSecondary }}>
                            Dungeon Master: {camp.dm}
                        </div>
                        {camp.lastSession && (
                            <div className="text-xs" style={{ color: PALETTE.textSecondary }}>
                                Last session: {camp.lastSession}
                            </div>
                        )}
                        {camp.nextSession && (
                            <div className="text-xs" style={{ color: PALETTE.textSecondary }}>
                                Next session: {camp.nextSession}
                            </div>
                        )}
                        <div className="mt-6 flex justify-between items-center">
                            <span className="text-xs" style={{ color: PALETTE.textSecondary }}>
                                {camp.players} players
                            </span>
                            <div className="flex space-x-2">
                                {["Notes", camp.nextSession ? "Schedule" : "Manage"].map(
                                    (label) => (
                                        <button
                                            key={label}
                                            className="px-2 py-1 rounded text-xs"
                                            style={{
                                                backgroundColor: PALETTE.accentPurple,
                                                color: PALETTE.accentYellow,
                                            }}
                                        >
                                            {label}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default CampaignsSection;
