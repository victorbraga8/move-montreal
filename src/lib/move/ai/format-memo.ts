import { safeParseJson } from "./json";
import { cleanStr } from "../utils/strings";
import { round1 } from "../utils/numbers";
import type { AiDecision } from "./scoring";

export const formatAiEvaluation = (
  aiText: string,
  decision: AiDecision,
  totalScore: number | null,
  finalScore: number | null
) => {
  const obj: any = safeParseJson(aiText) || {};

  const executiveSummary = cleanStr(obj?.executive_summary) || cleanStr(obj?.summary) || cleanStr(aiText) || "Análise indisponível.";
  const positives: string[] = Array.isArray(obj?.positives) ? obj.positives.filter(Boolean) : [];
  const negatives: string[] = Array.isArray(obj?.negatives) ? obj.negatives.filter(Boolean) : [];
  const redFlags: string[] = Array.isArray(obj?.red_flags) ? obj.red_flags.filter(Boolean) : [];
  const thesisFit = cleanStr(obj?.thesis_fit) || "";
  const rationale = cleanStr(obj?.rationale) || "";
  const nq: string[] = Array.isArray(obj?.next_questions) ? obj.next_questions.filter(Boolean) : [];

  const decisionLabel =
    decision === "Approve" ? "APPROVE" : decision === "Reject" ? "REJECT" : decision === "Uncategorized" ? "UNCATEGORIZED" : "REVIEW";

  const lines: string[] = [];
  // lines.push("MOVE | VC Memo");
  lines.push(`Decisão: ${decisionLabel}`);
  lines.push(
    `AI Total Score: ${totalScore !== null ? `${round1(totalScore)}/100` : "N/A"} | AI Final Score: ${finalScore !== null ? `${round1(finalScore)}/100` : "N/A"}`
  );
  lines.push("");

  lines.push("Resumo executivo");
  lines.push(executiveSummary.trim());
  lines.push("");

  if (thesisFit) {
    lines.push("Thesis fit");
    lines.push(thesisFit.trim());
    lines.push("");
  }

  if (positives.length) {
    lines.push("Pontos positivos");
    positives.slice(0, 8).forEach((x) => lines.push(`- ${String(x).trim()}`));
    lines.push("");
  }

  if (negatives.length) {
    lines.push("Pontos negativos");
    negatives.slice(0, 8).forEach((x) => lines.push(`- ${String(x).trim()}`));
    lines.push("");
  }

  if (redFlags.length) {
    lines.push("Red flags");
    redFlags.slice(0, 8).forEach((x) => lines.push(`- ${String(x).trim()}`));
    lines.push("");
  }

  if (rationale) {
    lines.push("Justificativa");
    lines.push(rationale.trim());
    lines.push("");
  }

  lines.push("Diligência (perguntas que destravam decisão)");
  if (nq.length) nq.slice(0, 10).forEach((x) => lines.push(`- ${String(x).trim()}`));
  else {
    lines.push("- Validar ICP pagante e canal previsível (qual evidência real de compra?)");
    lines.push("- Confirmar unidade econômica (ACV/LTV, churn, ciclo de venda)");
    lines.push("- Testar se a dor é must-have vs nice-to-have");
    lines.push("- Checar risco competitivo/defensabilidade (dados, distribuição, moat)");
    lines.push("- Confirmar velocidade de execução do time (ship rate e GTM)");
  }
  lines.push("");

  lines.push("Próximo passo sugerido");
  if (decision === "Approve") lines.push("- Avançar para entrevista e checagem rápida de execução + GTM.");
  else if (decision === "Reject")
    lines.push("- Não avançar nesta rodada; sugerir re-submissão após evidência objetiva (piloto, LOI, métrica).");
  else lines.push("- Manter em REVIEW; pedir 2–3 evidências objetivas e reavaliar.");

  return lines.join("\n").trim();
};
