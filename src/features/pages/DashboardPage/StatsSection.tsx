import React from "react";
import { PALETTE } from "../../components/DashboardLayout";

interface Stat {
  title: string;
  value: number;
  icon: React.ReactNode;
}
interface Props { stats: Stat[]; }

const StatsSection: React.FC<Props> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {stats.map((s) => (
      <div
        key={s.title}
        className="flex items-center p-4 rounded-lg"
        style={{ backgroundColor: PALETTE.sidebarBg }}
      >
        <div className="mr-4 text-2xl">{s.icon}</div>
        <div>
          <div
            className="text-2xl font-bold"
            style={{ color: PALETTE.accentYellow }}
          >
            {s.value}
          </div>
          <div className="text-sm" style={{ color: PALETTE.textSecondary }}>
            {s.title}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsSection;
