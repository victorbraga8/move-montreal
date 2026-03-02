export const cleanStr = (v: any) => (typeof v === "string" ? v.trim() : "");

export const strOrEmpty = (v: any) => cleanStr(v);

export const strOrNA = (v: any) => {
  const s = cleanStr(v);
  return s ? s : "Não informado";
};
