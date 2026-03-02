import { maskCurrencyClamped, maskDigitsOnly, maskInteger, maskPercent, MAX_MRR_CENTS } from "@/provider/helpers";
import type { AnyObj } from "@/types";
import { ChevronDown } from "lucide-react";

export default function StepThree({ labelBase, register, inputBase, errors, FieldError, setValue, stage, model, psfEvidence, pilotType }: AnyObj) {
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* IDEIA */}
      {stage === "Ideia" && (
        <div className="space-y-5">
          <div>
            <label className={labelBase}>Quantas entrevistas com potenciais clientes?</label>
            <input
              type="text"
              {...register("interviewsCount")}
              onChange={(e) => setValue("interviewsCount", maskDigitsOnly(e.target.value), { shouldValidate: true })}
              className={`${inputBase} ${errors?.interviewsCount ? "border-red-500" : ""}`}
              placeholder="Ex: 12"
              inputMode="numeric"
            />
            {/* <p className="text-xs text-slate-400 mt-1">Mínimo recomendado: 5 entrevistas.</p> */}
            <FieldError path="interviewsCount" />
          </div>

          <div>
            <label className={labelBase}>Qual hipótese foi validada?</label>
            <textarea
              {...register("validatedHypothesis")}
              rows={4}
              className={`${inputBase} resize-none ${errors?.validatedHypothesis ? "border-red-500" : ""}`}
              placeholder="Ex: clínicas pagariam R$X/mês para reduzir tempo de triagem em 30%."
            />
            <FieldError path="validatedHypothesis" />
          </div>

          {model === "B2C" ? (
            <div>
              <label className={labelBase}>Público / segmento</label>
              <input
                type="text"
                {...register("audience")}
                className={`${inputBase} ${errors?.audience ? "border-red-500" : ""}`}
                placeholder="Ex: estudantes de 16–22, mães de primeira viagem, devs júnior..."
              />
              <FieldError path="audience" />
            </div>
          ) : (
            <div>
              <label className={labelBase}>ICP (perfil de cliente ideal)</label>
              <input
                type="text"
                {...register("icp")}
                className={`${inputBase} ${errors?.icp ? "border-red-500" : ""}`}
                placeholder="Ex: clínicas até 10 médicos, e-commerces faturando 200k/mês..."
              />
              <FieldError path="icp" />
            </div>
          )}

          <div>
            <label className={labelBase}>Evidência do avanço (opcional)</label>
            <textarea
              {...register("ideaEvidence")}
              rows={3}
              className={`${inputBase} resize-none ${errors?.ideaEvidence ? "border-red-500" : ""}`}
              placeholder="Ex: lista de espera (200), LOI, protótipo testado com 8 usuários..."
            />
            <FieldError path="ideaEvidence" />
          </div>
        </div>
      )}

      {/* MVP */}
      {stage === "MVP" && (
        <div className="space-y-5">
          <div className="relative">
            <label className={labelBase}>Evidência de PSF (Product–Solution Fit)</label>
            <select
              {...register("psfEvidence")}
              className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
            >
              <option value="entrevistas">Entrevistas validadas</option>
              <option value="piloto_nao_pago">Piloto não pago</option>
              <option value="piloto_pago">Piloto pago</option>
              {model === "B2C" && <option value="usuarios_ativos">Usuários ativos</option>}
            </select>
            <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
            <FieldError path="psfEvidence" />
          </div>

          {(model === "B2B" || model === "B2B2C") && (psfEvidence === "piloto_nao_pago" || psfEvidence === "piloto_pago") && (
            <>
              <div className="relative">
                <label className={labelBase}>Status do piloto</label>
                <select
                  {...register("pilotType")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="planejado">Planejado</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
                <FieldError path="pilotType" />
              </div>

              <div>
                <label className={labelBase}>
                  {pilotType === "planejado" ? "Objetivo do piloto (o que você pretende validar)" : "Resumo do piloto / aprendizado"}
                </label>
                <textarea
                  {...register("pilotSummary")}
                  rows={4}
                  className={`${inputBase} resize-none ${errors?.pilotSummary ? "border-red-500" : ""}`}
                  placeholder={
                    pilotType === "planejado"
                      ? "Ex: validar disposição de pagamento (R$X/mês) e comprovar redução de tempo em 30% em 2–3 clientes."
                      : "Ex: piloto com 2 empresas; validou dor X; principal ajuste foi Y..."
                  }
                />
                <FieldError path="pilotSummary" />
              </div>
            </>
          )}

          {model === "B2C" && (
            <div className="space-y-5">
              <div>
                <label className={labelBase}>MAU (usuários ativos no mês)</label>
                <input
                  type="text"
                  {...register("mau")}
                  onChange={(e) => setValue("mau", maskInteger(e.target.value), { shouldValidate: true })}
                  className={`${inputBase} ${errors?.mau ? "border-red-500" : ""}`}
                  placeholder="Ex: 10.000"
                  inputMode="numeric"
                />
                <FieldError path="mau" />
              </div>

              <div>
                <label className={labelBase}>Canal inicial de aquisição</label>
                <input
                  type="text"
                  {...register("primaryChannel")}
                  className={`${inputBase} ${errors?.primaryChannel ? "border-red-500" : ""}`}
                  placeholder="Ex: orgânico, paid, parcerias, comunidade..."
                />
                <FieldError path="primaryChannel" />
              </div>
            </div>
          )}

          {(model === "B2B" || model === "B2B2C") && (
            <>
              <div>
                <label className={labelBase}>ICP (perfil de cliente ideal)</label>
                <input
                  type="text"
                  {...register("icp")}
                  className={`${inputBase} ${errors?.icp ? "border-red-500" : ""}`}
                  placeholder="Ex: PMEs com 20–200 funcionários, clínicas, imobiliárias..."
                />
                <FieldError path="icp" />
              </div>

              <div>
                <label className={labelBase}>ACV (ticket anual estimado)</label>
                <input
                  type="text"
                  {...register("acv")}
                  onChange={(e) =>
                    setValue(
                      "acv",
                      maskCurrencyClamped(e.target.value, MAX_MRR_CENTS),
                      { shouldValidate: true, shouldDirty: true }
                    )
                  }
                  className={`${inputBase} ${errors?.acv ? "border-red-500" : ""}`}
                  placeholder="Ex: R$ 50.000,00"
                  inputMode="numeric"
                />
                <FieldError path="acv" />
              </div>
            </>
          )}
        </div>
      )}

      {/* TRACAO */}
      {stage === "Tracao" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelBase}>MRR (Receita Recorrente Mensal)</label>
              <input
                type="text"
                {...register("mrr")}
                onChange={(e) =>
                  setValue(
                    "mrr",
                    maskCurrencyClamped(e.target.value, MAX_MRR_CENTS),
                    { shouldValidate: true, shouldDirty: true }
                  )
                }
                className={`${inputBase} ${errors?.mrr ? "border-red-500" : ""}`}
                placeholder="Ex: R$ 15.000,00"
                inputMode="numeric"
              />
              <FieldError path="mrr" />
            </div>

            <div>
              <label className={labelBase}>Crescimento (últimos 3 meses) %</label>
              <input
                type="text"
                {...register("growth3m")}
                onChange={(e) => setValue("growth3m", maskPercent(e.target.value), { shouldValidate: true })}
                className={`${inputBase} ${errors?.growth3m ? "border-red-500" : ""}`}
                placeholder="Ex: 12,5"
                inputMode="decimal"
              />
              <FieldError path="growth3m" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelBase}>Churn % (opcional)</label>
              <input
                type="text"
                {...register("churn")}
                onChange={(e) => setValue("churn", maskPercent(e.target.value), { shouldValidate: true })}
                className={`${inputBase} ${errors?.churn ? "border-red-500" : ""}`}
                placeholder="Ex: 2,3"
                inputMode="decimal"
              />
              <FieldError path="churn" />
            </div>

            {(model === "B2B" || model === "B2B2C") ? (
              <div>
                <label className={labelBase}>ACV (ticket anual)</label>
                <input
                  type="text"
                  {...register("acv")}
                  onChange={(e) =>
                    setValue(
                      "acv",
                      maskCurrencyClamped(e.target.value, MAX_MRR_CENTS),
                      { shouldValidate: true, shouldDirty: true }
                    )
                  }
                  className={`${inputBase} ${errors?.acv ? "border-red-500" : ""}`}
                  placeholder="Ex: R$ 50.000,00"
                  inputMode="numeric"
                />
                <FieldError path="acv" />
              </div>
            ) : (
              <div>
                <label className={labelBase}>MAU (usuários ativos no mês)</label>
                <input
                  type="text"
                  {...register("mau")}
                  onChange={(e) => setValue("mau", maskInteger(e.target.value), { shouldValidate: true })}
                  className={`${inputBase} ${errors?.mau ? "border-red-500" : ""}`}
                  placeholder="Ex: 10.000"
                  inputMode="numeric"
                />
                <FieldError path="mau" />
              </div>
            )}
          </div>

          {(model === "B2B" || model === "B2B2C") && (
            <div>
              <label className={labelBase}>ICP (perfil de cliente ideal)</label>
              <input
                type="text"
                {...register("icp")}
                className={`${inputBase} ${errors?.icp ? "border-red-500" : ""}`}
                placeholder="Ex: PMEs com 20–200 funcionários no setor X..."
              />
              <FieldError path="icp" />
            </div>
          )}

          <div>
            <label className={labelBase}>Canal principal de aquisição</label>
            <input
              type="text"
              {...register("primaryChannel")}
              className={`${inputBase} ${errors?.primaryChannel ? "border-red-500" : ""}`}
              placeholder="Ex: outbound, inbound, paid, parcerias, orgânico..."
            />
            <FieldError path="primaryChannel" />
          </div>
        </div>
      )}
    </div>
  )
}