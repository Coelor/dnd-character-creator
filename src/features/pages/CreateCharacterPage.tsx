import React, { useState } from "react";
import Stepper from "../components/CharacterCreation/Stepper";
import BasicsStep from "../components/CharacterCreation/BasicsStep";
import RaceStep from "../components/CharacterCreation/RaceStep";
import ClassStep from "../components/CharacterCreation/ClassStep";
import AbilitiesStep from "../components/CharacterCreation/AbilitiesStep";
import BackgroundStep from "../components/CharacterCreation/BackgroundStep";
// import EquipmentStep from "../components/CharacterCreation/EquipmentStep";
import ReviewStep from "../components/CharacterCreation/ReviewStep";

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
  const [formData, setFormData] = useState({
    name: "",
    level: 1,
    race: "",
    class: "",
    alignment: "",
  });

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
      {/* Add others */}

      <div className="flex justify-between pt-4">
        <button onClick={goToPrev} className="px-4 py-2 rounded bg-gray-600 text-white">
          Back
        </button>
        <button onClick={goToNext} className="px-4 py-2 rounded bg-purple-600 text-yellow-300">
          Next
        </button>
      </div>
    </div>
  );
};

export default CreateCharacterPage;
