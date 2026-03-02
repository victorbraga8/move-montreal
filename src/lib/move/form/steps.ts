import type { FormData } from "@/types";

export const stepTitles = ["Identificação", "Negócio", "Maturidade", "Operação", "Captação"] as const;

export const getCurrentStepFields = (formValues: Partial<FormData>) => {
  const base: Record<number, (keyof FormData)[]> = {
    1: ["startupName", "vertical", "verticalOther", "founders"],
    2: ["model", "stage", "targetCustomer", "painUrgency", "valueProp"],
    4: ["weeklyDedication", "teamComposition", "executionBottleneck"],
    5: ["runwayMonths", "capital", "equity", "capitalUse", "capitalPlan"],
  };

  const stage = formValues?.stage;
  const model = formValues?.model;

  if (formValues?.teamComposition && formValues.teamComposition !== "solo") {
    base[4] = ["weeklyDedication", "teamComposition", "teamSize", "executionBottleneck"];
  }

  const s3: (keyof FormData)[] = [];

  if (stage === "Ideia") {
    s3.push("interviewsCount", "validatedHypothesis", "ideaEvidence");
    if (model === "B2C") s3.push("audience");
    else s3.push("icp");
  }

  if (stage === "MVP") {
    s3.push("psfEvidence");
    const psf = formValues?.psfEvidence;
    if (model === "B2C") {
      s3.push("mau", "primaryChannel");
    } else {
      s3.push("icp", "acv");
      if (psf === "piloto_nao_pago" || psf === "piloto_pago") {
        s3.push("pilotType", "pilotSummary");
      }
    }
  }

  if (stage === "Tracao") {
    s3.push("mrr", "growth3m", "primaryChannel");
    if (model === "B2C") s3.push("mau");
    else s3.push("icp", "acv");
    s3.push("churn");
  }

  base[3] = s3;
  return base;
};
