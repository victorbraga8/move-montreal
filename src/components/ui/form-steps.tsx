import { CheckCircle2, ChevronDown, ChevronRight, Milestone, Target, TrendingUp, Users, Briefcase, Lock, Check, Plus, Trash2, X } from "lucide-react";
import { centsToCurrency, currencyToCents, maskCurrency, maskPercent, maskPhone, MAX_CAPITAL_CENTS } from "@/provider/helpers";
import { stepTitles } from "@/provider/data";
import { useStepForms } from "@/hooks/use-step-forms";
import { Button } from "./button";
import LoadingSubmit from "../generics/loading-submit";
import HeaderForm from "../generics/header-form";
import TimelineForm from "../generics/timeline-form";
import BodyForm from "../generics/body-form";
import FooterForm from "../generics/footer-form";

type FormStepsProps = ReturnType<typeof useStepForms>


export default function FormSteps({
  step,
  highestStep,
  loadingStage,
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
  return (
    <div className="relative w-full h-full min-h-0 flex flex-col bg-slate-900 border-0 sm:border border-slate-700 sm:rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.15)] overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8">

      {isSubmitting && (
        <LoadingSubmit loadingStage={loadingStage} />
      )}

      <HeaderForm setIsModalOpen={setIsModalOpen} />
      <TimelineForm stepTitles={stepTitles} highestStep={highestStep} jumpToStep={jumpToStep} step={step} />
      <BodyForm step={step} register={register} errors={errors} founderFields={founderFields} appendFounder={appendFounder} formValues={formValues} setValue={setValue} removeFounder={removeFounder} />
      <FooterForm step={step} prevStep={prevStep} isSubmitting={isSubmitting} handleNextStep={handleNextStep} handleSubmit={handleSubmit} onSubmitForm={onSubmitForm} />
    </div>
  )
}