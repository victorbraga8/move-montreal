
export const faqs = [
  { q: "A quem se destina o MOVE?", a: "Startups em estágio inicial (Early Stage) com foco B2B ou B2B2C, que já possuam MVP validado no mercado." },
  { q: "Qual o valor do investimento?", a: "Até R$ 300k, estruturado estrategicamente através de um modelo SAFE." },
  { q: "Preciso ter dedicação exclusiva?", a: "Sim, buscamos founders que estejam 100% dedicados para garantir a velocidade máxima de tração." },
  { q: "Como funciona a seleção inteligente?", a: "Nossa IA faz a primeira triagem do seu pitch. Depois, passamos por entrevistas e comitê final de aprovação." }
];

export const stepTitles = ["Identificação", "O Negócio", "Progresso", "Operação", "Captação"];

export const stepFields: Record<number, any[]> = {
  1: ['startupName', 'founders'],
  2: ['model', 'stage', 'mrr', 'challenge'],
  3: ['teamSize', 'fullTime'],
  4: ['capital', 'equity'],
};
