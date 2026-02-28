import { centsToCurrency, currencyToCents, maskCurrency, maskPercent, maskPhone, MAX_CAPITAL_CENTS } from "@/provider/helpers";
import { ChevronDown, Milestone, TrendingUp, Users, Briefcase, Lock, Plus, Trash2 } from "lucide-react";

export default function BodyForm({ step, register, errors, founderFields, appendFounder, formValues, setValue, removeFounder }: any) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900 p-4 sm:p-8 flex flex-col gap-6" >
      <div className="shrink-0" >
        {step === 1 && (
          <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2" >
            <Users className="w-5 h-5 text-cyan-400" /> Identificação da Startup
          </h3>
        )
        }
        {
          step === 2 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2" >
              <Milestone className="w-5 h-5 text-cyan-400" /> Estágio do Negócio
            </h3>
          )
        }
        {
          step === 3 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2" >
              <Briefcase className="w-5 h-5 text-cyan-400" /> A Operação
            </h3>
          )
        }
        {
          step === 4 && (
            <h3 className="text-lg sm:text-xl font-bold text-white border-b-2 border-cyan-500/50 pb-2 sm:pb-3 flex items-center gap-2" >
              <Lock className="w-5 h-5 text-cyan-400" /> A Captação
            </h3>
          )
        }
      </div>

      {/* CONTEÚDO DOS PASSOS */}
      {
        step === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-left-4 duration-300" >
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-bold" > Nome da Startup </label>
              < input
                type="text"
                {...register("startupName")}
                className={`w-full bg-[#030712] border ${errors.startupName ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                  } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner`
                }
                placeholder="Ex: TechNova"
              />
              {errors.startupName && <p className="text-red-400 text-xs mt-1"> {errors.startupName.message} </p>}
            </div>

            {
              founderFields.map((field: string | any, index: number) => (
                <div key={field.id} className="relative p-4 sm:p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4 animate-in fade-in" >
                  <div className="flex justify-between items-center mb-1" >
                    <h4 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider" > Founder {index + 1} </h4>
                    {
                      index > 0 && (
                        <button type="button" onClick={() => removeFounder(index)
                        } className="text-slate-500 hover:text-red-400 transition-colors p-1" >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>

                  < div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                    <div className="sm:col-span-2" >
                      <label className="block text-xs text-slate-400 mb-1 font-bold" > Nome Completo </label>
                      < input
                        type="text"
                        {...register(`founders.${index}.name`)}
                        className={`w-full bg-[#030712] border ${errors.founders?.[index]?.name ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                          } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                        placeholder="Ex: João Silva"
                      />
                    </div>
                    < div >
                      <label className="block text-xs text-slate-400 mb-1 font-bold" > E - mail Corporativo </label>
                      < input
                        type="email"
                        {...register(`founders.${index}.email`)}
                        className={`w-full bg-[#030712] border ${errors.founders?.[index]?.email ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                          } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                        placeholder="joao@technova.com"
                      />
                    </div>
                    < div >
                      <label className="block text-xs text-slate-400 mb-1 font-bold" > Telefone(WhatsApp) </label>
                      < input
                        type="tel"
                        {...register(`founders.${index}.phone`)}
                        onChange={(e) => setValue(`founders.${index}.phone`, maskPhone(e.target.value))}
                        className={`w-full bg-[#030712] border ${errors.founders?.[index]?.phone ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                          } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`}
                        placeholder="(11) 90000-0000"
                      />
                    </div>
                    < div className="sm:col-span-2" >
                      <label className="block text-xs text-slate-400 mb-1 font-bold" > LinkedIn(Opcional) </label>
                      < input
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

            {
              founderFields.length < 3 && (
                <button
                  type="button"
                  onClick={() => appendFounder({ name: "", email: "", phone: "", linkedin: "" })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/20 px-4 py-3 text-sm font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800/30 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Adicionar Founder
                </button>
              )}
          </div>
        )}

      {
        step === 2 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6" >
              <div className="relative" >
                <label className="block text-sm text-slate-300 mb-2 font-bold" > Modelo </label>
                < select
                  {...register("model")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="B2B" > B2B(Business to Business) </option>
                  < option value="B2C" > B2C(Business to Consumer) </option>
                  < option value="B2B2C" > B2B2C </option>
                </select>
                < ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
              < div className="relative" >
                <label className="block text-sm text-slate-300 mb-2 font-bold" > Maturidade </label>
                < select
                  {...register("stage")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Ideia" > Apenas Ideia </option>
                  < option value="MVP" > MVP Validado(Sem receita) </option>
                  < option value="Tracao" > Tração(Com faturamento) </option>
                </select>
                < ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
            </div>

            {
              formValues.model === 'B2B' && (
                <div className="animate-in slide-in-from-top-2 duration-300" >
                  <label className="block text-sm text-slate-300 mb-2 font-bold" > Ticket Médio Anual(ACV) </label>
                  < input
                    type="text"
                    {...register("acv")}
                    onChange={(e) => setValue("acv", maskCurrency(e.target.value))
                    }
                    className="w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none shadow-inner"
                    placeholder="Ex: R$ 50.000,00"
                  />
                </div>
              )
            }

            {
              formValues.model === 'B2C' && (
                <div className="animate-in slide-in-from-top-2 duration-300" >
                  <label className="block text-sm text-slate-300 mb-2 font-bold" > Usuários Ativos Mensais(MAU) </label>
                  < input
                    type="text"
                    {...register("mau")}
                    className="w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none shadow-inner"
                    placeholder="Ex: 10.000"
                  />
                </div>
              )
            }

            {
              formValues.stage === "Tracao" && (
                <div className="animate-in zoom-in-95 duration-300 p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/50" >
                  <label className="block text-sm text-cyan-400 mb-2 font-bold flex items-center gap-2" >
                    <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" /> Faturamento Mensal(MRR)
                  </label>
                  < input
                    type="text"
                    {...register("mrr")}
                    onChange={(e) => setValue("mrr", maskCurrency(e.target.value))
                    }
                    className={`w-full bg-cyan-950/30 border ${errors.mrr ? "border-red-500" : "border-cyan-500/50 focus:border-cyan-400"
                      } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none font-bold`}
                    placeholder="R$ 15.000,00"
                  />
                </div>
              )}

            <div>
              <label className="block text-sm text-slate-300 mb-2 font-bold" > Qual problema a startup resolve ? </label>
              < textarea
                {...register("challenge")}
                rows={4}
                className={`w-full bg-[#030712] border ${errors.challenge ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                  } rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none resize-none`}
                placeholder="Venda seu negócio..."
              > </textarea>
            </div>
          </div>
        )}

      {
        step === 3 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6" >
              <div className="relative" >
                <label className="block text-sm text-slate-300 mb-2 font-bold" > Tamanho do Time </label>
                < select
                  {...register("teamSize")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="1-5" > 1 a 5 pessoas </option>
                  < option value="6-15" > 6 a 15 pessoas </option>
                  < option value="16+" > Mais de 16 pessoas </option>
                </select>
                < ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
              < div className="relative" >
                <label className="block text-sm text-slate-300 mb-2 font-bold" > Founders 100 % Full - Time ? </label>
                < select
                  {...register("fullTime")}
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Sim" > Sim, dedicados </option>
                  < option value="Nao" > Não, side - project </option>
                </select>
                < ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
              </div>
            </div>
          </div>
        )
      }

      {
        step === 4 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" >
            <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700 flex items-start gap-3" >
              <Lock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300 leading-relaxed" >
                O MOVe Track investe até < strong className="text-white" > R$ 300.000,00 </strong>. Qual a sua necessidade?
              </p>
            </div>

            < div className="relative" >
              <label className="block text-sm text-slate-300 mb-2 font-bold" > A startup já captou investimento antes ? </label>
              < select
                {...register("hasRaised")}
                className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
              >
                <option value="Nao" > Não, somos 100 % Bootstrapped </option>
                < option value="Sim" > Sim, já fizemos rodadas anteriores </option>
              </select>
              < ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.4rem] pointer-events-none" />
            </div>

            {
              formValues.hasRaised === 'Sim' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 animate-in zoom-in-95 duration-300" >
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold" > Total já captado </label>
                    < input
                      type="text"
                      {...register("raisedAmount")}
                      onChange={(e) => setValue("raisedAmount", maskCurrency(e.target.value))
                      }
                      className={`w-full bg-[#030712] border ${errors.raisedAmount ? "border-red-500" : "border-slate-700 focus:border-cyan-500"
                        } rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none`
                      }
                      placeholder="Ex: R$ 500.000,00"
                    />
                  </div>
                  < div >
                    <label className="block text-xs text-slate-400 mb-2 font-bold" > Principais Investidores </label>
                    < input
                      type="text"
                      {...register("investors")}
                      className="w-full bg-[#030712] border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                      placeholder="Ex: Bossa Nova, Anjos..."
                    />
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6" >
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold" > Capital Buscado na rodada </label>
                < input
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
              < div >
                <label className="block text-sm text-slate-300 mb-2 font-bold" > Equity Founders(%) </label>
                < input
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
  )
}