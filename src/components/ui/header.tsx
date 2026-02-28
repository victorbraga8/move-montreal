import type { ModalProps } from "../../types";
import { Button } from "./button";

export default function Header({ setIsModalOpen }: ModalProps) {
  return (
    <>
      < header className="fixed top-0 w-full z-40 bg-[#030712]/60 backdrop-blur-xl border-b border-white/5" >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">MOVE <span className="text-cyan-500">Track</span></span>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-cyan-700! hover:bg-cyan-400! transition-all! border border-white/10 text-white text-sm font-semibold px-6 py-2.5 rounded-full backdrop-blur-md uppe">
            Inscreva-se
          </Button>
        </div>
      </header >
    </>
  )
}