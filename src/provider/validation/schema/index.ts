import z from "zod";

export const founderSchema = z.object({
  name: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z.string().min(14, "Telefone incompleto"),
  linkedin: z
    .string()
    .trim()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const v = val.toLowerCase();
      return (
        v.startsWith("http") &&
        v.includes("linkedin.com") &&
        (v.includes("/in/") || v.includes("/company/"))
      );
    }, { message: "Insira um link válido do LinkedIn" }),
});

const verticalEnum = z.enum([
  "AI",
  "GovTech",
  "FinTech",
  "IdTech",
  "Cybersecurity",
  "IoT",
  "HealthTech",
  "Ecommerce",
  "Logistics",
  "Climate",
  "Outros",
]);

const psfEvidenceEnum = z.enum([
  "entrevistas",
  "piloto_nao_pago",
  "piloto_pago",
  "usuarios_ativos",
]);

const pilotTypeEnum = z.enum(["planejado", "em_andamento", "concluido"]);

const capitalUseSchema = z.object({
  produto: z.boolean().optional(),
  gtm: z.boolean().optional(),
  contratacao: z.boolean().optional(),
  infra: z.boolean().optional(),
  compliance: z.boolean().optional(),
}).default({});

const parsePercent = (v: unknown) => {
  if (typeof v !== "string") return NaN;
  const s = v.trim().replace("%", "").replace(",", ".");
  if (!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

const parseMoney = (v: unknown) => {
  if (typeof v !== "string") return NaN;
  const s = v.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  if (!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

const digitsOnly = (v: unknown) => {
  if (typeof v !== "string") return "";
  return v.replace(/\D/g, "");
};

export const formSchema = z
  .object({
    // Step 1
    startupName: z.string().min(2, "Informe o nome da startup"),
    vertical: verticalEnum,
    verticalOther: z.string().optional(),
    founders: z
      .array(founderSchema)
      .min(1, "Informe pelo menos 1 founder")
      .max(3, "Máximo de 3 founders"),

    // Step 2
    model: z.enum(["B2B", "B2C", "B2B2C"]),
    stage: z.enum(["Ideia", "MVP", "Tracao"]),
    targetCustomer: z.string().min(6, "Explique quem é seu cliente-alvo (mín. 6 caracteres)"),
    painUrgency: z.string().min(20, "Explique a dor e urgência (mín. 20 caracteres)"),
    valueProp: z.string().min(20, "Explique sua proposta de valor (mín. 20 caracteres)"),
    // alternatives: z.string().min(15, "Explique as alternativas atuais (mín. 15 caracteres)"),

    // Step 3 (mutável por Stage + Model)
    interviewsCount: z.string().optional(),
    validatedHypothesis: z.string().optional(),
    ideaEvidence: z.string().optional(),
    icp: z.string().optional(),
    audience: z.string().optional(),

    psfEvidence: psfEvidenceEnum.optional(),
    pilotType: pilotTypeEnum.optional(),
    pilotSummary: z.string().optional(),

    acv: z.string().optional(),
    mau: z.string().optional(),
    mrr: z.string().optional(),
    growth3m: z.string().optional(),
    churn: z.string().optional(),
    primaryChannel: z.string().optional(),

    // Step 4
    weeklyDedication: z.enum(["<10", "10-20", "20-40", "40+"]),
    teamComposition: z.enum(["solo", "tecnico", "comercial", "complementar"]),
    executionBottleneck: z.string().min(15, "Explique seu gargalo atual (mín. 15 caracteres)"),

    // Step 5
    runwayMonths: z.string().min(1, "Informe o runway em meses"),
    capital: z.string().min(4, "Informe o valor solicitado"),
    equity: z.string().min(1, "Informe o equity (ex: 2,5)"),
    capitalUse: capitalUseSchema,
    capitalPlan: z
      .string()
      .min(120, "Explique como você usaria o capital (mín. 120 caracteres)")
      .max(1200, "Máximo de 1200 caracteres"),
  })
  .superRefine((data, ctx) => {
    // Vertical outros
    if (data.vertical === "Outros") {
      if (!data.verticalOther || data.verticalOther.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verticalOther"],
          message: "Descreva sua área (mín. 3 caracteres).",
        });
      }
    }

    // Dedicação mínima
    if (data.weeklyDedication === "<10") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weeklyDedication"],
        message: "O programa exige dedicação mínima de 10h/semana.",
      });
    }

    // Runway: apenas número e >0
    const runway = Number(digitsOnly(data.runwayMonths));
    if (!runway || runway <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["runwayMonths"],
        message: "Informe em meses (ex: 6).",
      });
    }

    // Capital: precisa ser >0
    const cap = parseMoney(data.capital);
    if (!Number.isFinite(cap) || cap <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capital"],
        message: "Informe um valor válido (ex: R$ 200.000,00).",
      });
    }

    // Equity: 0..100 aceita decimal
    const eq = parsePercent(data.equity);
    if (!Number.isFinite(eq)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["equity"],
        message: "Informe o equity (ex: 1,4).",
      });
    } else if (eq < 0 || eq > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["equity"],
        message: "Equity deve estar entre 0 e 100 (ex: 2,5).",
      });
    }

    // Capital use: ao menos 1 marcado
    const cu = data.capitalUse || {};
    const anyUse = Boolean(cu.produto || cu.gtm || cu.contratacao || cu.infra || cu.compliance);
    if (!anyUse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capitalUse"],
        message: "Selecione ao menos 1 opção de uso do capital.",
      });
    }

    // Step 3 - por Stage + Model
    if (data.stage === "Ideia") {
      const interviews = Number(digitsOnly(data.interviewsCount || ""));
      if (!interviews) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["interviewsCount"],
          message: "Informe o número de entrevistas (ex: 12).",
        });
      } else if (interviews < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["interviewsCount"],
          message: "Para Ideia, mínimo recomendado: 5 entrevistas.",
        });
      }

      if (!data.validatedHypothesis || data.validatedHypothesis.trim().length < 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["validatedHypothesis"],
          message: "Explique a hipótese validada (mín. 30 caracteres).",
        });
      }

      if (data.model === "B2C") {
        if (!data.audience || data.audience.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["audience"],
            message: "Descreva o público/segmento (mín. 10 caracteres).",
          });
        }
      } else {
        if (!data.icp || data.icp.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["icp"],
            message: "Descreva seu ICP (mín. 10 caracteres).",
          });
        }
      }
    }

    if (data.stage === "MVP") {
      if (!data.psfEvidence) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["psfEvidence"],
          message: "Selecione a principal evidência de maturidade (PSF).",
        });
      }

      if (data.model === "B2C") {
        const mau = Number(digitsOnly(data.mau || ""));
        if (!mau) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mau"],
            message: "Informe o MAU (mesmo que estimado).",
          });
        }
        if (!data.primaryChannel || data.primaryChannel.trim().length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["primaryChannel"],
            message: "Informe o canal inicial (ex: orgânico, paid, parcerias).",
          });
        }
      } else {
        const acv = parseMoney(data.acv || "");
        if (!Number.isFinite(acv) || acv <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["acv"],
            message: "Informe o ACV (mesmo que estimado).",
          });
        }
        const isPilotEvidence = data.psfEvidence === "piloto_nao_pago" || data.psfEvidence === "piloto_pago";

        if (isPilotEvidence) {
          if (!data.pilotType) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pilotType"],
              message: "Informe o status do piloto.",
            });
          }

          const summaryMin = data.pilotType === "planejado" ? 30 : 40;
          const summaryMsg =
            data.pilotType === "planejado"
              ? "Descreva o objetivo do piloto (mín. 30 caracteres)."
              : "Descreva o piloto/aprendizado (mín. 40 caracteres).";

          if (!data.pilotSummary || data.pilotSummary.trim().length < summaryMin) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pilotSummary"],
              message: summaryMsg,
            });
          }
        }
        if (!data.icp || data.icp.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["icp"],
            message: "Descreva seu ICP (mín. 10 caracteres).",
          });
        }
      }
    }

    if (data.stage === "Tracao") {
      const mrr = parseMoney(data.mrr || "");
      if (!Number.isFinite(mrr) || mrr <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mrr"],
          message: "MRR é obrigatório para Tração.",
        });
      }
      const growth = parsePercent(data.growth3m || "");
      if (!Number.isFinite(growth)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["growth3m"],
          message: "Informe o crescimento (ex: 12,5).",
        });
      }
      if (!data.primaryChannel || data.primaryChannel.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["primaryChannel"],
          message: "Informe o canal principal de aquisição.",
        });
      }

      if (data.model === "B2C") {
        const mau = Number(digitsOnly(data.mau || ""));
        if (!mau) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mau"],
            message: "Informe o MAU.",
          });
        }
      } else {
        const acv = parseMoney(data.acv || "");
        if (!Number.isFinite(acv) || acv <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["acv"],
            message: "Informe o ACV.",
          });
        }
        if (!data.icp || data.icp.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["icp"],
            message: "Descreva seu ICP (mín. 10 caracteres).",
          });
        }
      }
    }
  });

export type FormData = z.infer<typeof formSchema>;
