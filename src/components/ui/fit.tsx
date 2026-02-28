import { CalendarDays, Users, BadgeDollarSign, Mail, ArrowRight } from "lucide-react"
import { Button } from "./button"
import type { ModalProps } from "@/types"

export default function Fit({ setIsModalOpen }: ModalProps) {
  return (
    <section className="container mx-auto px-6 py-24 relative z-10 border-t border-slate-800 mt-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-7">
          <span className="uppercase text-sm inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-slate-950/35 px-5 py-2.5 font-medium tracking-wide text-cyan-300 shadow-[0_0_28px_rgba(6,182,212,0.14)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            Última chamada
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.09]">
            Pronto para transformar <br />sua startup?
          </h2>
          <p className="mt-5 text-base md:text-lg text-slate-300/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Inscreva-se no MOVE Track e faça parte do programa que<br /> transforma ideias em negócios de verdade.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-cyan-600! px-9 py-5! text-slate-950 font-black hover:bg-cyan-400 transition-colors shadow-[0_14px_34px_rgba(6,182,212,0.22)]"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/15">
              <ArrowRight className="w-5 h-5 text-slate-950 translate-x-0.5 group-hover:translate-x-1 transition-transform" />
            </span>
            Inscreva-se agora
          </Button>

          <a href="mailto:contato@montreal.ventures">
            <Button
              type="button"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-slate-700/80 bg-slate-950/20 px-9 py-5! text-cyan-200 font-black hover:border-cyan-500/25 hover:bg-slate-950/35 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/70 border border-slate-800">
                <Mail className="w-5 h-5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
              </span>
              Fale com a gente
            </Button>
          </a>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-700/60 to-transparent" />
        </div>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          <div className="group rounded-3xl border border-slate-700/60 bg-white/5 backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:bg-white/7 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_22px_rgba(6,182,212,0.12)]">
                <CalendarDays className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="min-w-0">
                <p className="text-md! font-black text-white leading-none">Prazo</p>
                <p className="mt-2 text-md text-slate-300/90 font-semibold">Até 30/09/2025</p>
              </div>
            </div>
          </div>

          <div className="group rounded-3xl border border-slate-700/60 bg-white/5 backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:bg-white/7 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_22px_rgba(16,185,129,0.10)]">
                <BadgeDollarSign className="w-6 h-6 text-emerald-200" />
              </div>
              <div className="min-w-0">
                <p className="text-md font-black text-white leading-none">Investimento</p>
                <p className="mt-2 text-md text-slate-300/90 font-semibold">Até R$ 300k</p>
              </div>
            </div>
          </div>

          <div className="group rounded-3xl border border-slate-700/60 bg-white/5 backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:bg-white/7 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_22px_rgba(139,92,246,0.10)]">
                <Users className="w-6 h-6 text-violet-200" />
              </div>
              <div className="min-w-0">
                <p className="text-md font-black text-white leading-none">Vagas</p>
                <p className="mt-2 text-md text-slate-300/90 font-semibold">Apenas 3 startups</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-700/60 to-transparent" />
        </div>
        <div className="mt-12 text-center text-md text-slate-400 flex flex-row items-center gap-4 justify-center">
          <p>
            <span className="text-slate-200 font-black">Contato:</span>{" "}
            <a
              href="mailto:contato@montreal.ventures"
              className="font-semibold text-slate-300! hover:text-cyan-300! transition-colors"
            >
              contato@montreal.ventures
            </a>
          </p>
          <p>
            <span className="text-slate-200 font-black">Mais informações:</span>{" "}
            <a
              href="https://montreal.ventures/movetrack/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300! font-semibold hover:text-cyan-300! transition-colors"
            >
              montreal.ventures/move
            </a>
          </p>
        </div>
      </div>
    </section >
  )
}