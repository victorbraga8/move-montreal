import { maskPhone } from "@/provider/helpers";
import type { AnyObj } from "@/types";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

export default function StepOne({ labelBase, register, inputBase, errors, FieldError, formValues, founderFields, appendFounder, setValue, removeFounder }: AnyObj) {
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div>
        <label className={labelBase}>Nome da Startup</label>
        <input
          type="text"
          {...register("startupName")}
          className={`${inputBase} ${errors?.startupName ? "border-red-500" : ""}`}
          placeholder="Ex: TechNova"
        />
        <FieldError path="startupName" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <label className={labelBase}>Área / Vertical</label>
          <select
            {...register("vertical")}
            className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="AI">AI / GenAI</option>
            <option value="GovTech">GovTech</option>
            <option value="FinTech">FinTech</option>
            <option value="IdTech">IdTech / EdTech</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="IoT">IoT / Hardware</option>
            <option value="HealthTech">HealthTech</option>
            <option value="Ecommerce">Retail / E-commerce</option>
            <option value="Logistics">Logistics / Supply Chain</option>
            <option value="Climate">Climate / Energy</option>
            <option value="Outros">Outros</option>
          </select>
          <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
          <FieldError path="vertical" />
        </div>

        {formValues?.vertical === "Outros" && (
          <div>
            <label className={labelBase}>Qual?</label>
            <input
              type="text"
              {...register("verticalOther")}
              className={`${inputBase} ${errors?.verticalOther ? "border-red-500" : ""}`}
              placeholder="Ex: AgriTech, PropTech..."
            />
            <FieldError path="verticalOther" />
          </div>
        )}
      </div>

      {founderFields?.map((field: AnyObj, index: number) => (
        <div
          key={field.id}
          className="relative p-4 sm:p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Founder {index + 1}
            </h4>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeFounder(index)}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1 font-bold">Nome Completo</label>
              <input
                type="text"
                {...register(`founders.${index}.name`)}
                className={`${inputBase} text-sm ${errors?.founders?.[index]?.name ? "border-red-500" : ""}`}
                placeholder="Ex: João Silva"
              />
              <FieldError path={`founders.${index}.name`} />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-bold">E-mail</label>
              <input
                type="email"
                {...register(`founders.${index}.email`)}
                className={`${inputBase} text-sm ${errors?.founders?.[index]?.email ? "border-red-500" : ""}`}
                placeholder="joao@technova.com"
              />
              <FieldError path={`founders.${index}.email`} />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-bold">Telefone (WhatsApp)</label>
              <input
                type="tel"
                {...register(`founders.${index}.phone`)}
                onChange={(e) => setValue(`founders.${index}.phone`, maskPhone(e.target.value), { shouldValidate: true })}
                className={`${inputBase} text-sm ${errors?.founders?.[index]?.phone ? "border-red-500" : ""}`}
                placeholder="(11) 90000-0000"
              />
              <FieldError path={`founders.${index}.phone`} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1 font-bold">LinkedIn (opcional)</label>
              <input
                type="text"
                {...register(`founders.${index}.linkedin`)}
                className={`${inputBase} text-sm ${errors?.founders?.[index]?.linkedin ? "border-red-500" : ""}`}
                placeholder="https://www.linkedin.com/in/seuperfil"
              />
              <FieldError path={`founders.${index}.linkedin`} />
            </div>
          </div>
        </div>
      ))}

      {founderFields?.length < 3 && (
        <button
          type="button"
          onClick={() => appendFounder({ name: "", email: "", phone: "", linkedin: "" })}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/20 px-4 py-3 text-sm font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800/30 transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar Founder
        </button>
      )}
    </div>
  )
}