import { ArrowRight } from "lucide-react";
import type { ModalProps } from "../../types";

export default function Footer({ setIsModalOpen }: ModalProps) {
  return (
    <footer className="border-t border-slate-800 bg-[#030712] relative z-10">
      <div className="container mx-auto px-6 py-24 text-center animate-in fade-in duration-500">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter leading-none transition-colors hover:text-cyan-300">Pronto para escalar <br className="hidden sm:block" /> sua startup?</h2>
        <p className="text-slate-300 mb-12 max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed delay-100">As vagas são limitadas. Dê o primeiro passo para conectar seu negócio ao Grupo Montreal.</p>
        <button onClick={() => setIsModalOpen(true)} className="group bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xl px-12 py-5 sm:px-16 sm:py-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] active:scale-95 animate-in fade-in duration-500 delay-200">
          Aplicar para o Batch 2026
          <ArrowRight className="w-6 h-6 inline-block ml-3 group-hover:translate-x-1 transition-transform animate-pulse" />
        </button>
      </div>
    </footer>
  )
}