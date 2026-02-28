import { Target, X } from "lucide-react";

export default function HeaderForm({ setIsModalOpen }: { setIsModalOpen: (o: boolean) => void }) {
  return (
    <div className="shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-slate-800 bg-slate-950 transition-colors z-20">
      <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3 transition-colors hover:text-cyan-400">
        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-in zoom-in delay-100" />{" "}
        Avaliação MoVe
      </h2>
      <button onClick={() => setIsModalOpen(false)} className="sm:hidden text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}