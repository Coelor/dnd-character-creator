import React from "react";
import StatsSection from "./DashboardPage/StatsSection";
import CharactersSection from "./DashboardPage/CharactersSection";
import CampaignsSection from "./DashboardPage/CampaignsSection";
import ActivitySection from "./DashboardPage/RecentActivitySection";

// TODO: replace these with real data sources or context
const stats = [
  { title: "Active Characters", value: 3, icon: "👤" },
  { title: "Active Campaigns",  value: 2, icon: "🏰" },
  { title: "Upcoming Sessions", value: 1, icon: "📅" },
];

const characters = [
  { name: "Thordak Stonefist",   hp: "65/85", ac: 16, init: +2, level: 7, img: "/avatar1.png" },
  { name: "Elyndra Starweaver",  hp: "18/32", ac: 13, init: +3, level: 5, img: "/avatar2.png" },
  { name: "Finley Nimblefingers", hp: "42/42", ac: 15, init: +4, level: 6, img: "/avatar3.png" },
];

const campaigns = [
  { 
    title: "The Dragon’s Keep",
    dm:    "You",
    lastSession: "Apr 28, 2025",
    players: 4,
    img:   "/camp1.jpg",
  },
  {
    title: "Shadows of Eldoria",
    dm:    "Merlin Stormwind",
    nextSession: "May 10, 2025",
    players: 5,
    img:   "/camp2.jpg",
  },
];

const recent = [
  { text: "You leveled up Thordak Stonefist to level 7",    when: "May 2, 2025 • 14:32" },
  { text: "Merlin Stormwind scheduled a new session…", when: "May 1, 2025 • 19:15" },
  { text: "You created a new campaign The Dragon’s Keep",   when: "Apr 29, 2025 • 10:22" },
  { text: "You created a new character Elyndra Starweaver", when: "Apr 27, 2025 • 15:47" },
];

const DashboardPage: React.FC = () => (
  <div className="space-y-12">
    {/* <StatsSection stats={stats} /> */}
    <CharactersSection characters={characters} />
    {/* <CampaignsSection campaigns={campaigns} /> */}
    {/* <ActivitySection recent={recent} /> */}
  </div>
);

export default DashboardPage;
