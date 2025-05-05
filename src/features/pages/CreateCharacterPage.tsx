import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import ClassTab from "./CreateCharacterPage/ClassTab";
import RaceTab from "./CreateCharacterPage/RaceTab";
import BackgroundTab from "./CreateCharacterPage/BackgroundTab";
import AbilitiesTab from "./CreateCharacterPage/AbilitiesTab";

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: isNaN(Number(value)) ? value : parseInt(value),
        }));
    };

    const handleSubmit = () => {
        // TODO: submit to backend
        console.log("submit", form);
        navigate("/");
    };

    return (
        <section className="max-w-4xl mx-auto mt-8 px-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Create New Character</h1>
                <Link to="/" className="text-sm bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
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
                    <Tab.Panel>
                        <ClassTab value={form.class} onChange={handleChange} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <RaceTab value={form.race} onChange={handleChange} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <BackgroundTab value={form.background} onChange={handleChange} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <AbilitiesTab stats={form} onChange={handleChange} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit Character
            </button>
        </section>
    );
}