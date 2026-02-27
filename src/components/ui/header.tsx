import type { ModalProps } from "../../types";

export default function Header({ setIsModalOpen }: ModalProps) {
  return (
    <>
      < header className="fixed top-0 w-full z-40 bg-[#030712]/60 backdrop-blur-xl border-b border-white/5" >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">MoVe<span className="text-cyan-500">Track</span></span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all backdrop-blur-md">
            Aplicar agora
          </button>
        </div>
      </header >
    </>
  )
}