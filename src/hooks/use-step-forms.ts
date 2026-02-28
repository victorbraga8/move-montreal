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
  }, [formValues.stage, clearErrors, setValue])

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

      console.log(
        "=== PAYLOAD ENVIADO PARA A API ===",
        JSON.stringify(finalData, null, 2)
      )

      let analiseIA = "";

      // ==========================================
      // 1. ANÁLISE COM IA (GEMINI) - MODO VC IMPLACÁVEL
      // ==========================================
      try {
        console.log("🧠 Processando análise executiva com IA...");
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) throw new Error("Chave VITE_GEMINI_API_KEY ausente.");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
          Você é um analista sênior e pragmático de Venture Capital avaliando startups para um comitê de financiamento.
          Sua análise deve ser FIRME, realista, crítica, direta ao ponto e sem floreios. O seu objetivo é triar os candidatos, apontar falhas lógicas e economizar o tempo dos investidores.

          DADOS DA STARTUP:
          - Nome: ${finalData.startupName}
          - Modelo: ${finalData.model}
          - Estágio: ${finalData.stage}
          - Tamanho do Time: ${finalData.teamSize} (Dedicação exclusiva: ${finalData.fullTime})
          - Captação Desejada: ${finalData.capital} em troca de ${finalData.equity}% de equity
          - MRR atual (Receita): ${finalData.mrr || "Não possui / Pré-receita"}
          - Fundadores: ${finalData.founders.map(f => f.name).join(", ")}
          
          DESAFIO E PROPOSTA DECLARADA PELOS FUNDADORES:
          "${finalData.challenge}"
          
          ESTRUTURE SUA RESPOSTA EXATAMENTE COM OS TÓPICOS ABAIXO USANDO MARKDOWN:

          ### 📝 1. Resumo Executivo
          (Máximo de 3 linhas resumindo o core business e o que a empresa busca de forma objetiva).

          ### 🟢 2. Oportunidades (Por que isso pode dar certo)
          (Liste de 1 a 3 pontos fortes realistas em bullet points. Se não houver, seja sincero e diga que os diferenciais são fracos).

          ### 🔴 3. Riscos e Red Flags (Por que isso vai falhar)
          (Seja extremamente crítico. Avalie a ingenuidade da proposta, falhas de mercado, dependências, risco do tamanho do time vs. estágio, etc. Use bullet points).

          ### 💰 4. Análise do Deal e Valuation
          (Cruze o estágio atual com o capital pedido e o equity oferecido. O fundador está pedindo muito dinheiro para um estágio muito inicial? A diluição está alta demais? Faça a matemática do valuation pré-money e diga se faz sentido).

          ### 🎯 5. Parecer de Triagem
          (Veredito claro. Inicie com uma destas três opções: [APROVAR PARA PITCH], [DILIGÊNCIA NECESSÁRIA] ou [DESCARTAR]. Justifique o motivo da decisão em uma frase forte).

          ### 📊 6. Score de Viabilidade: [SUA NOTA AQUI]/10
          (Dê uma nota fria de 0 a 10 baseada exclusivamente na atratividade do negócio para um fundo de investimento realista, considerando risco, maturidade e valuation).
        `;

        const result = await model.generateContent(prompt);
        analiseIA = result.response.text();

        console.log("✅ === ANÁLISE DA IA CONCLUÍDA ===\n", analiseIA);

      } catch (iaError) {
        console.error("❌ Falha ao gerar análise da IA (mas o fluxo continuará):", iaError);
        analiseIA = "Análise da IA indisponível no momento devido a um erro de comunicação com o servidor.";
      }

      // ==========================================
      // 2. ENVIO PARA O AIRTABLE
      // ==========================================
      try {
        console.log("🚀 Enviando dados para o Airtable...");

        // Formata o array de fundadores para um texto legível
        const fundadoresTexto = finalData.founders
          .map(f => `${f.name} (${f.email} | ${f.phone} | ${f.linkedin || 'Sem LinkedIn'})`)
          .join("\n");

        const airtableBody = {
          records: [
            {
              fields: {
                "Startup": finalData.startupName,
                "Modelo": finalData.model,
                "Estágio": finalData.stage,
                "Capital": finalData.capital,
                "Equity": Number(finalData.equity),
                "Fundadores": fundadoresTexto,
                "Desafio": finalData.challenge,
                "Análise IA": analiseIA
              }
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
          const erroDetalhado = await response.json();
          console.error("❌ Erro detalhado do Airtable:", erroDetalhado);
          throw new Error("Falha ao salvar no Airtable");
        }

        console.log("✅ === SALVO NO AIRTABLE COM SUCESSO ===");
      } catch (airtableError) {
        console.error("❌ Erro no envio para o Airtable:", airtableError);
        throw airtableError;
      }

      // ==========================================
      // 3. SUCESSO E LIMPEZA DA TELA
      // ==========================================
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
      setIsModalOpen(false)
    }
  }

  return {
    isModalOpen,
    setIsModalOpen,
    step,
    highestStep,
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