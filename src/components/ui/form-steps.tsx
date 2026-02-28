import { CheckCircle2, ChevronDown, ChevronRight, Milestone, Target, TrendingUp, Users, Briefcase, Lock, Check, Plus, Trash2, X } from "lucide-react";
import { centsToCurrency, currencyToCents, maskCurrency, maskPercent, maskPhone, MAX_CAPITAL_CENTS } from "@/provider/helpers";
import { stepTitles } from "@/provider/data";
import { useStepForms } from "@/hooks/use-step-forms";
import { Button } from "./button";

type FormStepsProps = ReturnType<typeof useStepForms>


export default function FormSteps({
  step,
  highestStep,
  loadingStage,
  register,
  handleSubmit,
  onSubmitForm,
  errors,
  isSubmitting,
  founderFields,
  appendFounder,
  removeFounder,
  formValues,
  setValue,
  handleNextStep,
  prevStep,
  jumpToStep,
  setIsModalOpen // Recebendo para o botão de fechar no mobile
}: FormStepsProps & { setIsModalOpen: (val: boolean) => void }) {
  return (
    <div className="relative w-full h-full min-h-0 flex flex-col bg-slate-900 border-0 sm:border border-slate-700 sm:rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.15)] overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8">

      {/* OVERLAY DE LOADING MANTIDO */}
      {isSubmitting && (
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
      )}

      {/* HEADER: No mobile, ganha um botão de fechar e fica mais enxuto */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-slate-800 bg-slate-950 transition-colors z-20">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3 transition-colors hover:text-cyan-400">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-in zoom-in delay-100" />{" "}
          Avaliação MoVe
        </h2>
        <button onClick={() => setIsModalOpen(false)} className="sm:hidden text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* BARRA DE PROGRESSO: Fina no Mobile (Micro UX), Robusta no Desktop */}
      <div className="flex-shrink-0 relative w-full bg-slate-800 h-1 sm:h-auto sm:bg-slate-900 sm:border-b sm:border-slate-800 sm:px-8 sm:py-5 z-10">

        {/* Mobile: Só a linha colorida preenchendo */}
        <div
          className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500 ease-out sm:hidden"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>

        {/* Desktop: Bolinhas clicáveis */}
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

      <div className="hidden sm:block h-1 bg-slate-800 w-full relative shadow-inner overflow-hidden flex-shrink-0">
        <div
          className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {/* ÁREA DE SCROLL (O MIOLO DO FORMULÁRIO) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900 p-4 sm:p-8 flex flex-col gap-6">

        {/* Título da Etapa Dinâmico */}
        <div className="flex-shrink-0">
          {step === 1 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Identificação da Startup
            </h3>
          )}
          {step === 2 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
              <Milestone className="w-5 h-5 text-cyan-400" /> Estágio do Negócio
            </h3>
          )}
          {step === 3 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" /> A Operação
            </h3>
          )}
          {step === 4 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" /> A Captação
            </h3>
          )}
        </div>

        {/* CONTEÚDO DOS PASSOS */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-bold">Nome da Startup</label>
              <input
                type="text"
                {...register("startupName")}
                className={`w-full bg-[#030712] border ${errors.startupName ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                  } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner`}
                placeholder="Ex: TechNova"
              />
              {errors.startupName && <p className="text-red-400 text-xs mt-1">{errors.startupName.message}</p>}
            </div>

            {founderFields.map((field, index) => (
              <div key={field.id} className="relative p-4 sm:p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">Founder {index + 1}</h4>
                  {index > 0 && (
                    <button type="button" onClick={() => removeFounder(index)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
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
                      className={`w-full bg-[#030712] border ${errors.founders?.[index]?.name ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                        } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-bold">E-mail Corporativo</label>
                    <input
                      type="email"
                      {...register(`founders.${index}.email`)}
                      className={`w-full bg-[#030712] border ${errors.founders?.[index]?.email ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                        } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                      placeholder="joao@technova.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-bold">Telefone (WhatsApp)</label>
                    <input
                      type="tel"
                      {...register(`founders.${index}.phone`)}
                      onChange={(e) => setValue(`founders.${index}.phone`, maskPhone(e.target.value))}
                      className={`w-full bg-[#030712] border ${errors.founders?.[index]?.phone ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                        } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                      placeholder="(11) 90000-0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1 font-bold">LinkedIn (Opcional)</label>
                    <input
                      type="text"
                      {...register(`founders.${index}.linkedin`)}
                      className={`w-full bg-[#030712] border ${errors.founders?.[index]?.linkedin ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                        } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                      placeholder="linkedin.com/in/seuperfil"
                    />
                  </div>
                </div>
              </div>
            ))}

            {founderFields.length < 3 && (
              <button
                type="button"
                onClick={() => appendFounder({ name: "", email: "", phone: "", linkedin: "" })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/20 px-4 py-3 text-sm font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800/30 transition-colors"
              >
                <Plus className="w-4 h-4" /> Adicionar Founder
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="relative">
                <label className="block text-sm text-slate-300 mb-2 font-bold">Modelo</label>
                <select
                  {...register("model")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="B2B">B2B (Business to Business)</option>
                  <option value="B2C">B2C (Business to Consumer)</option>
                  <option value="B2B2C">B2B2C</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
              <div className="relative">
                <label className="block text-sm text-slate-300 mb-2 font-bold">Maturidade</label>
                <select
                  {...register("stage")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Ideia">Apenas Ideia</option>
                  <option value="MVP">MVP Validado (Sem receita)</option>
                  <option value="Tracao">Tração (Com faturamento)</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
            </div>

            {formValues.model === 'B2B' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm text-slate-300 mb-2 font-bold">Ticket Médio Anual (ACV)</label>
                <input
                  type="text"
                  {...register("acv")}
                  onChange={(e) => setValue("acv", maskCurrency(e.target.value))}
                  className="w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none shadow-inner"
                  placeholder="Ex: R$ 50.000,00"
                />
              </div>
            )}

            {formValues.model === 'B2C' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm text-slate-300 mb-2 font-bold">Usuários Ativos Mensais (MAU)</label>
                <input
                  type="text"
                  {...register("mau")}
                  className="w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none shadow-inner"
                  placeholder="Ex: 10.000"
                />
              </div>
            )}

            {formValues.stage === "Tracao" && (
              <div className="animate-in zoom-in-95 duration-300 p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/50">
                <label className="block text-sm text-cyan-400 mb-2 font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" /> Faturamento Mensal (MRR)
                </label>
                <input
                  type="text"
                  {...register("mrr")}
                  onChange={(e) => setValue("mrr", maskCurrency(e.target.value))}
                  className={`w-full bg-cyan-950/30 border ${errors.mrr ? "border-red-500" : "border-cyan-500/50 focus:border-cyan-400"
                    } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none font-bold`}
                  placeholder="R$ 15.000,00"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-2 font-bold">Qual problema a startup resolve?</label>
              <textarea
                {...register("challenge")}
                rows={4}
                className={`w-full bg-[#030712] border ${errors.challenge ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                  } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none resize-none`}
                placeholder="Venda seu negócio..."
              ></textarea>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="relative">
                <label className="block text-sm text-slate-300 mb-2 font-bold">Tamanho do Time</label>
                <select
                  {...register("teamSize")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="1-5">1 a 5 pessoas</option>
                  <option value="6-15">6 a 15 pessoas</option>
                  <option value="16+">Mais de 16 pessoas</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
              <div className="relative">
                <label className="block text-sm text-slate-300 mb-2 font-bold">Founders 100% Full-Time?</label>
                <select
                  {...register("fullTime")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Sim">Sim, dedicados</option>
                  <option value="Nao">Não, side-project</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700 flex items-start gap-3">
              <Lock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300 leading-relaxed">
                O MOVe Track investe até <strong className="text-white">R$ 300.000,00</strong>. Qual a sua necessidade?
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm text-slate-300 mb-2 font-bold">A startup já captou investimento antes?</label>
              <select
                {...register("hasRaised")}
                className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
              >
                <option value="Nao">Não, somos 100% Bootstrapped</option>
                <option value="Sim">Sim, já fizemos rodadas anteriores</option>
              </select>
              <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
            </div>

            {formValues.hasRaised === 'Sim' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 animate-in zoom-in-95 duration-300">
                <div>
                  <label className="block text-xs text-slate-400 mb-2 font-bold">Total já captado</label>
                  <input
                    type="text"
                    {...register("raisedAmount")}
                    onChange={(e) => setValue("raisedAmount", maskCurrency(e.target.value))}
                    className={`w-full bg-[#030712] border ${errors.raisedAmount ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                      } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                    placeholder="Ex: R$ 500.000,00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 font-bold">Principais Investidores</label>
                  <input
                    type="text"
                    {...register("investors")}
                    className="w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                    placeholder="Ex: Bossa Nova, Anjos..."
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold">Capital Buscado na rodada</label>
                <input
                  type="text"
                  {...register("capital")}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    if (!rawValue) {
                      setValue("capital", "", { shouldValidate: true });
                      return;
                    }
                    const cents = currencyToCents(e.target.value);
                    const limited = Math.min(cents, MAX_CAPITAL_CENTS);
                    setValue("capital", centsToCurrency(limited), { shouldValidate: true });
                  }}
                  placeholder={centsToCurrency(MAX_CAPITAL_CENTS)}
                  className={`w-full bg-[#030712] border ${errors.capital
                    ? "border-red-500"
                    : "border-slate-700 focus:border-cyan-500"
                    } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none font-bold`}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold">Equity Founders (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  {...register("equity")}
                  onChange={(e) =>
                    setValue("equity", maskPercent(e.target.value) as unknown as number, { shouldValidate: true })
                  }
                  className={`w-full bg-[#030712] border ${errors.equity ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                    } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none font-bold`}
                  placeholder="Ex: 85,5"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAVEGAÇÃO: Ajustado para o Mobile com botões lado a lado e 100% de largura */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex justify-between gap-3 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] sm:shadow-inner">
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

        {step < 4 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="flex-2 sm:flex-none flex justify-center items-center gap-2 sm:gap-3 bg-cyan-600! text-slate-950 px-6 sm:px-9 py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-cyan-400! transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-none w-full sm:w-auto"
          >
            Avançar <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit(onSubmitForm)}
            disabled={isSubmitting}
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
    </div>
  )
}