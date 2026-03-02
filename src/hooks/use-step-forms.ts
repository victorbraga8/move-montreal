import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { FormData } from "@/types";
import { formSchema } from "@/provider/validation/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

type LoadingStage = "idle" | "ai" | "crm" | "done";

const DRAFT_KEY = "@move:form:draft:v1";

const emptyCapitalUse = {
  produto: false,
  gtm: false,
  contratacao: false,
  infra: false,
  compliance: false,
};

export function useStepForms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("idle");

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      startupName: "",
      vertical: "AI",
      verticalOther: "",
      founders: [{ name: "", email: "", phone: "", linkedin: "" }],
      model: "B2B",
      stage: "Ideia",
      targetCustomer: "",
      painUrgency: "",
      valueProp: "",
      interviewsCount: "",
      validatedHypothesis: "",
      ideaEvidence: "",
      icp: "",
      audience: "",
      psfEvidence: "entrevistas",
      pilotType: "planejado",
      pilotSummary: "",
      acv: "",
      mau: "",
      mrr: "",
      growth3m: "",
      churn: "",
      primaryChannel: "",
      weeklyDedication: "10-20",
      teamComposition: "solo",
      teamSize: undefined as any,
      executionBottleneck: "",
      runwayMonths: "",
      capital: "",
      equity: "",
      capitalUse: { ...emptyCapitalUse },
      capitalPlan: "",
    },
  });

  const { fields: founderFields, append: appendFounder, remove: removeFounder } = useFieldArray({
    control,
    name: "founders",
  });

  const formValues = watch();

  const stepTitles = useMemo(
    () => ["Identificação", "Negócio", "Maturidade", "Operação", "Captação"],
    []
  );

  const currentStepFields = useMemo((): Record<number, (keyof FormData)[]> => {
    const base: Record<number, (keyof FormData)[]> = {
      1: ["startupName", "vertical", "verticalOther", "founders"],
      2: ["model", "stage", "targetCustomer", "painUrgency", "valueProp"],
      4: ["weeklyDedication", "teamComposition", "executionBottleneck"],
      5: ["runwayMonths", "capital", "equity", "capitalUse", "capitalPlan"],
    };

    const stage = formValues?.stage;
    const model = formValues?.model;

    if (formValues?.teamComposition && formValues.teamComposition !== "solo") {
      base[4] = ["weeklyDedication", "teamComposition", "teamSize", "executionBottleneck"];
    }

    const s3: (keyof FormData)[] = [];

    if (stage === "Ideia") {
      s3.push("interviewsCount", "validatedHypothesis", "ideaEvidence");
      if (model === "B2C") s3.push("audience");
      else s3.push("icp");
    }

    if (stage === "MVP") {
      s3.push("psfEvidence");
      const psf = formValues?.psfEvidence;
      if (model === "B2C") {
        s3.push("mau", "primaryChannel");
      } else {
        s3.push("icp", "acv");
        if (psf === "piloto_nao_pago" || psf === "piloto_pago") {
          s3.push("pilotType", "pilotSummary");
        }
      }
    }

    if (stage === "Tracao") {
      s3.push("mrr", "growth3m", "primaryChannel");
      if (model === "B2C") s3.push("mau");
      else s3.push("icp", "acv");
      s3.push("churn");
    }

    base[3] = s3;
    return base;
  }, [formValues?.stage, formValues?.model, formValues?.psfEvidence]);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      reset(draft);
    } catch {
      // ignore
    }
  }, [reset]);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
  }, [formValues]);


  useEffect(() => {
    if (formValues?.teamComposition === "solo") {
      setValue("teamSize" as any, undefined as any, { shouldValidate: false, shouldDirty: true });
    }
  }, [formValues?.teamComposition, setValue]);

  // Limpeza reativa por Stage + Model (evita sujeira de campo inválido)
  useEffect(() => {
    const stage = formValues?.stage;
    const model = formValues?.model;

    if (!stage || !model) return;

    const clear = (k: keyof FormData, v: any = "") => setValue(k, v as any, { shouldValidate: false, shouldDirty: true });

    if (stage === "Ideia") {
      clear("psfEvidence", "entrevistas");
      clear("pilotType", "planejado");
      clear("pilotSummary");
      clear("acv");
      clear("mau");
      clear("mrr");
      clear("growth3m");
      clear("churn");
      clear("primaryChannel");
      if (model === "B2C") clear("icp");
      else clear("audience");
    }

    if (stage === "MVP") {
      clear("interviewsCount");
      clear("validatedHypothesis");
      clear("ideaEvidence");
      clear("mrr");
      clear("growth3m");
      clear("churn");
      if (model === "B2C") {
        clear("icp");
        clear("pilotType", "planejado");
        clear("pilotSummary");
        clear("acv");
      } else {
        clear("audience");
      }
    }

    if (stage === "Tracao") {
      clear("interviewsCount");
      clear("validatedHypothesis");
      clear("ideaEvidence");
      clear("psfEvidence", "entrevistas");
      clear("pilotType", "planejado");
      clear("pilotSummary");
      if (model === "B2C") clear("icp");
      else clear("audience");
    }
  }, [formValues?.stage, formValues?.model, setValue]);

  // Limpeza reativa por PSF (piloto só existe quando evidência = piloto)
  useEffect(() => {
    if (formValues?.stage !== "MVP") return;
    if (formValues?.model === "B2C") return;

    const isPilotEvidence = formValues?.psfEvidence === "piloto_nao_pago" || formValues?.psfEvidence === "piloto_pago";
    if (isPilotEvidence) return;

    const clear = (k: keyof FormData, v: any = "") =>
      setValue(k, v as any, { shouldValidate: false, shouldDirty: true });

    clear("pilotType", "planejado");
    clear("pilotSummary");
  }, [formValues?.stage, formValues?.model, formValues?.psfEvidence, setValue]);


  const handleNextStep = async () => {
    const fields = currentStepFields[step] || [];
    const ok = await trigger(fields as any);
    if (!ok) return;

    const next = Math.min(step + 1, stepTitles.length);
    setStep(next);
    setHighestStep((h) => Math.max(h, next));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const jumpToStep = async (st: number) => {
    if (st <= highestStep) {
      setStep(st);
      return;
    }
    // Se tentar pular pra frente, valida steps intermediários
    let cur = step;
    while (cur < st) {
      const fields = currentStepFields[cur] || [];
      const ok = await trigger(fields as any);
      if (!ok) return;
      cur += 1;
    }
    setStep(st);
    setHighestStep((h) => Math.max(h, st));
  };

  const buildAiPrompt = (data: FormData) => {
    const capitalUse = Object.entries(data.capitalUse || {})
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(", ");

    return [
      "Você é um analista de triagem do programa MoVe (Montreal Ventures), focado em startups early-stage.",
      "Objetivo: gerar um resumo objetivo e sinais de maturidade/fit para decisão de triagem.",
      "Regras: seja pragmático, aponte gaps, e não invente dados.",
      "",
      `Startup: ${data.startupName}`,
      `Vertical: ${data.vertical}${data.vertical === "Outros" ? ` (${data.verticalOther || ""})` : ""}`,
      `Modelo: ${data.model} | Estágio: ${data.stage}`,
      "",
      "Negócio:",
      `- Cliente-alvo: ${data.targetCustomer}`,
      `- Dor/urgência: ${data.painUrgency}`,
      `- Proposta de valor: ${data.valueProp}`,
      "",
      "Maturidade:",
      data.stage === "Ideia"
        ? `- Entrevistas: ${data.interviewsCount}
- Hipótese validada: ${data.validatedHypothesis}
- Evidência extra: ${data.ideaEvidence || "n/a"}
- ${data.model === "B2C" ? `Público: ${data.audience}` : `ICP: ${data.icp}`}`
        : data.stage === "MVP"
          ? `- Evidência PSF: ${data.psfEvidence}
- ${data.model === "B2C" ? `MAU: ${data.mau}
- Canal inicial: ${data.primaryChannel}` : `ICP: ${data.icp}
- Piloto: ${data.pilotType}
- Resumo: ${data.pilotSummary}
- ACV: ${data.acv}`}`
          : `- MRR: ${data.mrr}
- Growth 3m: ${data.growth3m}
- Churn: ${data.churn || "n/a"}
- Canal: ${data.primaryChannel}
- ${data.model === "B2C" ? `MAU: ${data.mau}` : `ICP: ${data.icp}
- ACV: ${data.acv}`}`,
      "",
      "Operação:",
      `- Dedicação semanal: ${data.weeklyDedication}`,
      `- Composição do time: ${data.teamComposition}`,
      `- Gargalo: ${data.executionBottleneck}`,
      "",
      "Captação:",
      `- Runway (meses): ${data.runwayMonths}`,
      `- Capital solicitado: ${data.capital}`,
      `- Equity: ${data.equity}%`,
      `- Uso do capital: ${capitalUse}`,
      `- Plano (defesa): ${data.capitalPlan}`,
      "",
      "Saída (JSON estrito, sem markdown/code fence): {",
      "  executive_summary: string (2-4 linhas, tese VC),",
      "  positives: string[] (3-7 bullets),",
      "  negatives: string[] (3-7 bullets),",
      "  red_flags: string[] (0-6 bullets),",
      "  thesis_fit: string (1-2 linhas: por que isso pode/nao pode virar venture-scale),",
      "  recommendation: \"Approve\" | \"Reject\" | \"Review\",",
      "  rationale: string (objetivo, sem floreio),",
      "  score_0_100: number,",
      "  next_questions: string[] (5-10 perguntas de diligência)",
      "}",
    ].join("\n");
  };

  const onSubmitForm = async (data: FormData) => {
    try {
      setLoadingStage("ai");

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        toast.error("Configuração ausente", { description: "Chave da IA não configurada." });
        setLoadingStage("idle");
        return;
      }

      const cleanStr = (v: any) => (typeof v === "string" ? v.trim() : "");
      const strOrEmpty = (v: any) => cleanStr(v);
      const strOrNA = (v: any) => {
        const s = cleanStr(v);
        return s ? s : "Não informado";
      };
      const moneyOrNull = (v: any) => {
        if (v === null || v === undefined) return null;
        if (typeof v === "number") return Number.isFinite(v) ? v : null;

        const digits = String(v).replace(/\D/g, "");
        if (!digits) return null;

        const cents = Number(digits);
        if (!Number.isFinite(cents)) return null;

        return cents / 100;
      };

      const numOrNull = (v: any) => {
        if (v === null || v === undefined) return null;
        if (typeof v === "number") return Number.isFinite(v) ? v : null;

        const s = String(v).trim();
        if (!s) return null;

        const normalized = s.replace(",", ".").replace(/[^\d.-]/g, "");
        if (!normalized) return null;

        const n = Number(normalized);
        return Number.isFinite(n) ? n : null;
      };

      const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

      const extractJsonCandidate = (raw: string) => {
        const t = cleanStr(raw);
        if (!t) return "";

        const m1 = t.match(/```json\s*([\s\S]*?)\s*```/i);
        if (m1?.[1]) return m1[1].trim();

        const m2 = t.match(/```([\s\S]*?)```/i);
        if (m2?.[1]) return m2[1].trim();

        const firstBrace = t.indexOf("{");
        const lastBrace = t.lastIndexOf("}");
        if (firstBrace >= 0 && lastBrace > firstBrace) return t.slice(firstBrace, lastBrace + 1).trim();

        return t;
      };

      const safeParseJson = (raw: string) => {
        const candidate = extractJsonCandidate(raw);
        if (!candidate) return null;
        try {
          return JSON.parse(candidate);
        } catch {
          return null;
        }
      };

      const allowedAiDecisions = new Set(["Approve", "Reject", "Review", "Uncategorized"]);

      const pickAiDecision = (aiText: string) => {
        const obj = safeParseJson(aiText);

        const score =
          (typeof obj?.score_0_100 === "number" && Number.isFinite(obj.score_0_100) ? obj.score_0_100 : null) ??
          (typeof obj?.fit_score_0_100 === "number" && Number.isFinite(obj.fit_score_0_100) ? obj.fit_score_0_100 : null);

        const explicitDecisionRaw =
          (typeof obj?.recommendation === "string" ? obj.recommendation.trim() : "") ||
          (typeof obj?.ai_decision === "string" ? obj.ai_decision.trim() : "") ||
          (typeof obj?.decision === "string" ? obj.decision.trim() : "");

        const isExplicit = Boolean(explicitDecisionRaw);
        const explicitDecision = explicitDecisionRaw;

        if (explicitDecision && allowedAiDecisions.has(explicitDecision)) {
          return { decision: explicitDecision, score, isExplicit };
        }

        if (score !== null) {
          if (score >= 75) return { decision: "Approve", score, isExplicit: false };
          if (score <= 45) return { decision: "Reject", score, isExplicit: false };
          return { decision: "Review", score, isExplicit: false };
        }

        return { decision: "Review", score: null as number | null, isExplicit: false };
      };

      const calcConfidence = (decision: string, score: number | null) => {
        if (score === null) return 50;
        if (decision === "Approve") return clamp(Math.round(70 + (score - 75) * 1.0), 70, 95);
        if (decision === "Reject") return clamp(Math.round(70 + (45 - score) * 1.0), 70, 95);
        return clamp(Math.round(45 + Math.abs(score - 60) * 0.6), 45, 80);
      };

      const calcFinalScore = (score: number | null, confidencePct: number) => {
        if (score === null) return null;
        const c = clamp(confidencePct, 0, 100) / 100;
        const adjusted = score * (0.7 + 0.3 * c);
        return clamp(adjusted, 0, 100);
      };

      const round1 = (n: number) => Math.round(n * 10) / 10;


      const formatAiEvaluation = (
        aiText: string,
        decision: string,
        totalScore: number | null,
        finalScore: number | null
      ) => {
        const obj = safeParseJson(aiText) || {};

        const executiveSummary =
          cleanStr(obj?.executive_summary) ||
          cleanStr(obj?.summary) ||
          cleanStr(aiText) ||
          "Análise indisponível.";

        const positives: string[] = Array.isArray(obj?.positives) ? obj.positives.filter(Boolean) : [];
        const negatives: string[] = Array.isArray(obj?.negatives) ? obj.negatives.filter(Boolean) : [];
        const redFlags: string[] = Array.isArray(obj?.red_flags) ? obj.red_flags.filter(Boolean) : [];

        const thesisFit = cleanStr(obj?.thesis_fit) || "";
        const rationale = cleanStr(obj?.rationale) || "";

        const nq: string[] = Array.isArray(obj?.next_questions) ? obj.next_questions.filter(Boolean) : [];

        const decisionLabel =
          decision === "Approve"
            ? "APPROVE"
            : decision === "Reject"
              ? "REJECT"
              : decision === "Uncategorized"
                ? "UNCATEGORIZED"
                : "REVIEW";

        const lines: string[] = [];
        lines.push("MOVE | VC Memo");
        lines.push(`Decisão: ${decisionLabel}`);
        lines.push(
          `AI Total Score: ${totalScore !== null ? `${round1(totalScore)}/100` : "N/A"} | AI Final Score: ${finalScore !== null ? `${round1(finalScore)}/100` : "N/A"
          }`
        );
        lines.push("");

        lines.push("Resumo executivo");
        lines.push(executiveSummary.trim());
        lines.push("");

        if (thesisFit) {
          lines.push("Thesis fit");
          lines.push(thesisFit.trim());
          lines.push("");
        }

        if (positives.length) {
          lines.push("Pontos positivos");
          positives.slice(0, 8).forEach((x) => lines.push(`- ${String(x).trim()}`));
          lines.push("");
        }

        if (negatives.length) {
          lines.push("Pontos negativos");
          negatives.slice(0, 8).forEach((x) => lines.push(`- ${String(x).trim()}`));
          lines.push("");
        }

        if (redFlags.length) {
          lines.push("Red flags");
          redFlags.slice(0, 8).forEach((x) => lines.push(`- ${String(x).trim()}`));
          lines.push("");
        }

        if (rationale) {
          lines.push("Justificativa");
          lines.push(rationale.trim());
          lines.push("");
        }

        lines.push("Diligência (perguntas que destravam decisão)");
        if (nq.length) nq.slice(0, 10).forEach((x) => lines.push(`- ${String(x).trim()}`));
        else {
          lines.push("- Validar ICP pagante e canal previsível (qual evidência real de compra?)");
          lines.push("- Confirmar unidade econômica (ACV/LTV, churn, ciclo de venda)");
          lines.push("- Testar se a dor é must-have vs nice-to-have");
          lines.push("- Checar risco competitivo/defensabilidade (dados, distribuição, moat)");
          lines.push("- Confirmar velocidade de execução do time (ship rate e GTM)");
        }
        lines.push("");

        lines.push("Próximo passo sugerido");
        if (decision === "Approve") lines.push("- Avançar para entrevista e checagem rápida de execução + GTM.");
        else if (decision === "Reject")
          lines.push("- Não avançar nesta rodada; sugerir re-submissão após evidência objetiva (piloto, LOI, métrica).");
        else lines.push("- Manter em REVIEW; pedir 2–3 evidências objetivas e reavaliar.");

        return lines.join("").trim();
      };
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = buildAiPrompt(data);
      const result = await model.generateContent(prompt);
      const aiRawText = result?.response?.text?.() || "";

      const { decision: aiDecision0, score: aiScore, isExplicit: isDecisionExplicit } = pickAiDecision(aiRawText);
      const aiConfidence = calcConfidence(aiDecision0, aiScore);
      const aiFinalScore = calcFinalScore(aiScore, aiConfidence);
      const aiDecision = isDecisionExplicit
        ? aiDecision0
        : aiFinalScore !== null
          ? aiFinalScore >= 75
            ? "Approve"
            : aiFinalScore <= 45
              ? "Reject"
              : "Review"
          : aiDecision0;
      const aiEvaluation = formatAiEvaluation(aiRawText, aiDecision, aiScore, aiFinalScore);

      setLoadingStage("crm");

      try {
        const modeloSelect = cleanStr((data as any).model);
        const allowedModelos = new Set(["B2B", "B2C", "B2B2C", "Marketplace", "SaaS", "Other"]);
        const modeloFinal = allowedModelos.has(modeloSelect) ? modeloSelect : modeloSelect ? "Other" : undefined;

        const verticalSelect = cleanStr((data as any).vertical) || undefined;
        const stageSelect = cleanStr((data as any).stage) || undefined;
        const psfEvidenceSelect = cleanStr((data as any).psfEvidence) || undefined;
        const pilotTypeSelect = cleanStr((data as any).pilotType) || undefined;
        const teamCompositionSelect = cleanStr((data as any).teamComposition) || undefined;
        const weeklyDedicationSelect = cleanStr((data as any).weeklyDedication) || undefined;

        const foundersArr = ((data as any).founders || []) as any[];
        const fundadoresTexto = foundersArr.length
          ? foundersArr
            .map((f) => {
              const name = cleanStr(f?.name) || "Sem nome";
              const email = cleanStr(f?.email) || "Sem email";
              const phone = cleanStr(f?.phone) || "Sem telefone";
              const linkedin = cleanStr(f?.linkedin) || "Sem LinkedIn";
              return `${name} (${email} | ${phone} | ${linkedin})`;
            })
            .join("\n")
          : "Não informado";

        const cu = (((data as any).capitalUse || {}) as Record<string, any>) || {};
        const capitalUseArray: string[] = [];
        if (cu?.contratacao) capitalUseArray.push("Hiring");
        if (cu?.gtm) capitalUseArray.push("Growth");
        if (cu?.produto) capitalUseArray.push("Product");
        if (cu?.infra) capitalUseArray.push("Other");
        if (cu?.compliance) capitalUseArray.push("Other");
        const capitalUseDeduped = Array.from(new Set(capitalUseArray));

        const capitalRequested =
          moneyOrNull((data as any).capitalRequested) ??
          moneyOrNull((data as any).capital_solicitado) ??
          moneyOrNull((data as any).capital);

        // const capitalCurrent =
        //   moneyOrNull((data as any).capitalCurrent) ??
        //   moneyOrNull((data as any).capital_current) ??
        //   null;

        if ((data as any).capital && capitalRequested === null) {
          throw new Error("Capital solicitado inválido. Revise o valor (ex: R$ 300.000,00).");
        }

        const fieldsPayload: any = {
          "Startup Name": strOrNA((data as any).startupName),

          Vertical: verticalSelect,
          "Vertical Other": strOrEmpty((data as any).verticalOther),

          Modelo: modeloFinal,
          Stage: stageSelect,

          "Target Customer": strOrNA((data as any).targetCustomer),
          "Pain & Urgency": strOrNA((data as any).painUrgency),
          "Value Proposition": strOrNA((data as any).valueProp),

          "Interviews Count": numOrNull((data as any).interviewsCount),

          "Validated Hypothesis": strOrNA((data as any).validatedHypothesis),
          "Idea Evidence": strOrNA((data as any).ideaEvidence),
          ICP: strOrNA((data as any).icp),
          Audience: strOrNA((data as any).audience),

          "PSF Evidence": psfEvidenceSelect,
          "Pilot Type": pilotTypeSelect,
          "Pilot Summary": strOrEmpty((data as any).pilotSummary),

          ACV: moneyOrNull((data as any).acv),
          MAU: numOrNull((data as any).mau),
          MRR: moneyOrNull((data as any).mrr),
          "Growth 3m (%)": numOrNull((data as any).growth3m),
          "Churn (%)": numOrNull((data as any).churn),

          "Primary Channel": strOrEmpty((data as any).primaryChannel),
          "Weekly Dedication": weeklyDedicationSelect,
          "Team Composition": teamCompositionSelect,
          "Execution Bottleneck": strOrNA((data as any).executionBottleneck),

          "Runway (months)": numOrNull((data as any).runwayMonths),

          "Capital Requested": capitalRequested,
          // Capital: capitalCurrent,
          "Equity (%)": numOrNull((data as any).equity),

          "Capital Use": capitalUseDeduped.length ? capitalUseDeduped : undefined,
          "Capital Plan": strOrNA((data as any).capitalPlan),

          Fundadores: fundadoresTexto,

          "AI Decision": allowedAiDecisions.has(aiDecision) ? aiDecision : "Review",
          "AI Total Score": aiScore !== null ? aiScore : undefined,
          "AI Final Score": aiFinalScore !== null ? round1(aiFinalScore) : undefined,
          "AI Evaluation": aiEvaluation,

          "Submitted At": new Date().toISOString(),
        };

        Object.keys(fieldsPayload).forEach((k) => {
          const v = fieldsPayload[k];
          if (v === undefined || v === null) delete fieldsPayload[k];
          if (typeof v === "string" && v.trim() === "") delete fieldsPayload[k];
          if (typeof v === "number" && Number.isNaN(v)) delete fieldsPayload[k];
          if (Array.isArray(v) && v.length === 0) delete fieldsPayload[k];
        });

        const airtableBody = { records: [{ fields: fieldsPayload }] };

        const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
        const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
        const token = import.meta.env.VITE_AIRTABLE_TOKEN;

        if (!baseId || !tableName || !token) {
          throw new Error(
            "Configuração do Airtable ausente (VITE_AIRTABLE_BASE_ID / VITE_AIRTABLE_TABLE_NAME / VITE_AIRTABLE_TOKEN)."
          );
        }

        const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

        const response = await fetch(airtableUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(airtableBody),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          const msg = err?.error?.message || err?.message || `Falha ao salvar no Airtable (${response.status})`;
          throw new Error(msg);
        }
      } catch (airtableError: any) {
        toast.error("Falha no CRM", {
          description:
            (typeof airtableError?.message === "string" && airtableError.message) ||
            "Não foi possível registrar sua inscrição agora. Tente novamente.",
          position: "top-center",
          duration: 7000,
          style: {
            width: "min(92vw, 520px)",
            background: "linear-gradient(180deg, rgba(127,29,29,0.95) 0%, rgba(153,27,27,0.95) 100%)",
            color: "#FEF2F2",
            border: "1px solid rgba(248,113,113,0.65)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(248,113,113,0.25)",
            borderRadius: "18px",
            padding: "18px 20px",
            alignItems: "center",
          },
          action: { label: "Fechar", onClick: () => { } },
          actionButtonStyle: {
            background: "rgba(239,68,68,0.28)",
            color: "#FEF2F2",
            border: "1px solid rgba(248,113,113,0.7)",
            borderRadius: "12px",
            padding: "8px 14px",
            fontWeight: 900,
            letterSpacing: "0.3px",
            cursor: "pointer",
            boxShadow: "inset 0 0 0 1px rgba(239,68,68,0.3)",
          },
        });
        setLoadingStage("idle");
        return;
      }

      setLoadingStage("done");

      toast.success("Inscrição enviada!", {
        description: "Tudo certo — recebemos sua inscrição e iniciaremos a avaliação.",
        position: "top-center",
        duration: 7000,
        style: {
          width: "min(92vw, 520px)",
          background: "linear-gradient(180deg, rgba(6,78,59,0.95) 0%, rgba(4,120,87,0.95) 100%)",
          color: "#ECFDF5",
          border: "1px solid rgba(52,211,153,0.65)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(52,211,153,0.25)",
          borderRadius: "18px",
          padding: "18px 20px",
          alignItems: "center",
        },
        action: { label: "OK", onClick: () => { } },
        actionButtonStyle: {
          background: "rgba(16,185,129,0.28)",
          color: "#ECFDF5",
          border: "1px solid rgba(52,211,153,0.7)",
          borderRadius: "12px",
          padding: "8px 14px",
          fontWeight: 900,
          letterSpacing: "0.3px",
          cursor: "pointer",
          boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.3)",
        },
      });

      localStorage.removeItem(DRAFT_KEY);

      reset({
        startupName: "",
        vertical: "AI",
        verticalOther: "",
        founders: [{ name: "", email: "", phone: "", linkedin: "" }],
        model: "B2B",
        stage: "Ideia",
        targetCustomer: "",
        painUrgency: "",
        valueProp: "",
        interviewsCount: "",
        validatedHypothesis: "",
        ideaEvidence: "",
        icp: "",
        audience: "",
        psfEvidence: "entrevistas",
        pilotType: "planejado",
        pilotSummary: "",
        acv: "",
        mau: "",
        mrr: "",
        growth3m: "",
        churn: "",
        primaryChannel: "",
        weeklyDedication: "10-20",
        teamComposition: "solo",
        executionBottleneck: "",
        runwayMonths: "",
        capital: "",
        equity: "",
        capitalUse: { ...emptyCapitalUse },
        capitalPlan: "",
      });

      setStep(1);
      setHighestStep(1);
      setLoadingStage("idle");
      setIsModalOpen(false);

      if (aiRawText) console.log("[MOVE][AI]", aiRawText);
    } catch (e) {
      toast.error("Falha no envio", {
        description: "Não foi possível enviar agora. Tente novamente.",
        position: "top-center",
        duration: 7000,
        style: {
          width: "min(92vw, 520px)",
          background: "linear-gradient(180deg, rgba(127,29,29,0.95) 0%, rgba(153,27,27,0.95) 100%)",
          color: "#FEF2F2",
          border: "1px solid rgba(248,113,113,0.65)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(248,113,113,0.25)",
          borderRadius: "18px",
          padding: "18px 20px",
          alignItems: "center",
        },
        action: { label: "Fechar", onClick: () => { } },
        actionButtonStyle: {
          background: "rgba(239,68,68,0.28)",
          color: "#FEF2F2",
          border: "1px solid rgba(248,113,113,0.7)",
          borderRadius: "12px",
          padding: "8px 14px",
          fontWeight: 900,
          letterSpacing: "0.3px",
          cursor: "pointer",
          boxShadow: "inset 0 0 0 1px rgba(239,68,68,0.3)",
        },
      });
      setLoadingStage("idle");
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    step,
    highestStep,
    loadingStage,
    stepTitles,
    register,
    handleSubmit,
    onSubmitForm,
    errors,
    isSubmitting,
    founderFields,
    appendFounder,
    removeFounder,
    formValues,
    setValue,
    handleNextStep,
    prevStep,
    jumpToStep,
  };
}
