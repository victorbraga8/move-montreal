import { clamp } from "../utils/numbers";
import { safeParseJson } from "./json";

export type AiDecision = "Approve" | "Reject" | "Review" | "Uncategorized";

const allowedAiDecisions = new Set<AiDecision>(["Approve", "Reject", "Review", "Uncategorized"]);

export const pickAiDecision = (aiText: string) => {
  const obj = safeParseJson(aiText);

  const score =
    (typeof (obj as any)?.score_0_100 === "number" && Number.isFinite((obj as any).score_0_100)
      ? (obj as any).score_0_100
      : null) ??
    (typeof (obj as any)?.fit_score_0_100 === "number" && Number.isFinite((obj as any).fit_score_0_100)
      ? (obj as any).fit_score_0_100
      : null);

  const explicitDecisionRaw =
    (typeof (obj as any)?.recommendation === "string" ? (obj as any).recommendation.trim() : "") ||
    (typeof (obj as any)?.ai_decision === "string" ? (obj as any).ai_decision.trim() : "") ||
    (typeof (obj as any)?.decision === "string" ? (obj as any).decision.trim() : "");

  const isExplicit = Boolean(explicitDecisionRaw);
  const explicitDecision = explicitDecisionRaw as AiDecision;

  if (explicitDecision && allowedAiDecisions.has(explicitDecision)) {
    return { decision: explicitDecision, score: score as number | null, isExplicit };
  }

  if (score !== null) {
    if (score >= 75) return { decision: "Approve" as AiDecision, score, isExplicit: false };
    if (score <= 45) return { decision: "Reject" as AiDecision, score, isExplicit: false };
    return { decision: "Review" as AiDecision, score, isExplicit: false };
  }

  return { decision: "Review" as AiDecision, score: null as number | null, isExplicit: false };
};

export const calcConfidence = (decision: AiDecision, score: number | null) => {
  if (score === null) return 50;
  if (decision === "Approve") return clamp(Math.round(70 + (score - 75) * 1.0), 70, 95);
  if (decision === "Reject") return clamp(Math.round(70 + (45 - score) * 1.0), 70, 95);
  return clamp(Math.round(45 + Math.abs(score - 60) * 0.6), 45, 80);
};

export const calcFinalScore = (score: number | null, confidencePct: number) => {
  if (score === null) return null;
  const c = clamp(confidencePct, 0, 100) / 100;
  const adjusted = score * (0.7 + 0.3 * c);
  return clamp(adjusted, 0, 100);
};
