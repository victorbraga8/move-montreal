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
      alternatives: "",

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
      2: ["model", "stage", "targetCustomer", "painUrgency", "valueProp", "alternatives"],
      4: ["weeklyDedication", "teamComposition", "executionBottleneck"],
      5: ["runwayMonths", "capital", "equity", "capitalUse", "capitalPlan"],
    };

    const stage = formValues?.stage;
    const model = formValues?.model;

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
      `- Alternativas: ${data.alternatives}`,
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
      "Saída (em JSON): {summary, maturity_signals, risks, fit_score_0_100, next_questions[]}",
    ].join("\n");
  };

  const onSubmitForm = async (data: FormData) => {
    try {
      setLoadingStage("ai");

      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        toast.error("Configuração ausente", { description: "Chave da IA não configurada." });
        setLoadingStage("idle");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = buildAiPrompt(data);
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.() || "";

      setLoadingStage("done");

      toast.success("Inscrição enviada!", {
        description: "Tudo certo — recebemos sua inscrição e iniciaremos a avaliação.",
        position: "top-center",
        duration: 7000,
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
        alternatives: "",
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

      // opcional: log da IA no console pra debug
      if (text) console.log("[MOVE][AI]", text);
    } catch (e) {
      toast.error("Falha no envio", {
        description: "Não foi possível enviar agora. Tente novamente.",
        action: { label: "Fechar", onClick: () => {} },
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
