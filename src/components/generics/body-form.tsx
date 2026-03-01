import HeaderControl from "../form-steps/header-control";
import StepOne from "../form-steps/step-one";
import StepTwo from "../form-steps/step-two";
import StepThree from "../form-steps/step-three";
import StepFour from "../form-steps/step-four";
import StepFive from "../form-steps/step-five";

export default function BodyForm({
  step,
  register,
  errors,
  founderFields,
  appendFounder,
  removeFounder,
  formValues,
  setValue,
}: any) {
  const model = formValues?.model;
  const stage = formValues?.stage;

  const FieldError = ({ path }: { path: string }) => {
    const parts = path.split(".");
    let cur: any = errors;
    for (const p of parts) cur = cur?.[p];
    const msg = cur?.message;
    return msg ? <p className="text-red-400 text-xs mt-1">{msg}</p> : null;
  };

  const inputBase =
    "w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none shadow-inner transition-all";

  const labelBase = "block text-sm text-slate-300 mb-2 font-bold";

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900 p-4 sm:p-8 flex flex-col gap-6">
      <HeaderControl step={Number(step)} />
      {step === 1 && (
        <StepOne labelBase={labelBase} register={register} inputBase={inputBase} errors={errors} FieldError={FieldError} formValues={formValues} founderFields={founderFields} appendFounder={appendFounder} setValue={setValue} removeFounder={removeFounder} />
      )}

      {step === 2 && (
        <StepTwo labelBase={labelBase} register={register} inputBase={inputBase} errors={errors} FieldError={FieldError} />
      )}

      {step === 3 && (
        <StepThree labelBase={labelBase} register={register} inputBase={inputBase} errors={errors} FieldError={FieldError} setValue={setValue} stage={stage} model={model} />
      )}

      {step === 4 && (
        <StepFour labelBase={labelBase} register={register} inputBase={inputBase} errors={errors} FieldError={FieldError} />
      )}

      {step === 5 && (
        <StepFive labelBase={labelBase} register={register} inputBase={inputBase} errors={errors} FieldError={FieldError} setValue={setValue} />
      )}
    </div>
  );
}
