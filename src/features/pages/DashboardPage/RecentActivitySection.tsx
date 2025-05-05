import React from "react";
import { PALETTE } from "../../components/DashboardLayout";

export interface Activity {
  text: string;
  when: string;
}

interface RecentActivitySectionProps {
  recent: Activity[];
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  recent,
}) => (
  <section>
    <div className="flex justify-between items-center mb-4">
      <h2
        className="text-xl font-semibold"
        style={{ color: PALETTE.accentYellow }}
      >
        Recent Activity
      </h2>
      <a href="#" className="text-sm" style={{ color: PALETTE.textSecondary }}>
        View All
      </a>
    </div>

    <ul className="divide-y divide-gray-700 bg-[var(--sidebar-bg)] rounded-lg p-4">
      {recent.map((r, i) => (
        <li key={i} className="flex justify-between py-2">
          <span style={{ color: PALETTE.textPrimary }}>{r.text}</span>
          <span className="text-xs" style={{ color: PALETTE.textSecondary }}>
            {r.when}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

export default RecentActivitySection;
