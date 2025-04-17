import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";

const tabs = ["Class", "Race", "Background", "Abilities"];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function CreateCharacterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        class: "",
        race: "",
        background: "",
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: isNaN(Number(value)) ? value : parseInt(value),
        }));
    }

    return (
        <section className="max-w-4xl mx-auto mt-8 px-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Create New Character</h1>
                <Link
                    to="/"
                    className="text-sm bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                >
                    Cancel
                </Link>
            </div>

            <Tab.Group>
                <Tab.List className="flex space-x-2 border-b">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab}
                            className={({ selected }) =>
                                classNames(
                                    "px-4 py-2 text-sm font-medium focus:outline-none",
                                    selected
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                )
                            }
                        >
                            {tab}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels className="mt-4 space-y-2">
                    {/* CLASS */}
                    <Tab.Panel>
                        <label className="block mb-1 text-sm">Class</label>
                        <select
                            name="class"
                            value={form.class}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select class</option>
                            <option>Fighter</option>
                            <option>Wizard</option>
                            <option>Rogue</option>
                            <option>Cleric</option>
                        </select>
                    </Tab.Panel>

                    {/* RACE */}
                    <Tab.Panel>
                        <label className="block mb-1 text-sm">Race</label>
                        <select
                            name="race"
                            value={form.race}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select race</option>
                            <option>Elf</option>
                            <option>Dwarf</option>
                            <option>Human</option>
                            <option>Dragonborn</option>
                        </select>
                    </Tab.Panel>

                    {/* BACKGROUND */}
                    <Tab.Panel>
                        <label className="block mb-1 text-sm">Background</label>
                        <input
                            name="background"
                            value={form.background}
                            onChange={handleChange}
                            placeholder="Enter background"
                            className="w-full p-2 border rounded"
                        />
                    </Tab.Panel>

                    {/* ABILITIES */}
                    <Tab.Panel>
                        {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat) => (
                            <div key={stat}>
                                <label className="block text-sm capitalize">{stat}</label>
                                <input
                                    type="number"
                                    name={stat}
                                    value={(form as any)[stat]}
                                    onChange={handleChange}
                                    className="w-full p-2 mb-2 border rounded"
                                />
                            </div>
                        ))}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Submit Character
            </button>
        </section>
    );
}
