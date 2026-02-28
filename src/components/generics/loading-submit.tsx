import type { LoadingSubmitProps } from "@/types";
import { CheckCircle2 } from "lucide-react";

export default function LoadingSubmit({ loadingStage }: LoadingSubmitProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-white text-center mb-2">Processando Inscrição</h3>
        <div className="flex flex-col gap-5">
          <div className={`flex items-center gap-4 transition-opacity duration-500 ${loadingStage === 'ai' || loadingStage === 'crm' || loadingStage === 'done' ? 'opacity-100' : 'opacity-40'}`}>
            {loadingStage === 'crm' || loadingStage === 'done' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : loadingStage === 'ai' ? (
              <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${loadingStage === 'crm' || loadingStage === 'done' ? 'text-green-400' : loadingStage === 'ai' ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}>
              Processando Informações
            </span>
          </div>
          <div className={`flex items-center gap-4 transition-opacity duration-500 ${loadingStage === 'crm' || loadingStage === 'done' ? 'opacity-100' : 'opacity-40'}`}>
            {loadingStage === 'done' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : loadingStage === 'crm' ? (
              <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${loadingStage === 'done' ? 'text-green-400' : loadingStage === 'crm' ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}>
              Sincronizando MoveTrack Flow
            </span>
          </div>
          <div className={`flex items-center gap-4 transition-opacity duration-500 ${loadingStage === 'done' ? 'opacity-100' : 'opacity-40'}`}>
            {loadingStage === 'done' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 animate-in zoom-in" />
            ) : (
              <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${loadingStage === 'done' ? 'text-green-400' : 'text-slate-500'}`}>
              Finalizando inscrição...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}