import { cleanStr } from "../utils/strings";

export const mapStageToAirtable = (stage: any) => {
  const s = cleanStr(stage);
  if (!s) return undefined;
  // UI already sends "Tracao" (no accent) to match Airtable option
  return s;
};

export const mapWeeklyDedicationToAirtable = (weekly: any) => {
  const s = cleanStr(weekly);
  if (!s) return undefined;
  // UI values: "<10" | "10-20" | "20-40" | "40+"
  return s;
};

export const mapTeamCompositionToAirtable = (comp: any) => {
  const s = cleanStr(comp);
  if (!s) return undefined;
  // UI values: "solo" | "tecnico" | "comercial" | "complementar"
  return s;
};

export const mapCapitalUseToAirtable = (capitalUse: Record<string, any> | null | undefined) => {
  const cu = capitalUse || {};
  const out: string[] = [];
  // Map UI keys to Airtable multiselect options (configure these options in Airtable)
  if (cu.produto) out.push("Produto / Engenharia");
  if (cu.gtm) out.push("GTM / Aquisição");
  if (cu.contratacao) out.push("Contratação");
  if (cu.infra) out.push("Infra / Ferramentas");
  if (cu.compliance) out.push("Compliance / Jurídico");
  return Array.from(new Set(out));
};
