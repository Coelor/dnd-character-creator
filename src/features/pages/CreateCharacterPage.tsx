import React, { useState } from "react";
import Stepper from "../components/CharacterCreation/Stepper";
import BasicsStep from "../components/CharacterCreation/BasicsStep";
import RaceStep from "../components/CharacterCreation/RaceStep";
import ClassStep from "../components/CharacterCreation/ClassStep";
import AbilitiesStep from "../components/CharacterCreation/AbilitiesStep";
import BackgroundStep from "../components/CharacterCreation/BackgroundStep";
import ReviewStep from "../components/CharacterCreation/ReviewStep";
import SaveCharacterButton from "../components/SaveCharacterButton";
import { useNavigate } from "react-router-dom";
import { CharacterInput } from "../../types/character";

const steps = [
  "Basics",
  "Race",
  "Class",
  "Abilities",
  "Background",
  "Equipment",
  "Review",
];

const CreateCharacterPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<CharacterInput>({
    name: "",
    level: 1,
    race: "",
    subrace: "",
    class: "",
    subclass: "",
    alignment: "",
    background: "",
    race_bonuses: {
      STR: 0,
      DEX: 0,
      CON: 0,
      INT: 0,
      WIS: 0,
      CHA: 0,
    },
    class_ability_bonuses: [],
    base_abilities: {
      STR: 8,
      DEX: 8,
      CON: 8,
      INT: 8,
      WIS: 8,
      CHA: 8,
    },
    extra_languages: [],
    selected_traits: {
      personality_traits: [],
      ideals: [],
      bonds: [],
      flaws: []
    },
    proficiencies: [],
    hp: "0/0",
    ac: 10,
    init: 0,
    img: "",
  });
  

  const navigate = useNavigate();

  const goToNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goToPrev = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="px-4 sm:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400">Create New Character</h1>
      <Stepper steps={steps} currentStep={step} onStepClick={(index) => setStep(index)} />

      {step === 0 && <BasicsStep formData={formData} setFormData={setFormData} />}
      {step === 1 && <RaceStep formData={formData} setFormData={setFormData} />}
      {step === 2 && <ClassStep formData={formData} setFormData={setFormData} />}
      {step === 3 && <AbilitiesStep formData={formData} setFormData={setFormData} />}
      {step === 4 && <BackgroundStep formData={formData} setFormData={setFormData} />}
      {/* {step === 5 && <EquipmentStep formData={formData} setFormData={setFormData} />} */}
      {step === 6 && <ReviewStep formData={formData} setFormData={setFormData} />}

      <div className="flex justify-between pt-4">
        <button
          onClick={goToPrev}
          className="px-4 py-2 rounded bg-gray-600 text-white"
          disabled={step === 0}
        >
          Back
        </button>

        {step === steps.length - 1 ? (
          <SaveCharacterButton
            formData={formData}
            onSaved={() => navigate("/")}
          />
        ) : (
          <button
            onClick={goToNext}
            className="px-4 py-2 rounded bg-purple-600 text-yellow-300"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateCharacterPage;
