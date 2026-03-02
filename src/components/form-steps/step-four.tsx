import type { AnyObj } from "@/types";
import { ChevronDown } from "lucide-react";

export default function StepFour({
  labelBase,
  register,
  inputBase,
  errors,
  FieldError,
  teamComposition,
}: AnyObj) {
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative">
          <label className={labelBase}>Dedicação semanal</label>
          <select
            {...register("weeklyDedication")}
            className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="<10">&lt;10h</option>
            <option value="10-20">10–20h</option>
            <option value="20-40">20–40h</option>
            <option value="40+">40h+</option>
            <option value="Full time">Full time</option>
          </select>
          <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
          <p className="text-xs text-slate-400 mt-1">O programa exige dedicação mínima de 10h/semana.</p>
          <FieldError path="weeklyDedication" />
        </div>

        <div className="relative">
          <label className={labelBase}>Time</label>
          <select
            {...register("teamComposition")}
            className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="solo">Founder solo</option>
            <option value="tecnico">Time técnico</option>
            <option value="comercial">Time comercial</option>
            <option value="complementar">Time complementar (tech + comercial)</option>
          </select>
          <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
          <FieldError path="teamComposition" />
        </div>
      </div>

      {teamComposition && teamComposition !== "solo" && (
        <div className="relative">
          <label className={labelBase}>Tamanho do time (estimado)</label>
          <select
            {...register("teamSize")}
            className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="1-2">1–2 pessoas</option>
            <option value="1">1 pessoa</option>
            <option value="1-2">1–2 pessoas</option>
            <option value="2-3">2–3 pessoas</option>
            <option value="4-6">4–6 pessoas</option>
            <option value="7-10">7–10 pessoas</option>
            <option value="11+">11+ pessoas</option>
          </select>
          <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
          <p className="text-xs text-slate-400 mt-1">Founders + equipe ativa hoje.</p>
          <FieldError path="teamSize" />
        </div>
      )}

      <div>
        <label className={labelBase}>Gap de execução atual</label>
        <textarea
          {...register("executionBottleneck")}
          rows={4}
          className={`${inputBase} resize-none ${errors?.executionBottleneck ? "border-red-500" : ""}`}
          placeholder="Ex: falta de canal previsível, time pequeno, integração crítica, ciclo de venda longo..."
        />
        <FieldError path="executionBottleneck" />
      </div>
    </div>
  );
}
