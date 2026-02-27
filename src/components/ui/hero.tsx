import { ArrowRight, LayoutDashboard, Rocket, TrendingUp, Video } from "lucide-react";
import type { ModalProps } from "../../types";

export default function Hero({ setIsModalOpen }: ModalProps) {
  return (
    <section className="container mx-auto px-6 pt-40 pb-20 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* Lado Esquerdo: Copy Principal */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Batch 2026 - Inscrições Abertas
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
            A força para a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">verdadeira inovação</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Aceleração intensiva para startups com a expertise de 30 anos do Grupo Montreal. Transforme sua startup em um negócio global e escalável.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
            <button onClick={() => setIsModalOpen(true)} className="group flex justify-center items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1">
              Avaliar minha Startup
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 items-center pt-8 border-t border-slate-800">
            <div><p className="text-3xl font-black text-white">30 Anos</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">de mercado</p></div>
            <div className="w-px h-10 bg-slate-800 hidden sm:block"></div>
            <div><p className="text-3xl font-black text-white">10k+</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Colaboradores</p></div>
            <div className="w-px h-10 bg-slate-800 hidden sm:block"></div>
            <div><p className="text-3xl font-black text-white">Top 3</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Líderes Tech</p></div>
          </div>
        </div>

        {/* O Produto - Flat e Responsivo ( Founder Portal ) */}
        <div className="relative w-full max-w-lg mx-auto lg:max-w-none mt-12 lg:mt-0">
          {/* Glow focado */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-[2.5rem] blur-2xl transform rotate-3 scale-105"></div>

          {/* Card Flat com elevação no hover */}
          <div className="relative bg-[#0A1120] border border-slate-700 rounded-[2rem] p-6 shadow-2xl transition-transform duration-500 hover:-translate-y-2">

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
              <div className="text-xs text-slate-300 font-semibold flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
                <LayoutDashboard className="w-4 h-4 text-cyan-400" /> Portal do Empreendedor
              </div>
            </div>

            <div className="space-y-4">

              {/* Smart Money Card */}
              <div className="bg-gradient-to-r from-cyan-950/80 to-blue-900/40 border border-cyan-800/50 rounded-2xl p-6 flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Smart Money Disponível</p>
                  <p className="text-3xl sm:text-4xl font-black text-white">R$ 300.000</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6 text-cyan-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gráfico de Tração */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-slate-200">Tração MRR</p>
                    <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
                  </div>
                  {/* Gráfico CSS */}
                  <div className="h-16 flex items-end gap-2">
                    {[30, 45, 40, 60, 85, 100].map((h, i) => (
                      <div key={i} className="w-full bg-cyan-500/90 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%`, opacity: 0.5 + (i * 0.1) }}></div>
                    ))}
                  </div>
                </div>

                {/* Próximo Passo do Programa */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Próxima Agenda</p>
                    <p className="text-sm font-bold text-white leading-tight">Mentoria: Go-to-Market B2B</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-950/50 w-fit px-3 py-2 rounded-lg border border-cyan-900 animate-in fade-in">
                    <Video className="w-4 h-4" /> Hoje, 14:00
                  </div>
                </div>
              </div>

              {/* Progresso do Batch */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2 leading-none">
                  <p className="text-sm font-medium text-slate-300">Progresso do Batch</p>
                  <p className="text-xs font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-900 leading-none">Semana 8 de 16</p>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/2 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}