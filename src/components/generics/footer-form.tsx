import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function FooterForm({ step, prevStep, isSubmitting, canProceed, handleNextStep, handleSubmit, onSubmitForm }: any) {
  return (
    <div className="shrink-0 p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex justify-between gap-3 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] sm:shadow-inner">
      {step > 1 ? (
        <Button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none justify-center px-4 sm:px-6 py-3 sm:py-4 text-slate-300 hover:text-white font-bold transition-all rounded-xl hover:bg-slate-800 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800/50 sm:bg-transparent"
        >
          Voltar
        </Button>
      ) : (
        <div className="flex-1 sm:flex-none"></div>
      )}

      {step < 5 ? (
        <Button
          type="button"
          onClick={handleNextStep}
          disabled={isSubmitting || !canProceed}
          className="flex-2 sm:flex-none flex justify-center items-center gap-2 sm:gap-3 bg-cyan-600! text-slate-950 px-6 sm:px-9 py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-cyan-400! transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-none w-full sm:w-auto"
        >
          Avançar <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleSubmit(onSubmitForm)}
          disabled={isSubmitting || !canProceed}
          className="flex-2 sm:flex-none flex justify-center items-center gap-2 sm:gap-3 bg-green-500! text-slate-950 px-6 sm:px-9 py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-green-400! transition-all shadow-lg hover:shadow-[0_8px_30px_rgba(34,197,94,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-none w-full sm:w-auto"
        >
          {isSubmitting ? "Enviando..." : "Concluir"}
          {isSubmitting ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          )}
        </Button>
      )}
    </div>
  )
}