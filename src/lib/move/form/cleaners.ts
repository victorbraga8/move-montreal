import type { FormData } from "@/types";

type SetValue = (name: any, value: any, options?: any) => void;

export const applyTeamCompositionCleaning = (formValues: Partial<FormData>, setValue: SetValue) => {
  if (formValues?.teamComposition === "solo") {
    setValue("teamSize" as any, undefined as any, { shouldValidate: false, shouldDirty: true });
  }
};

export const applyStageModelCleaning = (formValues: Partial<FormData>, setValue: SetValue) => {
  const stage = formValues?.stage;
  const model = formValues?.model;
  if (!stage || !model) return;

  const clear = (k: keyof FormData, v: any = "") => setValue(k, v as any, { shouldValidate: false, shouldDirty: true });

  if (stage === "Ideia") {
    clear("psfEvidence", "entrevistas");
    clear("pilotType", "planejado");
    clear("pilotSummary");
    clear("acv");
    clear("mau");
    clear("mrr");
    clear("growth3m");
    clear("churn");
    clear("primaryChannel");
    if (model === "B2C") clear("icp");
    else clear("audience");
  }

  if (stage === "MVP") {
    clear("interviewsCount");
    clear("validatedHypothesis");
    clear("ideaEvidence");
    clear("mrr");
    clear("growth3m");
    clear("churn");
    if (model === "B2C") {
      clear("icp");
      clear("pilotType", "planejado");
      clear("pilotSummary");
      clear("acv");
    } else {
      clear("audience");
    }
  }

  if (stage === "Tracao") {
    clear("interviewsCount");
    clear("validatedHypothesis");
    clear("ideaEvidence");
    clear("psfEvidence", "entrevistas");
    clear("pilotType", "planejado");
    clear("pilotSummary");
    if (model === "B2C") clear("icp");
    else clear("audience");
  }
};

export const applyPsfCleaning = (formValues: Partial<FormData>, setValue: SetValue) => {
  if (formValues?.stage !== "MVP") return;
  if (formValues?.model === "B2C") return;
  const isPilotEvidence = formValues?.psfEvidence === "piloto_nao_pago" || formValues?.psfEvidence === "piloto_pago";
  if (isPilotEvidence) return;
  const clear = (k: keyof FormData, v: any = "") => setValue(k, v as any, { shouldValidate: false, shouldDirty: true });
  clear("pilotType", "planejado");
  clear("pilotSummary");
};
