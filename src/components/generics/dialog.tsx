import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import FormSteps from "../ui/form-steps";
import type { ModalPropsMain } from "@/types";

export default function MainDialog({ stepForms }: ModalPropsMain) {
  return (
    <Dialog open={stepForms.isModalOpen} onOpenChange={stepForms.setIsModalOpen}>
      <DialogOverlay className="bg-[#030712]/90 backdrop-blur-md" />
      <DialogContent
        className="bg-transparent shadow-none border-0 p-0 outline-none
          w-[96vw] sm:w-[92vw] lg:w-275 xl:w-300
          max-w-300
          h-[92vh] sm:h-[92vh]
          overflow-hidden"
      >
        <FormSteps {...stepForms} />
      </DialogContent>
    </Dialog>
  )
}