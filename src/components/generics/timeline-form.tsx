import type { TimelineProps } from "@/types"
import { Check } from "lucide-react"

export default function TimelineForm({ stepTitles, highestStep, jumpToStep, step }: TimelineProps) {
  return (
    <>
      <div className="shrink-0 relative w-full bg-slate-800 h-1 sm:h-auto sm:bg-slate-900 sm:border-b sm:border-slate-800 sm:px-8 sm:py-5 z-10">

        <div
          className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500 ease-out sm:hidden"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full z-0"></div>
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1
            const isActive = step === stepNumber
            const isClickable = stepNumber <= highestStep && stepNumber !== step
            const isCompleted = stepNumber < highestStep || (stepNumber === highestStep && step > highestStep)

            return (
              <div
                key={title}
                onClick={() => (isClickable ? jumpToStep(stepNumber) : null)}
                className={`relative z-10 flex flex-col items-center gap-2 ${isClickable ? "cursor-pointer hover:-translate-y-0.5 transition-transform" : "cursor-default"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${isActive
                    ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    : isCompleted
                      ? "bg-cyan-950 border-cyan-500 text-cyan-400"
                      : "bg-slate-900 border-slate-700 text-slate-500"
                    }`}
                >
                  {isCompleted && !isActive ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${isActive ? "text-cyan-400" : isCompleted ? "text-slate-300" : "text-slate-600"}`}>
                  {title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="hidden sm:block h-1 bg-slate-800 w-full relative shadow-inner overflow-hidden shrink-0">
        <div
          className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>
    </>
  )
}