import { useState } from "react";

export function useStepForms() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    founderName: '', startupName: '', email: '', model: 'B2B', stage: 'Ideia', mrr: '', challenge: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { mrr, ...dataWithoutMrr } = formData;
    const finalData = formData.stage === 'Tracao' ? formData : dataWithoutMrr;

    console.log("=== JSON GERADO PARA A IA ===", JSON.stringify(finalData, null, 2));
    setStep(1);
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    handleInputChange,
    handleSubmit,
    step,
    formData,
    nextStep,
    prevStep
  }
}