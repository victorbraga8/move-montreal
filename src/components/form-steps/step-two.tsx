import type { AnyObj } from "@/types";
import { ChevronDown } from "lucide-react";

export default function StepTwo({ labelBase, requiredFields, register, inputBase, errors, FieldError }: AnyObj) {
  const isReq = (name: string) => Array.isArray(requiredFields) && requiredFields.includes(name);
  const Star = ({ show }: { show: boolean }) => (show ? <span className="ml-1 text-amber-300">*</span> : null);
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        <div className="relative">
          <label className={labelBase}>
            Modelo <Star show={isReq("model")} />
          </label>
          <select
            {...register("model")}
            className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="B2B">B2B (Business to Business)</option>
            <option value="B2C">B2C (Business to Consumer)</option>
            <option value="B2B2C">B2B2C</option>
          </select>
          <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
          <FieldError path="model" />
        </div>

        <div className="relative">
          <label className={labelBase}>
            Estágio <Star show={isReq("stage")} />
          </label>
          <select
            {...register("stage")}
            className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="Ideia">Ideia</option>
            <option value="MVP">MVP</option>
            <option value="Tracao">Tração</option>
          </select>
          <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
          <FieldError path="stage" />
        </div>
      </div>

      <div>
        <label className={labelBase}>
          Cliente-alvo <Star show={isReq("targetCustomer")} />
        </label>
        <input
          type="text"
          {...register("targetCustomer")}
          className={`${inputBase} ${errors?.targetCustomer ? "border-red-500" : ""}`}
          placeholder="Ex: clínicas pequenas, e-commerces, órgãos públicos, RH de PMEs..."
        />
        <FieldError path="targetCustomer" />
      </div>
      <div className="grid md:grid-cols-2 gap-6 grid-cols-1">
        <div>
          <label className={labelBase}>
            Proposta de valor <Star show={isReq("valueProp")} />
          </label>
          <textarea
            {...register("valueProp")}
            rows={3}
            className={`${inputBase} resize-none ${errors?.valueProp ? "border-red-500" : ""}`}
            placeholder="Ex: automatizamos..., reduzindo custo/tempo em..., sem precisar de..."
          />
          <FieldError path="valueProp" />
        </div>
        <div>
          <label className={labelBase}>
            Urgência atendida <Star show={isReq("painUrgency")} />
          </label>
          <textarea
            {...register("painUrgency")}
            rows={3}
            className={`${inputBase} resize-none ${errors?.painUrgency ? "border-red-500" : ""}`}
            placeholder="Ex: hoje eles perdem X horas/semana com..., ou têm perda direta de receita por..."
          />
          <FieldError path="painUrgency" />
        </div>
      </div>
    </div>
  )
}