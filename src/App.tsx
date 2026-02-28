import Header from './components/ui/header';
import MainBackground from './components/ui/main-background';
import Hero from './components/ui/hero';
import CtaCard from './components/ui/cta-cards';
import MoveTrack from './components/ui/move-track';
import Transformation from './components/ui/transformation';
import Timeline from './components/ui/timeline';
import Fit from './components/ui/fit';
import Footer from './components/ui/footer';
import { useStepForms } from './hooks/use-step-forms';
import MainDialog from './components/generics/dialog';
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  const stepForms = useStepForms()
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden ">
      <MainBackground />
      <Header setIsModalOpen={stepForms.setIsModalOpen} />
      <Hero setIsModalOpen={stepForms.setIsModalOpen} />
      <CtaCard />
      <MoveTrack />
      <Transformation />
      <Timeline />
      <Fit setIsModalOpen={stepForms.setIsModalOpen} />
      <Footer />
      <MainDialog
        isModalOpen={stepForms.isModalOpen}
        setIsModalOpen={stepForms.setIsModalOpen}
        stepForms={stepForms}
      />
      <Toaster />
    </div>
  )
}