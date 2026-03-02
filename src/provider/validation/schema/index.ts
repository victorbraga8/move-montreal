import z from "zod";

export const founderSchema = z.object({
  name: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z.string().min(14, "Telefone incompleto"),
  linkedin: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const v = val.toLowerCase();
        return (
          v.startsWith("http") &&
          v.includes("linkedin.com") &&
          (v.includes("/in/") || v.includes("/company/"))
        );
      },
      { message: "Insira um link válido do LinkedIn" }
    ),
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

const teamSizeEnum = z.enum(["1", "1-2", "2-3", "4-6", "7-10", "11+"]);



const parseMoney = (v: string) => {
  const digits = String(v || "").replace(/\D/g, "");
  if (!digits) return NaN;
  const cents = Number(digits);
  if (!Number.isFinite(cents)) return NaN;
  return cents / 100;
};

const parsePercent = (v: string) => {
  const s = String(v || "").replace(",", ".").replace(/[^\d.]/g, "");
  if (!s) return NaN;
  const n = Number(s);
  if (!Number.isFinite(n)) return NaN;
  return n;
};

const digitsOnly = (v: string) => String(v || "").replace(/\D/g, "");
const fullTimeEnum = z.enum(["Sim", "Nao"]);
const hasRaisedEnum = z.enum(["Sim", "Nao"]);
export const formSchema = z
  .object({
    startupName: z.string().min(2, "Informe o nome da startup"),
    vertical: verticalEnum,
    verticalOther: z.string().optional(),
    founders: z.array(founderSchema).min(1, "Informe pelo menos 1 founder").max(3, "Máximo de 3 founders"),
    model: z.enum(["B2B", "B2C", "B2B2C"]),
    stage: z.enum(["Ideia", "MVP", "Tracao"]),
    targetCustomer: z.string().min(6, "Explique quem é seu cliente-alvo (mín. 6 caracteres)"),
    painUrgency: z.string().min(20, "Explique urgência atendida (mín. 20 caracteres)"),
    valueProp: z.string().min(20, "Explique sua proposta de valor (mín. 20 caracteres)"),
    interviewsCount: z.string().optional(),
    validatedHypothesis: z.string().optional(),
    ideaEvidence: z.string().optional(),
    icp: z.string().optional(),
    audience: z.string().optional(),
    psfEvidence: psfEvidenceEnum.optional(),
    pilotType: pilotTypeEnum.optional(),
    pilotSummary: z.string().optional(),
    mau: z.string().optional(),
    acv: z.string().optional(),
    mrr: z.string().optional(),
    growth3m: z.string().optional(),
    churn: z.string().optional(),
    primaryChannel: z.string().optional(),
    weeklyDedication: z.enum(["<10", "10-20", "20-40", "40+", "Full time"]),
    teamComposition: z.enum(["solo", "tecnico", "comercial", "complementar"]),
    teamSize: teamSizeEnum.optional(),
    fullTime: fullTimeEnum.default("Sim"),
    hasRaised: hasRaisedEnum.default("Nao"),
    raisedAmount: z.string().optional().default(""),
    investors: z.string().optional().default(""),
    // "challenge" is referenced in the AI prompt/export, but the current UI
    // doesn't collect it. Keep it optional to avoid blocking navigation/submit.
    challenge: z.string().trim().max(2000, "Máximo de 2000 caracteres.").optional().default(""),
    executionBottleneck: z.string().min(15, "Explique seu gap atual (mín. 15 caracteres)"),
    runwayMonths: z.string().min(1, "Informe o runway em meses"),
    capital: z.string().min(1, "Informe o capital solicitado"),
    equity: z.string().min(1, "Informe o equity (%)"),
    capitalUse: z
      .object({
        produto: z.boolean().optional(),
        gtm: z.boolean().optional(),
        contratacao: z.boolean().optional(),
        infra: z.boolean().optional(),
        compliance: z.boolean().optional(),
      })
      .optional(),
    capitalPlan: z.string().min(20, "Explique o plano de uso do capital (mín. 20 caracteres)"),
  })
  .superRefine((data, ctx) => {
    if (data.vertical === "Outros") {
      if (!data.verticalOther || data.verticalOther.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verticalOther"],
          message: "Descreva sua área (mín. 3 caracteres).",
        });
      }
    }

    if (data.weeklyDedication === "<10") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weeklyDedication"],
        message: "O programa exige dedicação mínima de 10h/semana.",
      });
    }

    if (data.teamComposition !== "solo") {
      if (!data.teamSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teamSize"],
          message: "Informe o tamanho estimado do time.",
        });
      }
    }

    if (data.hasRaised === "Sim") {
      const raised = parseMoney(data.raisedAmount || "");
      if (!Number.isFinite(raised) || raised <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["raisedAmount"],
          message: "Informe o valor já captado (ex: R$ 300.000,00).",
        });
      }

      if (!data.investors || data.investors.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investors"],
          message: "Informe os investidores (mín. 3 caracteres) ou 'Não informado'.",
        });
      }
    }

    const runway = Number(digitsOnly(data.runwayMonths));
    if (!runway || runway <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["runwayMonths"],
        message: "Informe em meses (ex: 6).",
      });
    }

    const cap = parseMoney(data.capital);
    if (!Number.isFinite(cap) || cap <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capital"],
        message: "Informe um valor válido ",
      });
    }

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

    const cu = data.capitalUse || {};
    const anyUse = Boolean(cu.produto || cu.gtm || cu.contratacao || cu.infra || cu.compliance);
    if (!anyUse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capitalUse"],
        message: "Selecione ao menos 1 opção de uso do capital.",
      });
    }

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
          message: "Mínimo recomendado: 5 entrevistas.",
        });
      }

      if (!data.validatedHypothesis || data.validatedHypothesis.trim().length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["validatedHypothesis"],
          message: "Descreva a hipótese validada (mín. 20 caracteres).",
        });
      }

      if (data.model === "B2B" || data.model === "B2B2C") {
        if (!data.icp || data.icp.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["icp"],
            message: "Descreva seu ICP (mín. 10 caracteres).",
          });
        }
      }

      if (data.model === "B2C") {
        if (!data.audience || data.audience.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["audience"],
            message: "Descreva seu público-alvo (mín. 10 caracteres).",
          });
        }
      }
    }

    if (data.stage === "MVP") {
      if (!data.psfEvidence) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["psfEvidence"],
          message: "Selecione a evidência de PSF mais forte que você tem hoje.",
        });
      }

      if (data.psfEvidence === "usuarios_ativos") {
        if (data.model === "B2C") {
          const mau = Number(digitsOnly(data.mau || ""));
          if (!mau || mau <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["mau"],
              message: "Informe o MAU (ex: 10.000).",
            });
          }
        }
      }

      if (data.model === "B2B" || data.model === "B2B2C") {
        if (!data.icp || data.icp.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["icp"],
            message: "Descreva seu ICP (mín. 10 caracteres).",
          });
        }
      } else if (data.model === "B2C") {
        if (!data.audience || data.audience.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["audience"],
            message: "Descreva seu público-alvo (mín. 10 caracteres).",
          });
        }
      }

      if (data.psfEvidence === "piloto_nao_pago" || data.psfEvidence === "piloto_pago") {
        if (!data.pilotType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pilotType"],
            message: "Selecione o status do piloto.",
          });
        }

        if (!data.pilotSummary || data.pilotSummary.trim().length < 30) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pilotSummary"],
            message: "Explique o piloto/objetivo (mín. 30 caracteres).",
          });
        }
      }

      if (data.model === "B2B" || data.model === "B2B2C") {
        if (data.acv) {
          const acv = parseMoney(data.acv);
          if (!Number.isFinite(acv) || acv < 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["acv"],
              message: "Informe um ACV válido (ex: R$ 50.000,00).",
            });
          }
        }
      }
    }

    if (data.stage === "Tracao") {
      if (data.model === "B2B" || data.model === "B2B2C") {
        const mrr = parseMoney(data.mrr || "");
        if (!Number.isFinite(mrr) || mrr <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mrr"],
            message: "Informe o MRR (ex: R$ 15.000,00).",
          });
        }
      } else if (data.model === "B2C") {
        const mau = Number(digitsOnly(data.mau || ""));
        if (!mau || mau <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mau"],
            message: "Informe o MAU (ex: 10.000).",
          });
        }
      }

      const g = parsePercent(data.growth3m || "");
      if (!Number.isFinite(g)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["growth3m"],
          message: "Informe o crescimento em % (ex: 12,5).",
        });
      }

      if (!data.primaryChannel || data.primaryChannel.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["primaryChannel"],
          message: "Informe o canal principal (mín. 3 caracteres).",
        });
      }

      if (data.model === "B2B" || data.model === "B2B2C") {
        if (data.acv) {
          const acv = parseMoney(data.acv);
          if (!Number.isFinite(acv) || acv < 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["acv"],
              message: "Informe um ACV válido (ex: R$ 50.000,00).",
            });
          }
        }
      }
    }
  });

export type FormSchema = z.infer<typeof formSchema>;