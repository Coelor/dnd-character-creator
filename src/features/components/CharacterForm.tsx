import { useState } from "react";

const defaultStats = {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
};

export default function CharacterForm({ onSubmit }: { onSubmit: (char: any) => void }) {
    const [form, setForm] = useState({
        name: "",
        race: "",
        class: "",
        ...defaultStats,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: isNaN(Number(value)) ? value : parseInt(value),
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(form);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="race" placeholder="Race" value={form.race} onChange={handleChange} />
            <input name="class" placeholder="Class" value={form.class} onChange={handleChange} />

            {Object.keys(defaultStats).map((stat) => (
                <input
                    key={stat}
                    type="number"
                    name={stat}
                    value={(form as any)[stat]}
                    onChange={handleChange}
                    placeholder={stat}
                />
            ))}

            <button type="submit">Create Character</button>
        </form>
    );
}
