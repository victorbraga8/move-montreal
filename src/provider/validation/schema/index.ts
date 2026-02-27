import z from "zod";

export const founderSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone incompleto"),
  linkedin: z.string().url("URL inválida").or(z.literal('')),
});

export const formSchema = z.object({
  startupName: z.string().min(2, "Obrigatório"),
  founders: z.array(founderSchema).min(1).max(3, "Máximo de 3 founders permitidos"),
  model: z.enum(['B2B', 'B2C', 'B2B2C']),
  stage: z.enum(['Ideia', 'MVP', 'Tracao']),
  mrr: z.string().optional(),
  challenge: z.string().min(20, "Detalhe um pouco mais o problema (mín. 20 caracteres)"),
  teamSize: z.enum(['1-5', '6-15', '16+']),
  fullTime: z.enum(['Sim', 'Nao']),
  capital: z.string().min(4, "Informe o valor"),
  equity: z.string().min(1, "Obrigatório"),
}).superRefine((data, ctx) => {
  if (data.stage === 'Tracao' && (!data.mrr || data.mrr.length < 4)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "MRR é obrigatório para startups com Tração",
      path: ['mrr']
    });
  }
});