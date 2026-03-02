import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { FormData } from "@/types";
import { formSchema } from "@/provider/validation/schema";
import { DRAFT_KEY } from "@/lib/move/form/constants";
import { getDefaultValues } from "@/lib/move/form/default-values";
import { loadDraft, saveDraft } from "@/lib/move/form/draft";
import { stepTitles, getCurrentStepFields } from "@/lib/move/form/steps";
import { applyPsfCleaning, applyStageModelCleaning, applyTeamCompositionCleaning } from "@/lib/move/form/cleaners";
import { runAiEvaluation } from "@/lib/move/ai/service";
import { buildAirtableFieldsPayload } from "@/lib/move/airtable/payload";
import { postToAirtable } from "@/lib/move/airtable/client";

type LoadingStage = "idle" | "ai" | "crm" | "done";

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
    defaultValues: getDefaultValues(),
  });

  const { fields: founderFields, append: appendFounder, remove: removeFounder } = useFieldArray({
    control,
    name: "founders",
  });

  const formValues = watch();

  const currentStepFields = useMemo(() => getCurrentStepFields(formValues), [formValues?.stage, formValues?.model, formValues?.psfEvidence, formValues?.teamComposition]);

  useEffect(() => {
    const draft = loadDraft<FormData>(DRAFT_KEY);
    if (draft) reset(draft);
  }, [reset]);

  useEffect(() => {
    saveDraft(DRAFT_KEY, formValues);
  }, [formValues]);

  useEffect(() => {
    applyTeamCompositionCleaning(formValues, setValue as any);
  }, [formValues?.teamComposition, setValue]);

  useEffect(() => {
    applyStageModelCleaning(formValues, setValue as any);
  }, [formValues?.stage, formValues?.model, setValue]);

  useEffect(() => {
    applyPsfCleaning(formValues, setValue as any);
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

  const onSubmitForm = async (data: FormData) => {
    // console.log("🟢 [MOVE][FORM] Payload recebido:", data);
    try {
      setLoadingStage("ai");
      // console.log("🧠 [MOVE][AI] Iniciando avaliação...");
      const ai = await runAiEvaluation(data);

      // console.log("🤖 [MOVE][AI] Resultado calculado:", {
      //   decision: ai.decision,
      //   totalScore: ai.totalScore,
      //   finalScore: ai.finalScore,
      //   confidencePct: ai.confidencePct,
      // });
      // console.log("🤖 [MOVE][AI] Memo formatado (preview):", ai.evaluation?.slice?.(0, 1200) || ai.evaluation);

      setLoadingStage("crm");
      // console.log("📤 [MOVE][AIRTABLE] Montando payload...");
      const fieldsPayload = buildAirtableFieldsPayload(data, {
        decision: ai.decision,
        totalScore: ai.totalScore,
        finalScore: ai.finalScore,
        evaluation: ai.evaluation,
      });

      // console.log("📤 [MOVE][AIRTABLE] Fields payload:", fieldsPayload);

      await postToAirtable(fieldsPayload);

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
      reset(getDefaultValues());
      setStep(1);
      setHighestStep(1);
      setIsModalOpen(false);

      // if (ai.aiRawText) console.log("🤖 [MOVE][AI] Resposta bruta:", ai.aiRawText);
    } catch (e: any) {
      toast.error("Falha no envio", {
        description: (typeof e?.message === "string" && e.message) || "Não foi possível enviar agora. Tente novamente.",
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
    } finally {
      setLoadingStage("idle");
    }
  };

  return {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    errors,
    isSubmitting,
    isModalOpen,
    setIsModalOpen,
    step,
    setStep,
    highestStep,
    setHighestStep,
    loadingStage,
    setLoadingStage,
    stepTitles,
    currentStepFields,
    founderFields,
    appendFounder,
    removeFounder,
    formValues,
    handleNextStep,
    prevStep,
    jumpToStep,
    onSubmitForm,
  };
}
