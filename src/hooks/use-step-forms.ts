import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import type { FormData } from "@/types";
import { formSchema } from "@/provider/validation/schema";
import { stepFields } from "@/provider/data";

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
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      founders: [{ name: "", email: "", phone: "", linkedin: "" }],
      model: "B2B",
      stage: "Ideia",
      teamSize: "1-5",
      fullTime: "Sim",
    },
  })

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

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Inscrição enviada!", {
        description: "Tudo certo — recebemos sua inscrição e iniciaremos a avaliação.",
        position: "top-center",
        duration: 450000,
        style: {
          width: "min(92vw, 520px)",
          background:
            "linear-gradient(180deg, rgba(6,78,59,0.95) 0%, rgba(4,120,87,0.95) 100%)",
          color: "#ECFDF5",
          border: "1px solid rgba(52,211,153,0.65)",
          boxShadow:
            "0 18px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(52,211,153,0.25)",
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