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

export function maskPercent(value: string) {
  let v = value.replace(".", ",");

  v = v.replace(/[^\d,]/g, "");

  const parts = v.split(",");
  if (parts.length > 2) {
    v = parts[0] + "," + parts.slice(1).join("");
  }

  const numericValue = parseFloat(v.replace(",", "."));
  if (numericValue > 100) {
    v = "100";
  }

  return v;
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
