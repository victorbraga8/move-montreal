import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import type { FormData } from "@/types";
import { formSchema } from "@/provider/validation/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useStepForms() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [highestStep, setHighestStep] = useState(1)
  const [loadingStage, setLoadingStage] = useState<"idle" | "ai" | "crm" | "done">("idle")

  const currentStepFields: Record<number, (keyof FormData)[]> = {
    1: ["startupName", "founders"],
    2: ["model", "stage", "challenge"],
    3: ["interviewsCount", "hypothesisValidated", "psfEvidence", "pilotType", "pilotDetails", "acv", "mau", "mrr", "growth3m", "churn"],
    4: ["teamSize", "dedicationWeekly", "hasTechFounder", "hasBizFounder"],
    5: ["runwayMonths", "capital", "equity", "capitalUse", "capitalPlan", "hasRaised", "raisedAmount", "investors"],
  };

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      founders: [{ name: "", email: "", phone: "", linkedin: "" }],
      model: "B2B",
      stage: "Ideia",
      startupName: "",
      challenge: "",

      interviewsCount: "",
      hypothesisValidated: "",
      psfEvidence: undefined,
      pilotType: undefined,
      pilotDetails: "",

      acv: "",
      mau: "",
      mrr: "",
      growth3m: "",
      churn: "",

      teamSize: "1-5",
      dedicationWeekly: "40+",
      hasTechFounder: "Sim",
      hasBizFounder: "Sim",

      runwayMonths: "",
      hasRaised: "Nao",
      raisedAmount: "",
      investors: "",
      capital: "",
      equity: 0,
      capitalUse: [],
      capitalPlan: "",
    },
  });

  const { fields: founderFields, append: appendFounder, remove: removeFounder } = useFieldArray({
    control,
    name: "founders",
  })

  const formValues = watch()

  useEffect(() => {
    const savedDraft = localStorage.getItem("@moveTrackDraft")
    const savedStep = localStorage.getItem("@moveTrackStep")
    const savedHighest = localStorage.getItem("@moveTrackHighestStep")

    if (savedDraft) {
      try {
        reset(JSON.parse(savedDraft))
      } catch (e) {
        console.error("Erro ao recuperar rascunho", e)
      }
    }
    if (savedStep) setStep(parseInt(savedStep, 10))
    if (savedHighest) setHighestStep(parseInt(savedHighest, 10))
  }, [reset])

  useEffect(() => {
    localStorage.setItem("@moveTrackStep", step.toString())
    localStorage.setItem("@moveTrackHighestStep", highestStep.toString())
  }, [step, highestStep])

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("@moveTrackDraft", JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    // Limpeza reativa por estágio
    if (formValues.stage === "Ideia") {
      clearErrors(["acv", "mau", "mrr", "growth3m", "churn", "psfEvidence", "pilotType", "pilotDetails"]);
      setValue("acv", "", { shouldDirty: true, shouldValidate: false });
      setValue("mau", "", { shouldDirty: true, shouldValidate: false });
      setValue("mrr", "", { shouldDirty: true, shouldValidate: false });
      setValue("growth3m", "", { shouldDirty: true, shouldValidate: false });
      setValue("churn", "", { shouldDirty: true, shouldValidate: false });
      setValue("psfEvidence", undefined as any, { shouldDirty: true, shouldValidate: false });
      setValue("pilotType", undefined as any, { shouldDirty: true, shouldValidate: false });
      setValue("pilotDetails", "", { shouldDirty: true, shouldValidate: false });
    }

    if (formValues.stage === "MVP") {
      clearErrors(["mrr", "growth3m", "churn"]);
      setValue("mrr", "", { shouldDirty: true, shouldValidate: false });
      setValue("growth3m", "", { shouldDirty: true, shouldValidate: false });
      setValue("churn", "", { shouldDirty: true, shouldValidate: false });
    }

    if (formValues.stage === "Tracao") {
      clearErrors(["interviewsCount", "hypothesisValidated", "pilotType", "pilotDetails"]);
      setValue("interviewsCount", "", { shouldDirty: true, shouldValidate: false });
      setValue("hypothesisValidated", "", { shouldDirty: true, shouldValidate: false });
      setValue("pilotType", undefined as any, { shouldDirty: true, shouldValidate: false });
      setValue("pilotDetails", "", { shouldDirty: true, shouldValidate: false });
    }

    // Limpeza reativa por modelo
    if (formValues.model !== "B2C") {
      clearErrors("mau");
      setValue("mau", "", { shouldDirty: true, shouldValidate: false });
    }
    if (formValues.model === "B2C") {
      clearErrors("acv");
      setValue("acv", "", { shouldDirty: true, shouldValidate: false });
    }

    // Histórico de captação
    if (formValues.hasRaised !== "Sim") {
      clearErrors("raisedAmount");
      setValue("raisedAmount", "", { shouldDirty: true, shouldValidate: false });
      setValue("investors", "", { shouldDirty: true, shouldValidate: false });
    }
  }, [formValues.stage, formValues.model, formValues.hasRaised, clearErrors, setValue]);

  const handleNextStep = async () => {
    const isStepValid = await trigger(currentStepFields[step], { shouldFocus: true })
    if (isStepValid) {
      const next = step + 1
      setStep(next)
      if (next > highestStep) setHighestStep(next)
    } else {
      toast.error("Preencha os campos obrigatórios corretamente.")
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const jumpToStep = async (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep)
      return
    }

    if (targetStep <= highestStep) {
      const isCurrentStepValid = await trigger(currentStepFields[step], { shouldFocus: true })
      if (isCurrentStepValid) {
        setStep(targetStep)
      } else {
        toast.error("Corrija os erros antes de avançar.")
      }
    }
  }

  const onSubmitForm = async (data: FormData) => {
    try {
      const finalData = { ...data }
      if (finalData.hasRaised !== "Sim") {
        delete finalData.raisedAmount
        delete finalData.investors
      }

      setLoadingStage("ai")

      let analiseIA = "";
      let scoreIA: number | null = null;

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Chave VITE_GEMINI_API_KEY ausente.");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
          Você é um avaliador do programa MoVe (Montreal Ventures). Sua função é fazer TRIAGEM operacional e pragmática de inscrições.
          Você NÃO é um "VC genérico". Você deve avaliar elegibilidade e aderência ao programa, qualidade do sinal (PSF), capacidade de execução e clareza do uso do capital.
          Seja direto, firme e útil. Sem floreio.

          REGRAS DO PROGRAMA (use como critério):
          - Early-stage com solução digital/tech e potencial de escala.
          - Preferência por MVP/validação e sinais de Product-Solution Fit.
          - Dedicação mínima de 10h/semana.

          DADOS DA STARTUP:
          - Nome: ${finalData.startupName}
          - Modelo: ${finalData.model} ${finalData.acv ? `(ACV: ${finalData.acv})` : ''} ${finalData.mau ? `(MAU: ${finalData.mau})` : ''}
          - Estágio: ${finalData.stage}
          - Problema/Solução (declaração): "${finalData.challenge}"

          MATURIDADE (CONDICIONAL AO ESTÁGIO):
          - Entrevistas: ${finalData.interviewsCount || "-"}
          - Hipótese validada: ${finalData.hypothesisValidated || "-"}
          - Evidência PSF: ${finalData.psfEvidence || "-"}
          - Piloto: ${finalData.pilotType || "-"} | ${finalData.pilotDetails || "-"}
          - MRR: ${finalData.mrr || "-"}
          - Crescimento 3m (%): ${finalData.growth3m || "-"}
          - Churn (%): ${finalData.churn || "-"}

          OPERAÇÃO:
          - Time: ${finalData.teamSize}
          - Dedicação semanal: ${finalData.dedicationWeekly}
          - Founder técnico: ${finalData.hasTechFounder}
          - Founder de negócio (GTM/Vendas): ${finalData.hasBizFounder}
          - Fundadores: ${finalData.founders.map(f => f.name).join(", ")}

          CAPTAÇÃO:
          - Runway (meses): ${finalData.runwayMonths}
          - Valor solicitado: ${finalData.capital} por ${finalData.equity}% de equity
          - Uso do capital: ${(finalData.capitalUse || []).join(", ") || "-"}
          - Plano (defesa): "${finalData.capitalPlan || "-"}"
          - Histórico: ${finalData.hasRaised === 'Sim' ? `Já captou ${finalData.raisedAmount} (Investidores: ${finalData.investors || 'Não informado'})` : 'Bootstrapped / primeira captação'}

          SAÍDA (use MARKDOWN e exatamente estes blocos):
          1) ELEGIBILIDADE (SIM/NAO + 1 linha)
          2) PSF / MATURIDADE (o que é evidência vs. narrativa)
          3) EXECUÇÃO (time, dedicação, gargalos)
          4) USO DO CAPITAL (se faz sentido para o estágio)
          5) RED FLAGS (lista objetiva)
          6) PARECER: GO / MAYBE / NO-GO (1 linha)
          7) PRÓXIMAS PERGUNTAS (até 6 bullets para entrevista)
        `;

        const result = await model.generateContent(prompt);
        analiseIA = result.response.text();

        const scoreMatch = analiseIA.match(/SCORE:\s*(\d+)/i);
        if (scoreMatch && scoreMatch[1]) {
          scoreIA = Number(scoreMatch[1]);
        }
      } catch (iaError) {
        analiseIA = "Análise da IA indisponível no momento devido a um erro de comunicação com o servidor.";
      }

      setLoadingStage("crm")

      try {
        const fundadoresTexto = finalData.founders
          .map(f => `${f.name} (${f.email} | ${f.phone} | ${f.linkedin || 'Sem LinkedIn'})`)
          .join("\n");

        const modeloExpandido = `${finalData.model} ${finalData.model === 'B2B' && finalData.acv ? `- ACV: ${finalData.acv}` : finalData.model === 'B2C' && finalData.mau ? `- MAU: ${finalData.mau}` : ''}`;
        const capitalExpandido = `${finalData.capital} ${finalData.hasRaised === 'Sim' ? `(Já captou antes: ${finalData.raisedAmount})` : '(Primeira captação)'}`;

        const fieldsPayload: any = {
          "Startup": finalData.startupName,
          "Modelo": modeloExpandido,
          "Estágio": finalData.stage,
          "Capital": capitalExpandido,
          "Equity": Number(finalData.equity),
          "Fundadores": fundadoresTexto,
          "Desafio": finalData.challenge,
          "Análise IA": analiseIA
        };

        if (scoreIA !== null) {
          fieldsPayload["Score"] = scoreIA;
        }

        const airtableBody = {
          records: [
            {
              fields: fieldsPayload
            }
          ]
        };

        const airtableUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_TABLE_NAME}`;

        const response = await fetch(airtableUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(airtableBody)
        });

        if (!response.ok) {
          throw new Error("Falha ao salvar no Airtable");
        }
      } catch (airtableError) {
        throw airtableError;
      }

      setLoadingStage("done")
      await new Promise(resolve => setTimeout(resolve, 800))

      toast.success("Inscrição enviada!", {
        description: "Tudo certo — recebemos sua inscrição e iniciaremos a avaliação.",
        position: "top-center",
        duration: 4500,
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
        action: {
          label: "OK",
          onClick: () => { },
        },
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
      })

      localStorage.removeItem("@moveTrackDraft")
      localStorage.removeItem("@moveTrackStep")
      localStorage.removeItem("@moveTrackHighestStep")

      reset({
        founders: [{ name: "", email: "", phone: "", linkedin: "" }],
        model: "B2B",
        stage: "Ideia",
        startupName: "",
        challenge: "",

        interviewsCount: "",
        hypothesisValidated: "",
        psfEvidence: undefined as any,
        pilotType: undefined as any,
        pilotDetails: "",

        acv: "",
        mau: "",
        mrr: "",
        growth3m: "",
        churn: "",

        teamSize: "1-5",
        dedicationWeekly: "40+",
        hasTechFounder: "Sim",
        hasBizFounder: "Sim",

        runwayMonths: "",
        hasRaised: "Nao",
        raisedAmount: "",
        investors: "",
        capital: "",
        equity: 0,
        capitalUse: [],
        capitalPlan: "",
      })

      setStep(1)
      setHighestStep(1)

    } catch (e) {
      toast.error("Falha no envio", {
        description: "Não foi possível enviar agora. Tente novamente.",
        action: {
          label: "Fechar",
          onClick: () => { },
        },
      })
    } finally {
      setLoadingStage("idle")
      setIsModalOpen(false)
    }
  }

  return {
    isModalOpen,
    setIsModalOpen,
    step,
    highestStep,
    loadingStage,
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
  }
}