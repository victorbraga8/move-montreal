import {
  maskPercent,
  maskDigitsOnly,
  clampCurrency,
  MAX_CAPITAL_CENTS,
  centsToCurrency,
  CAPITAL_MAX_CENTS,
  capitalPlaceholder,
} from "@/provider/helpers";
import type { AnyObj } from "@/types";

export default function StepFive({
  labelBase,
  register,
  inputBase,
  errors,
  FieldError,
  setValue,
}: AnyObj) {
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-row gap-5">
        <div className="w-full">
          <label className={labelBase}>Capital solicitado</label>
          <input
            type="text"
            {...register("capital")}
            onChange={(e) =>
              setValue(
                "capital",
                clampCurrency(e.target.value, CAPITAL_MAX_CENTS),
                { shouldValidate: true, shouldDirty: true }
              )
            }
            className={`${inputBase} ${errors?.capital ? "border-red-500" : ""}`}
            placeholder={capitalPlaceholder}
            inputMode="numeric"
          />
          {/* <p className="text-xs text-slate-400 mt-1">
            Valor máximo permitido: {centsToCurrency(CAPITAL_MAX_CENTS)}.
          </p> */}
          <FieldError path="capital" />
        </div>

        <div className="w-full">
          <label className={labelBase}>Equity (%)</label>
          <input
            type="text"
            {...register("equity")}
            onChange={(e) =>
              setValue("equity", maskPercent(e.target.value, 2), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className={`${inputBase} ${errors?.equity ? "border-red-500" : ""}`}
            placeholder="Ex: 1.5"
            inputMode="decimal"
            autoComplete="off"
          />
          <FieldError path="equity" />
        </div>

        <div className="w-full">
          <label className={labelBase}>Runway (meses)</label>
          <input
            type="text"
            {...register("runwayMonths")}
            onChange={(e) =>
              setValue("runwayMonths", maskDigitsOnly(e.target.value, 3), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className={`${inputBase} ${errors?.runwayMonths ? "border-red-500" : ""
              }`}
            placeholder="Ex: 6"
            inputMode="numeric"
          />
          <FieldError path="runwayMonths" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-800 pt-8">
        <div className="relative">
          <label className={labelBase}>Finalidade do capital</label>
          <div className="rounded-xl border border-slate-700 bg-[#030712] p-3 h-40">
            <div className="grid grid-cols-1 gap-2 text-sm text-slate-200">
              {[
                { k: "produto", l: "Produto / Engenharia" },
                { k: "gtm", l: "GTM / Aquisição" },
                { k: "contratacao", l: "Contratação" },
                { k: "infra", l: "Infra / Ferramentas" },
                { k: "compliance", l: "Compliance / Jurídico" },
              ].map((it) => (
                <label key={it.k} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(`capitalUse.${it.k}`)}
                    className="accent-cyan-400"
                  />
                  <span>{it.l}</span>
                </label>
              ))}
            </div>
          </div>
          <FieldError path="capitalUse" />
        </div>

        <div>
          <label className={labelBase}>
            Plano de uso do capital (defesa breve)
          </label>
          <textarea
            {...register("capitalPlan")}
            rows={6}
            className={`${inputBase} resize-none h-40 ${errors?.capitalPlan ? "border-red-500" : ""
              }`}
            placeholder="Ex: Alocar parte do capital para contratar desenvolvedor sênior e acelerar o roadmap."
          />
          <FieldError path="capitalPlan" />
        </div>
      </div>
    </div>
  );
}