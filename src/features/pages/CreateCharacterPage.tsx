import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import Stepper from "../components/CharacterCreation/Stepper";
import BasicsStep from "../components/CharacterCreation/BasicsStep";
import RaceStep from "../components/CharacterCreation/RaceStep";
import ClassStep from "../components/CharacterCreation/ClassStep";
import AbilitiesStep from "../components/CharacterCreation/AbilitiesStep";
import BackgroundStep from "../components/CharacterCreation/BackgroundStep";
import ReviewStep from "../components/CharacterCreation/ReviewStep";
import SaveCharacterButton from "../components/SaveCharacterButton";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import type { CharacterInput } from "../../types/character";

const steps = [
  "Basics",
  "Race",
  "Class",
  "Abilities",
  "Background",
  "Equipment",
  "Review",
];

const CreateCharacterPage = () => {
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/characters')}>
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-heading-1">Create New Character</h1>
          <p className="text-body mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={step} onStepClick={(index) => setStep(index)} />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {step === 0 && <BasicsStep formData={formData} setFormData={setFormData} />}
          {step === 1 && <RaceStep formData={formData} setFormData={setFormData} />}
          {step === 2 && <ClassStep formData={formData} setFormData={setFormData} />}
          {step === 3 && <AbilitiesStep formData={formData} setFormData={setFormData} />}
          {step === 4 && <BackgroundStep formData={formData} setFormData={setFormData} />}
          {step === 5 && (
            <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
              <p>Equipment selection coming soon...</p>
            </div>
          )}
          {step === 6 && <ReviewStep formData={formData} setFormData={setFormData} />}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={goToPrev}
          variant="secondary"
          disabled={step === 0}
        >
          Back
        </Button>

        {step === steps.length - 1 ? (
          <SaveCharacterButton
            formData={formData}
            onSaved={() => navigate("/")}
          />
        ) : (
          <Button onClick={goToNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateCharacterPage;