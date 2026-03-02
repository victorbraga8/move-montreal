import type { FormData } from "@/types";

export const buildAiPrompt = (data: FormData) => {
  const capitalUse = Object.entries((data as any).capitalUse || {})
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k)
    .join(", ");

  return [
    "Você é um analista de triagem do programa MoVe (Montreal Ventures), focado em startups early-stage.",
    "Objetivo: gerar um resumo objetivo e sinais de maturidade/fit para decisão de triagem.",
    "Regras: seja pragmático, aponte gaps, e não invente dados.",
    "",
    `Startup: ${data.startupName}`,
    `Vertical: ${data.vertical}${data.vertical === "Outros" ? ` (${data.verticalOther || ""})` : ""}`,
    `Modelo: ${data.model} | Estágio: ${data.stage}`,
    "",
    "Negócio:",
    `- Cliente-alvo: ${data.targetCustomer}`,
    `- Dor/urgência: ${data.painUrgency}`,
    `- Proposta de valor: ${data.valueProp}`,
    "",
    "Maturidade:",
    data.stage === "Ideia"
      ? `- Entrevistas: ${data.interviewsCount}\n- Hipótese validada: ${data.validatedHypothesis}\n- Evidência extra: ${data.ideaEvidence || "n/a"}\n- ${data.model === "B2C" ? `Público: ${data.audience}` : `ICP: ${data.icp}`}`
      : data.stage === "MVP"
        ? `- Evidência PSF: ${data.psfEvidence}\n- ${data.model === "B2C" ? `MAU: ${data.mau}\n- Canal inicial: ${data.primaryChannel}` : `ICP: ${data.icp}\n- Piloto: ${data.pilotType}\n- Resumo: ${data.pilotSummary}\n- ACV: ${data.acv}`}`
        : `- MRR: ${data.mrr}\n- Growth 3m: ${data.growth3m}\n- Churn: ${data.churn || "n/a"}\n- Canal: ${data.primaryChannel}\n- ${data.model === "B2C" ? `MAU: ${data.mau}` : `ICP: ${data.icp}\n- ACV: ${data.acv}`}`,
    "",
    "Operação:",
    `- Dedicação semanal: ${data.weeklyDedication}`,
    `- Composição do time: ${data.teamComposition}`,
    `- Gargalo: ${data.executionBottleneck}`,
    "",
    "Captação:",
    `- Runway (meses): ${data.runwayMonths}`,
    `- Capital solicitado: ${data.capital}`,
    `- Equity: ${data.equity}%`,
    `- Uso do capital: ${capitalUse}`,
    `- Plano (defesa): ${data.capitalPlan}`,
    "",
    "Saída (JSON estrito, sem markdown/code fence): {",
    "  executive_summary: string (2-4 linhas, tese VC),",
    "  positives: string[] (3-7 bullets),",
    "  negatives: string[] (3-7 bullets),",
    "  red_flags: string[] (0-6 bullets),",
    "  thesis_fit: string (1-2 linhas: por que isso pode/nao pode virar venture-scale),",
    "  recommendation: \"Approve\" | \"Reject\" | \"Review\",",
    "  rationale: string (objetivo, sem floreio),",
    "  score_0_100: number,",
    "  next_questions: string[] (5-10 perguntas de diligência)",
    "}",
  ].join("\n");
};
