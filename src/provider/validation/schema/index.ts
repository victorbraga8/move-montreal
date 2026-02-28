import z from "zod";

export const founderSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone incompleto"),
  linkedin: z.string().refine(val => val === '' || val.toLowerCase().includes('linkedin'), {
    message: "Insira um link válido do LinkedIn"
  }),
});

export const formSchema = z
  .object({
    startupName: z.string().min(2, "Obrigatório"),
    founders: z.array(founderSchema).min(1).max(3),
    model: z.enum(["B2B", "B2C", "B2B2C"]),
    acv: z.string().optional(),
    mau: z.string().optional(),
    stage: z.enum(["Ideia", "MVP", "Tracao"]),
    mrr: z.string().optional(),
    challenge: z.string().min(20),
    teamSize: z.enum(["1-5", "6-15", "16+"]),
    fullTime: z.enum(["Sim", "Nao"]),
    hasRaised: z.enum(["Sim", "Nao"]),
    raisedAmount: z.string().optional(),
    investors: z.string().optional(),
    capital: z.string().min(4),
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
  })
  .superRefine((data, ctx) => {
    if (data.stage === "Tracao" && (!data.mrr || data.mrr.length < 4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mrr"],
        message: "MRR é obrigatório para startups com Tração",
      });
    }
    if (data.hasRaised === "Sim" && (!data.raisedAmount || data.raisedAmount.length < 4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raisedAmount"],
        message: "O valor captado é obrigatório",
      });
    }
  });

export type FounderData = z.infer<typeof founderSchema>;
export type FormData = z.infer<typeof formSchema>;