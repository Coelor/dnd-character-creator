interface AbilitiesTabProps { stats: Record<string, number>; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }
export default function AbilitiesTab({ stats, onChange }: AbilitiesTabProps) {
    return (
        <>
            {Object.entries(stats)
                .filter(([key]) => [
                    "strength",
                    "dexterity",
                    "constitution",
                    "intelligence",
                    "wisdom",
                    "charisma",
                ].includes(key))
                .map(([stat, value]) => (
                    <div key={stat}>
                        <label className="block text-sm capitalize">{stat}</label>
                        <input
                            type="number"
                            name={stat}
                            value={value}
                            onChange={onChange}
                            className="w-full p-2 mb-2 border rounded"
                        />
                    </div>
                ))}
        </>
    );
}