import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import type { FormData } from "@/types";
import { formSchema } from "@/provider/validation/schema";
import { stepFields } from "@/provider/data";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useStepForms() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [highestStep, setHighestStep] = useState(1)
  const [loadingStage, setLoadingStage] = useState<"idle" | "ai" | "crm" | "done">("idle")

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
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      founders: [{ name: "", email: "", phone: "", linkedin: "" }],
      model: "B2B",
      stage: "Ideia",
      teamSize: "1-5",
      fullTime: "Sim",
      startupName: "",
      challenge: "",
      mrr: "",
      acv: "",
      mau: "",
      hasRaised: "Nao",
      raisedAmount: "",
      investors: "",
      capital: "",
      equity: 0,
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

    if (savedDraft) reset(JSON.parse(savedDraft))
    if (savedStep) setStep(parseInt(savedStep, 10))
    if (savedHighest) setHighestStep(parseInt(savedHighest, 10))
  }, [reset])

  useEffect(() => {
    if (formValues.startupName || (formValues.founders && formValues.founders[0]?.name)) {
      localStorage.setItem("@moveTrackDraft", JSON.stringify(formValues))
      localStorage.setItem("@moveTrackStep", step.toString())
      localStorage.setItem("@moveTrackHighestStep", highestStep.toString())
    }
  }, [formValues, step, highestStep])

  useEffect(() => {
    if (formValues.stage !== "Tracao") {
      clearErrors("mrr")
      setValue("mrr", "", { shouldDirty: true, shouldValidate: false })
    }
    if (formValues.hasRaised !== "Sim") {
      clearErrors("raisedAmount")
      setValue("raisedAmount", "", { shouldDirty: true, shouldValidate: false })
      setValue("investors", "", { shouldDirty: true, shouldValidate: false })
    }
  }, [formValues.stage, formValues.hasRaised, clearErrors, setValue])

  const handleNextStep = async () => {
    const isStepValid = await trigger(stepFields[step], { shouldFocus: true })
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
      const isCurrentStepValid = await trigger(stepFields[step], { shouldFocus: true })
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
      if (finalData.stage !== "Tracao") delete finalData.mrr
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
          Você é um analista sênior, implacável e pragmático de Venture Capital avaliando startups para o programa de aceleração MoVe.
          Sua análise deve ser EXTREMAMENTE FIRME, realista, crítica, direta ao ponto e sem qualquer tipo de floreio ou otimismo infundado. 
          O seu objetivo principal é triar os candidatos com rigor, apontar falhas lógicas no modelo de negócio, avaliar se a matemática do valuation faz sentido e proteger o capital e o tempo dos investidores.

          DADOS DA STARTUP:
          - Nome: ${finalData.startupName}
          - Modelo: ${finalData.model} ${finalData.model === 'B2B' && finalData.acv ? `(ACV: ${finalData.acv})` : ''} ${finalData.model === 'B2C' && finalData.mau ? `(MAU: ${finalData.mau})` : ''}
          - Estágio: ${finalData.stage}
          - Tamanho do Time: ${finalData.teamSize} (Dedicação exclusiva: ${finalData.fullTime})
          - Captação Desejada: ${finalData.capital} em troca de ${finalData.equity}% de equity
          - Histórico de Captação: ${finalData.hasRaised === 'Sim' ? `Já captou ${finalData.raisedAmount} (Investidores: ${finalData.investors || 'Não informado'})` : 'Bootstrapped (Nunca captou)'}
          - MRR atual (Receita): ${finalData.mrr || "Não possui / Pré-receita"}
          - Fundadores: ${finalData.founders.map(f => f.name).join(", ")}
          
          DESAFIO E PROPOSTA DECLARADA PELOS FUNDADORES:
          "${finalData.challenge}"
          
          ESTRUTURE SUA RESPOSTA EXATAMENTE COM OS TÓPICOS ABAIXO USANDO MARKDOWN:

          📊 SCORE: [SUA NOTA AQUI]/10

          📝 1. Resumo Executivo
          🟢 2. Oportunidades
          ⚠️ 3. Riscos e Red Flags
          💰 4. Análise do Deal e Valuation
          🎯 5. Parecer de Triagem
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
        duration: 450000,
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
        teamSize: "1-5",
        fullTime: "Sim",
        startupName: "",
        challenge: "",
        mrr: "",
        acv: "",
        mau: "",
        hasRaised: "Nao",
        raisedAmount: "",
        investors: "",
        capital: "",
        equity: 0,
      })

      setStep(1)
      setHighestStep(1)

    } catch (e) {
      toast("Falha no envio", {
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