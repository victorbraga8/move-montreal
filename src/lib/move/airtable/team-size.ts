import { cleanStr } from "../utils/strings";

const allowedTeamSizes = new Set(["1", "1-2", "2-3", "4-6", "7-10", "11+"]);

export const normalizeTeamSize = (v: any) => {
  const s = cleanStr(v);
  if (!s) return undefined;
  if (allowedTeamSizes.has(s)) return s;
  const digits = s.replace(/[^\d]/g, "");
  const n = digits ? Number(digits) : NaN;
  if (!Number.isFinite(n)) return undefined;
  if (n <= 1) return "1";
  if (n <= 2) return "1-2";
  if (n <= 3) return "2-3";
  if (n <= 6) return "4-6";
  if (n <= 10) return "7-10";
  return "11+";
};
