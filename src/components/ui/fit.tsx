import { CheckCircle2, X } from "lucide-react";

export default function Fit() {
  return (
    <section className="container mx-auto px-6 py-24 relative z-10 border-t border-slate-800 mt-12">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-in fade-in duration-500">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Lado do Investimento (Ponto focal com glow) */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-white mb-4 animate-in fade-in duration-500">Oportunidade de Investimento</h2>
            <p className="text-slate-300 mb-8 font-medium animate-in fade-in duration-500 delay-100">O capital e a estrutura necessários para você focar apenas em crescer a sua operação.</p>

            <div className="inline-block bg-[#030712] border border-cyan-500/40 p-10 rounded-3xl relative shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] transition-all duration-300 hover:border-cyan-500 hover:-translate-y-1 animate-in fade-in duration-500 delay-200">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-cyan-900 via-cyan-400 to-cyan-900"></div>
              <span className="block text-xs text-cyan-400 font-bold tracking-widest uppercase mb-3">Até</span>
              <span className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 block transition-colors hover:text-cyan-300">R$ 300k</span>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <span className="bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-slate-700">Modelo SAFE</span>
                <span className="bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-slate-700">Smart Money</span>
              </div>
            </div>
          </div>

          {/* Lado do Fit (Cards coloridos com punch visual) */}
          <div className="space-y-8 animate-in fade-in duration-500 delay-300">
            <div className="bg-green-950/20 p-8 rounded-3xl border border-green-700/50 shadow-inner hover:border-green-600 transition-colors group">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-white group-hover:text-green-300 transition-colors"><div className="w-10 h-10 rounded-xl bg-green-900 border border-green-800 flex items-center justify-center shadow-lg"><CheckCircle2 className="text-green-400 w-5 h-5 animate-in zoom-in" /></div> Nosso perfil ideal:</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["Startups B2B e B2B2C", "MVP Validado no mercado", "Receitas recorrentes (MRR)", "Equipe 100% dedicada"].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner transition-colors hover:border-green-700 hover:text-white"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>{text}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-950/20 p-8 rounded-3xl border border-red-700/30 shadow-inner hover:border-red-600 transition-colors group">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-white group-hover:text-red-300 transition-colors"><div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-900 flex items-center justify-center shadow-lg"><X className="text-red-500 w-5 h-5 animate-in zoom-in" /></div> Fora da tese:</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["Ideias apenas no papel", "Modelos B2C", "Projetos side-hustle", "Agências/Consultorias"].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner transition-colors hover:border-red-700 hover:text-white"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>{text}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}