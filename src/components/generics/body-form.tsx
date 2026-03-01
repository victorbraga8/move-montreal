import { maskCurrency, maskPercent, maskPhone, maskDigitsOnly, maskInteger } from "@/provider/helpers";
import { ChevronDown, Milestone, TrendingUp, Users, Briefcase, Lock, Plus, Trash2 } from "lucide-react";
import HeaderControl from "../form-steps/header-control";
import StepOne from "../form-steps/step-one";



export default function BodyForm({
  step,
  register,
  errors,
  founderFields,
  appendFounder,
  removeFounder,
  formValues,
  setValue,
}: any) {
  const model = formValues?.model;
  const stage = formValues?.stage;

  const FieldError = ({ path }: { path: string }) => {
    const parts = path.split(".");
    let cur: any = errors;
    for (const p of parts) cur = cur?.[p];
    const msg = cur?.message;
    return msg ? <p className="text-red-400 text-xs mt-1">{msg}</p> : null;
  };

  const inputBase =
    "w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none shadow-inner transition-all";

  const labelBase = "block text-sm text-slate-300 mb-2 font-bold";

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900 p-4 sm:p-8 flex flex-col gap-6">
      <HeaderControl step={Number(step)} />
      {step === 1 && (
        <StepOne labelBase={labelBase} register={register} inputBase={inputBase} errors={errors} FieldError={FieldError} formValues={formValues} founderFields={founderFields} appendFounder={appendFounder} setValue={setValue} removeFounder={removeFounder} />
      )}
      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="relative">
              <label className={labelBase}>Modelo</label>
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
              <label className={labelBase}>Estágio</label>
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
            <label className={labelBase}>Cliente-alvo</label>
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
              <label className={labelBase}>Proposta de valor</label>
              <textarea
                {...register("valueProp")}
                rows={3}
                className={`${inputBase} resize-none ${errors?.valueProp ? "border-red-500" : ""}`}
                placeholder="Ex: automatizamos..., reduzindo custo/tempo em..., sem precisar de..."
              />
              <FieldError path="valueProp" />
            </div>
            <div>
              <label className={labelBase}>Dor e urgência</label>
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
      )}

      {/* STEP 3 (mutável por stage + model) */}
      {step === 3 && (
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
                <p className="text-xs text-slate-400 mt-1">Mínimo recomendado: 5 entrevistas.</p>
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
                  <option value="usuarios_ativos">Usuários ativos</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
                <FieldError path="psfEvidence" />
              </div>

              {(model === "B2B" || model === "B2B2C") && (
                <>
                  <div className="relative">
                    <label className={labelBase}>Tipo de piloto</label>
                    <select
                      {...register("pilotType")}
                      className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                    >
                      <option value="nao_iniciado">Ainda não iniciado</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
                    <FieldError path="pilotType" />
                  </div>

                  <div>
                    <label className={labelBase}>Resumo do piloto / aprendizado</label>
                    <textarea
                      {...register("pilotSummary")}
                      rows={4}
                      className={`${inputBase} resize-none ${errors?.pilotSummary ? "border-red-500" : ""}`}
                      placeholder="Ex: piloto com 2 empresas; validou dor X; principal ajuste foi Y..."
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
                      onChange={(e) => setValue("acv", maskCurrency(e.target.value), { shouldValidate: true })}
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
                    onChange={(e) => setValue("mrr", maskCurrency(e.target.value), { shouldValidate: true })}
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
                      onChange={(e) => setValue("acv", maskCurrency(e.target.value), { shouldValidate: true })}
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
      )}

      {/* STEP 4 */}
      {step === 4 && (
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

          <div>
            <label className={labelBase}>Maior gargalo de execução hoje</label>
            <textarea
              {...register("executionBottleneck")}
              rows={4}
              className={`${inputBase} resize-none ${errors?.executionBottleneck ? "border-red-500" : ""}`}
              placeholder="Ex: falta de canal previsível, time pequeno, integração crítica, ciclo de venda longo..."
            />
            <FieldError path="executionBottleneck" />
          </div>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex flex-row gap-5">
            <div className="w-full">
              <label className={labelBase}>Capital solicitado</label>
              <input
                type="text"
                {...register("capital")}
                onChange={(e) => setValue("capital", maskCurrency(e.target.value), { shouldValidate: true })}
                className={`${inputBase} ${errors?.capital ? "border-red-500" : ""}`}
                placeholder="Ex: R$ 200.000,00"
                inputMode="numeric"
              />
              <FieldError path="capital" />
            </div>
            <div className="w-full">
              <label className={labelBase}>Equity (%)</label>
              <input
                type="text"
                {...register("equity")}
                onChange={(e) => setValue("equity", maskPercent(e.target.value), { shouldValidate: true })}
                className={`${inputBase} ${errors?.equity ? "border-red-500" : ""}`}
                placeholder="Ex: 2,5"
                inputMode="decimal"
              />
              <p className="text-xs text-slate-400 mt-1">Pode ser decimal (ex: 1,4).</p>
              <FieldError path="equity" />
            </div>
            <div className="w-full">
              <label className={labelBase}>Runway (meses)</label>
              <input
                type="text"
                {...register("runwayMonths")}
                onChange={(e) => setValue("runwayMonths", maskDigitsOnly(e.target.value), { shouldValidate: true })}
                className={`${inputBase} ${errors?.runwayMonths ? "border-red-500" : ""}`}
                placeholder="Ex: 6"
                inputMode="numeric"
              />
              <FieldError path="runwayMonths" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-800 pt-8 ">
            <div className="relative">
              <label className={labelBase}>Uso do capital</label>
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
                      <input type="checkbox" {...register(`capitalUse.${it.k}`)} className="accent-cyan-400" />
                      <span>{it.l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <FieldError path="capitalUse" />
            </div>
            <div>
              <label className={labelBase}>Plano de uso do capital (defesa breve)</label>
              <textarea
                {...register("capitalPlan")}
                rows={6}
                className={`${inputBase} resize-none h-40 ${errors?.capitalPlan ? "border-red-500" : ""}`}
                placeholder="Ex: alocar parte do capital para contratar 1 dev sênior e acelerar o roadmap; em paralelo, rodar testes de aquisição em um canal específico para validar CAC/LTV e fechar os 3 primeiros contratos."
              />
              <p className="text-xs text-slate-400 mt-1">Explique como esse capital acelera os próximos 90–180 dias.</p>
              <FieldError path="capitalPlan" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
