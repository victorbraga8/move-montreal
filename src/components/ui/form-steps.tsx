import { stepTitles } from "@/provider/data";
import LoadingSubmit from "../generics/loading-submit";
import HeaderForm from "../generics/header-form";
import TimelineForm from "../generics/timeline-form";
import BodyForm from "../generics/body-form";
import FooterForm from "../generics/footer-form";
import type { FormStepsProps } from "@/types";

export default function FormSteps({
  step,
  highestStep,
  loadingStage,
  canProceed,
  register,
  handleSubmit,
  onSubmitForm,
  errors,
  isSubmitting,
  founderFields,
  appendFounder,
  removeFounder,
  formValues,
  setValue,
  handleNextStep,
  prevStep,
  jumpToStep,
  setIsModalOpen
}: FormStepsProps & { setIsModalOpen: (val: boolean) => void }) {

  const lastStep = stepTitles.length;


  return (
    <div className="relative w-full h-full min-h-0 flex flex-col bg-slate-900 border-0 sm:border border-slate-700 sm:rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.15)] overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8">

      {isSubmitting && (
        <LoadingSubmit loadingStage={loadingStage} />
      )}

      <HeaderForm setIsModalOpen={setIsModalOpen} />
      <TimelineForm stepTitles={stepTitles} highestStep={highestStep} jumpToStep={jumpToStep} step={step} />
      <BodyForm step={step} register={register} errors={errors} founderFields={founderFields} appendFounder={appendFounder} formValues={formValues} setValue={setValue} removeFounder={removeFounder} />
      <FooterForm step={step} lastStep={lastStep} prevStep={prevStep} isSubmitting={isSubmitting} canProceed={canProceed} handleNextStep={handleNextStep} handleSubmit={handleSubmit} onSubmitForm={onSubmitForm} />
    </div>
  )
}