import type { FormData } from "@/types";
import { cleanStr, strOrEmpty, strOrNA } from "../utils/strings";
import { moneyOrNull, numOrNull, round1 } from "../utils/numbers";
import type { AiDecision } from "../ai/scoring";
import { normalizeTeamSize } from "./team-size";
import { mapCapitalUseToAirtable, mapStageToAirtable, mapTeamCompositionToAirtable, mapWeeklyDedicationToAirtable } from "./mappers";

export const buildAirtableFieldsPayload = (data: FormData, ai: { decision: AiDecision; totalScore: number | null; finalScore: number | null; evaluation: string }) => {
  const modeloSelect = cleanStr((data as any).model);
  const allowedModelos = new Set(["B2B", "B2C", "B2B2C", "Marketplace", "SaaS", "Other"]);
  const modeloFinal = allowedModelos.has(modeloSelect) ? modeloSelect : modeloSelect ? "Other" : undefined;

  const verticalSelect = cleanStr((data as any).vertical) || undefined;
  const stageSelect = mapStageToAirtable((data as any).stage);
  const psfEvidenceSelect = cleanStr((data as any).psfEvidence) || undefined;
  const pilotTypeSelect = cleanStr((data as any).pilotType) || undefined;
  const teamCompositionSelect = mapTeamCompositionToAirtable((data as any).teamComposition);
  const weeklyDedicationSelect = mapWeeklyDedicationToAirtable((data as any).weeklyDedication);

  const foundersArr = ((data as any).founders || []) as any[];
  const fundadoresTexto = foundersArr.length
    ? foundersArr
        .map((f) => {
          const name = cleanStr(f?.name) || "Sem nome";
          const email = cleanStr(f?.email) || "Sem email";
          const phone = cleanStr(f?.phone) || "Sem telefone";
          const linkedin = cleanStr(f?.linkedin) || "Sem LinkedIn";
          return `${name} (${email} | ${phone} | ${linkedin})`;
        })
        .join("\n")
    : "Não informado";

  const capitalUseDeduped = mapCapitalUseToAirtable(((data as any).capitalUse || {}) as Record<string, any>);

  const capitalRequested =
    moneyOrNull((data as any).capitalRequested) ?? moneyOrNull((data as any).capital_solicitado) ?? moneyOrNull((data as any).capital);

  if ((data as any).capital && capitalRequested === null) {
    throw new Error("Capital solicitado inválido. Revise o valor (ex: R$ 300.000,00).");
  }

  const fieldsPayload: any = {
    "Startup Name": strOrNA((data as any).startupName),
    Vertical: verticalSelect,
    "Vertical Other": strOrEmpty((data as any).verticalOther),
    Modelo: modeloFinal,
    Stage: stageSelect,
    "Target Customer": strOrNA((data as any).targetCustomer),
    "Pain & Urgency": strOrNA((data as any).painUrgency),
    "Value Proposition": strOrNA((data as any).valueProp),
    "Interviews Count": numOrNull((data as any).interviewsCount),
    "Validated Hypothesis": strOrNA((data as any).validatedHypothesis),
    "Idea Evidence": strOrNA((data as any).ideaEvidence),
    ICP: strOrNA((data as any).icp),
    Audience: strOrNA((data as any).audience),
    "PSF Evidence": psfEvidenceSelect,
    "Pilot Type": pilotTypeSelect,
    "Pilot Summary": strOrEmpty((data as any).pilotSummary),
    ACV: moneyOrNull((data as any).acv),
    MAU: numOrNull((data as any).mau),
    MRR: moneyOrNull((data as any).mrr),
    "Growth 3m (%)": numOrNull((data as any).growth3m),
    "Churn (%)": numOrNull((data as any).churn),
    "Primary Channel": strOrEmpty((data as any).primaryChannel),
    "Weekly Dedication": weeklyDedicationSelect,
    "Team Composition": teamCompositionSelect,
    "Team Size": (() => {
      if (teamCompositionSelect === "solo") return "1";
      return normalizeTeamSize((data as any).teamSize);
    })(),
    "Execution Bottleneck": strOrNA((data as any).executionBottleneck),
    "Runway (months)": numOrNull((data as any).runwayMonths),
    "Capital Requested": capitalRequested,
    "Equity (%)": numOrNull((data as any).equity),
    "Capital Use": capitalUseDeduped.length ? capitalUseDeduped : undefined,
    "Capital Plan": strOrNA((data as any).capitalPlan),
    Fundadores: fundadoresTexto,
    "AI Decision": ai.decision,
    "AI Total Score": ai.totalScore !== null ? ai.totalScore : undefined,
    "AI Final Score": ai.finalScore !== null ? round1(ai.finalScore) : undefined,
    "AI Evaluation": ai.evaluation,
    "Submitted At": new Date().toISOString(),
  };

  Object.keys(fieldsPayload).forEach((k) => {
    const v = fieldsPayload[k];
    if (v === undefined || v === null) delete fieldsPayload[k];
    if (typeof v === "string" && v.trim() === "") delete fieldsPayload[k];
    if (typeof v === "number" && Number.isNaN(v)) delete fieldsPayload[k];
    if (Array.isArray(v) && v.length === 0) delete fieldsPayload[k];
  });

  return fieldsPayload;
};
