import { Milestone, TrendingUp, Users, Briefcase, Lock } from "lucide-react";
export default function HeaderControl({ step }: { step: number }) {
  return (
    <div className="shrink-0">
      {step === 1 && (
        <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" /> Identificação da Startup
        </h3>
      )}
      {step === 2 && (
        <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
          <Milestone className="w-5 h-5 text-cyan-400" /> Negócio (Contexto)
        </h3>
      )}
      {step === 3 && (
        <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" /> Maturidade (por Estágio)
        </h3>
      )}
      {step === 4 && (
        <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" /> Operação
        </h3>
      )}
      {step === 5 && (
        <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" /> Captação
        </h3>
      )}
    </div>
  )
}