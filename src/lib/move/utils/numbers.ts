export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const round1 = (n: number) => Math.round(n * 10) / 10;

export const numOrNull = (v: any) => {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  if (!s) return null;
  const normalized = s.replace(",", ".").replace(/[^\d.-]/g, "");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

export const moneyOrNull = (v: any) => {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const digits = String(v).replace(/\D/g, "");
  if (!digits) return null;
  const cents = Number(digits);
  if (!Number.isFinite(cents)) return null;
  return cents / 100;
};
