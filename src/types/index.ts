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