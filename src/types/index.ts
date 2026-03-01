import type { useStepForms } from "@/hooks/use-step-forms";
import type { formSchema } from "@/provider/validation/schema";
import type z from "zod";

export interface ModalProps {
  setIsModalOpen: (open: boolean) => void
  isModalOpen?: boolean
}

export type ModalPropsMain = {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  stepForms: ReturnType<typeof useStepForms>
}

export type FormData = z.infer<typeof formSchema>;

export type LoadingSubmitProps = {
  loadingStage: "idle" | "ai" | "crm" | "done";
};

export interface TimelineProps {
  stepTitles: string[],
  jumpToStep: (st: number) => void,
  highestStep: number,
  step: number,
}

export type AnyObj = Record<string, any>;

export type FormStepsProps = ReturnType<typeof useStepForms>