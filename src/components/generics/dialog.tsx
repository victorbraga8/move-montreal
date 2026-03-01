import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import FormSteps from "../ui/form-steps";
import type { ModalPropsMain } from "@/types";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function MainDialog({ stepForms }: ModalPropsMain) {
  return (
    <Dialog open={stepForms.isModalOpen} onOpenChange={stepForms.setIsModalOpen}>
      <DialogOverlay className="bg-[#030712]/90 backdrop-blur-md" />

      <DialogContent
        className="bg-transparent shadow-none border-0 p-0 outline-none
        w-full h-full max-h-[100dvh]
        sm:w-[92vw] sm:max-w-4xl sm:h-[90vh]
        fixed bottom-0 sm:top-[50%] sm:bottom-auto sm:-translate-y-1/2
        rounded-none sm:rounded-3xl flex flex-col
        overflow-hidden"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Triagem de Startup</DialogTitle>
          <DialogDescription>
            Formulário multi-etapas para coletar dados e avaliar maturidade, fit e riscos.
          </DialogDescription>
        </VisuallyHidden.Root>

        <FormSteps {...stepForms} />
      </DialogContent>
    </Dialog>
  )
}