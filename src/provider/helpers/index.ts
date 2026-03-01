export const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  if (v.length > 7) v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
};

export const maskCurrency = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v === '') return '';
  v = (parseInt(v, 10) / 100).toFixed(2) + '';
  v = v.replace(".", ",");
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return `R$ ${v}`;
};

export function maskPercent(value: string, maxDecimals: number = 2) {
  const raw = value;

  let v = value.replace(",", ".").replace(/[^\d.]/g, "");

  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  if (v === ".") return "0.";

  const endsWithDot = raw.endsWith(".") || raw.endsWith(",");
  let [intPart, decPart = ""] = v.split(".");

  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (endsWithDot && decPart === "") {
    const intNum = Number(intPart || "0");
    const clampedInt = Math.min(Math.max(intNum, 0), 100);
    return `${clampedInt}.`;
  }

  decPart = decPart.slice(0, maxDecimals);

  if (!intPart && !decPart) return "";

  const num = Number(`${intPart || "0"}${decPart ? "." + decPart : ""}`);
  if (!Number.isFinite(num)) return "";

  const clamped = Math.min(Math.max(num, 0), 100);

  const fixed = clamped.toFixed(maxDecimals);
  return fixed.replace(/\.?0+$/, "");
}

export const MAX_CAPITAL_CENTS = 30000000;

export function currencyToCents(value: string) {
  return Number(value.replace(/\D/g, ""));
}

export function centsToCurrency(value: number) {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function maskDigitsOnly(value: string, maxLen?: number) {
  let v = value.replace(/\D/g, "");
  if (typeof maxLen === "number") v = v.slice(0, maxLen);
  return v;
}

export function maskInteger(value: string, maxDigits: number = 9) {
  const digits = maskDigitsOnly(value, maxDigits);
  if (!digits) return "";
  return new Intl.NumberFormat("pt-BR").format(Number(digits));
}

export function clampCurrency(value: string, maxCents: number) {
  const cents = currencyToCents(value);
  const clamped = Math.min(cents, maxCents);
  return centsToCurrency(clamped);
}

export const CAPITAL_MAX_CENTS = MAX_CAPITAL_CENTS;
export const capitalPlaceholder = `Ex: até ${centsToCurrency(CAPITAL_MAX_CENTS)}`;
export const MAX_MRR_CENTS = 100_000_000 * 100; // R$ 100.000.000,00
export function maskCurrencyClamped(value: string, maxCents: number) {
  let digits = value.replace(/\D/g, "");
  if (!digits) return "";

  let cents = Number(digits);
  if (!Number.isFinite(cents)) return "";

  const clamped = Math.min(cents, maxCents);

  const formatted = (clamped / 100).toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

  return `R$ ${formatted}`;
}
