import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAiPrompt } from "./prompt";
import { pickAiDecision, calcConfidence, calcFinalScore, type AiDecision } from "./scoring";
import { formatAiEvaluation } from "./format-memo";
import type { FormData } from "@/types";

export const runAiEvaluation = async (data: FormData) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Configuração ausente: VITE_GEMINI_API_KEY.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = buildAiPrompt(data);
  console.log("🧠 [MOVE][AI] Prompt enviado:", { chars: prompt.length, preview: prompt.slice(0, 1200) });
  const result = await model.generateContent(prompt);
  const aiRawText = result?.response?.text?.() || "";
  console.log("🤖 [MOVE][AI] Resposta bruta:", { chars: aiRawText.length, preview: aiRawText.slice(0, 1200) });

  const { decision: decision0, score: totalScore, isExplicit } = pickAiDecision(aiRawText);
  const confidencePct = calcConfidence(decision0, totalScore);
  const finalScore = calcFinalScore(totalScore, confidencePct);

  const decision: AiDecision = isExplicit
    ? decision0
    : finalScore !== null
      ? finalScore >= 75
        ? "Approve"
        : finalScore <= 45
          ? "Reject"
          : "Review"
      : decision0;

  const evaluation = formatAiEvaluation(aiRawText, decision, totalScore, finalScore);

  console.log("📌 [MOVE][AI] Scores:", { totalScore, confidencePct, finalScore, decision });

  return { aiRawText, decision, totalScore, finalScore, confidencePct, evaluation };
};
