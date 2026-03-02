import { cleanStr } from "../utils/strings";

export const extractJsonCandidate = (raw: string) => {
  const t = cleanStr(raw);
  if (!t) return "";
  const m1 = t.match(/```json\s*([\s\S]*?)\s*```/i);
  if (m1?.[1]) return m1[1].trim();
  const m2 = t.match(/```([\s\S]*?)```/i);
  if (m2?.[1]) return m2[1].trim();
  const firstBrace = t.indexOf("{");
  const lastBrace = t.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) return t.slice(firstBrace, lastBrace + 1).trim();
  return t;
};

export const safeParseJson = (raw: string) => {
  const candidate = extractJsonCandidate(raw);
  if (!candidate) return null;
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
};
