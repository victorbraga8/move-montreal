import { CheckCircle2, ChevronDown, ChevronRight, Lightbulb, Milestone, Target, TrendingUp, Users, X } from "lucide-react";
import { useStepForms } from "../../hooks/use-step-forms";

export default function FormSteps() {
  const { setIsModalOpen, step, prevStep, nextStep, formData, handleInputChange, handleSubmit } = useStepForms()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/95 backdrop-blur-md animate-in fade-in transition-opacity">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_100px_rgba(6,182,212,0.15)] animate-in slide-in-from-bottom-8">

        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors group">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 transition-colors group-hover:text-cyan-400">
            <Target className="w-6 h-6 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-in zoom-in delay-100" /> Avaliação MoVe
          </h2>
          <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-all bg-slate-800 p-2.5 rounded-full hover:bg-slate-700 hover:scale-110 active:scale-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-1 bg-slate-800 w-full relative shadow-inner overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
              <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-cyan-500/50 pb-3 flex items-center gap-2 transition-colors hover:text-cyan-300"><Users className="w-5 h-5 text-cyan-400" /> Identificação</h3>
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Nome do Founder</label>
                <input type="text" name="founderName" value={formData.founderName} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Nome da Startup</label>
                <input type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700" placeholder="Ex: TechNova" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">E-mail Corporativo</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700" placeholder="joao@technova.com" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 delay-100 relative">
              <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-cyan-500/50 pb-3 flex items-center gap-2 transition-colors hover:text-cyan-300"><Milestone className="w-5 h-5 text-cyan-400" /> Estágio do Negócio</h3>
              <div className="relative">
                <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Modelo de Negócio</label>
                <select name="model" value={formData.model} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none font-medium hover:border-cyan-500/50 active:scale-95 transition-all shadow-inner pr-12 focus:shadow-lg focus:shadow-cyan-500/10">
                  <option value="B2B" className='bg-slate-900'>B2B (Business to Business)</option>
                  <option value="B2C" className='bg-slate-900'>B2C (Business to Consumer)</option>
                  <option value="B2B2C" className='bg-slate-900'>B2B2C</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.8rem] pointer-events-none group-active:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="relative">
                <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Maturidade</label>
                <select name="stage" value={formData.stage} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none font-medium hover:border-cyan-500/50 active:scale-95 transition-all shadow-inner pr-12 focus:shadow-lg focus:shadow-cyan-500/10">
                  <option value="Ideia" className='bg-slate-900'>Apenas Ideia (Pré-MVP)</option>
                  <option value="MVP" className='bg-slate-900'>MVP Validado (Sem receita)</option>
                  <option value="Tracao" className='bg-slate-900'>Tração (Com faturamento recorrente)</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.8rem] pointer-events-none group-active:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              {formData.stage === 'Tracao' && (
                <div className="animate-in zoom-in-95 duration-300 shadow-[0_0_30px_rgba(6,182,212,0.1)] p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/50">
                  <label className="block text-sm text-cyan-400 mb-2 font-bold flex items-center gap-2 transition-colors hover:text-cyan-300"><TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" /> Faturamento Mensal Atual (MRR)</label>
                  <input type="text" name="mrr" value={formData.mrr} onChange={handleInputChange} className="w-full bg-cyan-950/30 border border-cyan-500/50 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-bold transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/20 placeholder:font-medium placeholder:text-cyan-900" placeholder="Ex: R$ 15.000" />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 delay-100">
              <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-cyan-500/50 pb-3 flex items-center gap-2 transition-colors hover:text-cyan-300"><Lightbulb className="w-5 h-5 text-cyan-400" /> O Grande Desafio</h3>
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Descreva o problema que sua startup resolve:</label>
                <textarea name="challenge" value={formData.challenge} onChange={handleInputChange} rows={8} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-all font-medium custom-scrollbar shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700 hover:border-cyan-500/30 active:scale-[0.98]" placeholder="Venda o seu negócio. Qual dor do mercado vocês atacam e qual o seu diferencial competitivo? FOQUE EM CLAREZA E DADOS."></textarea>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-950 shadow-inner group-active:border-slate-700 transition-colors">
          {step > 1 ? (
            <button onClick={prevStep} className="px-6 py-3 text-slate-300 hover:text-white font-bold transition-all rounded-xl hover:bg-slate-800 hover:-translate-x-0.5 shadow hover:shadow-cyan-500/5 active:scale-90">Voltar</button>
          ) : <div></div>}

          {step < 3 ? (
            <button onClick={nextStep} className="flex items-center gap-3 bg-white text-slate-950 px-9 py-3 rounded-xl font-black text-lg hover:bg-slate-200 transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/15 active:scale-95">
              Avançar <ChevronRight className="w-5 h-5 animate-in slide-in-from-left-2 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex items-center gap-3 bg-cyan-500 text-slate-950 px-9 py-3 rounded-xl font-black text-lg hover:bg-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/20 hover:shadow-[0_8px_30px_rgba(6,182,212,0.4)] active:scale-95 animate-in fade-in">
              Concluir Inscrição <CheckCircle2 className="w-5 h-5 animate-pulse transition-transform group-hover:scale-110" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}