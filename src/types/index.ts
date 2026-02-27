import type { formSchema } from "@/provider/validation/schema";
import type z from "zod";

export interface ModalProps {
  setIsModalOpen: (open: boolean) => void
  isModalOpen?: boolean
}

export type FormData = z.infer<typeof formSchema>;