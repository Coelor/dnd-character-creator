// CharacterForm.tsx
import { useState } from "react";
import { Tab } from "@headlessui/react";

const tabs = ["Overview", "Race", "Class", "Stats"];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function CharacterForm({ onSubmit }: { onSubmit: (char: any) => void }) {
    const [form, setForm] = useState({
        name: "",
        race: "",
        class: "",
        background: "",
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name in form && typeof form[name as keyof typeof form] === "number"
                ? parseInt(value)
                : value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(form);
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-white shadow-md">
            <Tab.Group>
                <Tab.List className="flex space-x-2 border-b mb-4">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab}
                            className={({ selected }) =>
                                classNames(
                                    "px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none",
                                    selected
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                )
                            }
                        >
                            {tab}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="space-y-4">
                    <Tab.Panel>
                        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" />
                        <input name="background" placeholder="Background" value={form.background} onChange={handleChange} className="input" />
                    </Tab.Panel>
                    <Tab.Panel>
                        <input name="race" placeholder="Race" value={form.race} onChange={handleChange} className="input" />
                    </Tab.Panel>
                    <Tab.Panel>
                        <input name="class" placeholder="Class" value={form.class} onChange={handleChange} className="input" />
                    </Tab.Panel>
                    <Tab.Panel>
                        {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat) => (
                            <input
                                key={stat}
                                name={stat}
                                type="number"
                                value={(form as any)[stat]}
                                onChange={handleChange}
                                placeholder={stat.charAt(0).toUpperCase() + stat.slice(1)}
                                className="input"
                            />
                        ))}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                Create Character
            </button>
        </form>
    );
}
