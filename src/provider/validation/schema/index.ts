import z from "zod";

export const founderSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone incompleto"),
  linkedin: z
    .string()
    .trim()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const v = val.toLowerCase();
      return v.startsWith("http") && v.includes("linkedin.com") && (v.includes("/in/") || v.includes("/company/"));
    }, { message: "Insira um link válido do LinkedIn" }),
});

const capitalUseEnum = z.enum([
  "Produto",
  "GTM",
  "Contratacoes",
  "Infra",
  "Compliance",
  "Outro",
]);

export const formSchema = z
  .object({
    startupName: z.string().min(2, "Obrigatório"),
    founders: z.array(founderSchema).min(1, "Informe pelo menos 1 founder").max(3, "Máximo 3 founders"),

    model: z.enum(["B2B", "B2C", "B2B2C"]),
    stage: z.enum(["Ideia", "MVP", "Tracao"]),
    challenge: z.string().min(40, "Explique melhor (mín. 40 caracteres)"),

    // Etapa mutável (maturidade)
    interviewsCount: z.string().optional(), // digits
    hypothesisValidated: z.string().optional(),

    psfEvidence: z.enum(["entrevistas", "piloto_nao_pago", "piloto_pago", "usuarios_ativos", "Outro"]).optional(),
    pilotType: z.enum(["nao_iniciado", "concluido"]).optional(),
    pilotDetails: z.string().optional(),

    acv: z.string().optional(),
    mau: z.string().optional(),
    mrr: z.string().optional(),
    growth3m: z.string().optional(), // percent string
    churn: z.string().optional(), // percent string

    // Operação
    teamSize: z.enum(["1-5", "6-15", "16+"]),
    dedicationWeekly: z.enum(["<10", "10-20", "20-40", "40+"]),
    hasTechFounder: z.enum(["Sim", "Nao"]),
    hasBizFounder: z.enum(["Sim", "Nao"]),

    // Captação
    runwayMonths: z.string().min(1, "Obrigatório"),
    capital: z.string().min(4, "Obrigatório"),
    equity: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          const parsed = parseFloat(val.replace(",", "."));
          return isNaN(parsed) ? 0 : parsed;
        }
        return Number(val);
      },
      z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%")
    ),
    capitalUse: z.array(capitalUseEnum).min(1, "Selecione pelo menos 1 opção"),
    capitalPlan: z.string().min(120, "Explique melhor (mín. 120 caracteres)").max(1200, "Máximo 1200 caracteres"),

    hasRaised: z.enum(["Sim", "Nao"]),
    raisedAmount: z.string().optional(),
    investors: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Operação: dedicação mínima 10h
    if (data.dedicationWeekly === "<10") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dedicationWeekly"],
        message: "Dedicação mínima de 10h/semana é critério do programa.",
      });
    }

    // Captação runway: só número e >0 (string com digits)
    const runwayDigits = (data.runwayMonths || "").replace(/\D/g, "");
    if (!runwayDigits || Number(runwayDigits) <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["runwayMonths"], message: "Informe em meses (ex: 4)" });
    }

    // Mutável por estágio
    if (data.stage === "Ideia") {
      const interviews = Number((data.interviewsCount || "").replace(/\D/g, ""));
      if (!interviews || interviews < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["interviewsCount"],
          message: "Para Ideia, informe ao menos 5 entrevistas (mínimo recomendado).",
        });
      }
      if (!data.hypothesisValidated || data.hypothesisValidated.trim().length < 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hypothesisValidated"],
          message: "Explique a hipótese validada (mín. 30 caracteres).",
        });
      }
    }

    if (data.stage === "MVP") {
      if (!data.psfEvidence) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["psfEvidence"],
          message: "Selecione a principal evidência de PSF.",
        });
      }
      if (data.psfEvidence === "piloto_pago") {
        if (!data.pilotType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pilotType"],
            message: "Informe se o piloto foi pago ou não.",
          });
        }
        if (!data.pilotDetails || data.pilotDetails.trim().length < 40) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pilotDetails"],
            message: "Descreva o piloto (mín. 40 caracteres).",
          });
        }
      }
      // Métrica coerente por modelo (quando não é Ideia)
      if ((data.model === "B2B" || data.model === "B2B2C") && (!data.acv || data.acv.length < 4)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["acv"],
          message: "Informe o ACV (mesmo que estimado).",
        });
      }
      if (data.model === "B2C" && (!data.mau || data.mau.replace(/\D/g, "").length < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mau"],
          message: "Informe o MAU (mesmo que estimado).",
        });
      }
    }

    if (data.stage === "Tracao") {
      if (!data.mrr || data.mrr.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mrr"],
          message: "MRR é obrigatório para Tração.",
        });
      }
      const growthNum = parseFloat((data.growth3m || "").replace(",", "."));
      if (Number.isNaN(growthNum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["growth3m"],
          message: "Informe o crescimento (ex: 12,5).",
        });
      }
      // Métrica coerente por modelo
      if ((data.model === "B2B" || data.model === "B2B2C") && (!data.acv || data.acv.length < 4)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["acv"],
          message: "Informe o ACV.",
        });
      }
      if (data.model === "B2C" && (!data.mau || data.mau.replace(/\D/g, "").length < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mau"],
          message: "Informe o MAU.",
        });
      }
    }

    // Histórico de captação
    if (data.hasRaised === "Sim" && (!data.raisedAmount || data.raisedAmount.length < 4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raisedAmount"],
        message: "O valor captado é obrigatório.",
      });
    }
  });

export type FounderData = z.infer<typeof founderSchema>;
export type FormData = z.infer<typeof formSchema>;
