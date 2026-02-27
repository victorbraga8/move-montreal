import Header from './components/ui/header';
import MainBackground from './components/ui/main-background';
import Hero from './components/ui/hero';
import CtaCard from './components/ui/cta-cards';
import MoveTrack from './components/ui/move-track';
import Transformation from './components/ui/transformation';
import Timeline from './components/ui/timeline';
import Fit from './components/ui/fit';
import Footer from './components/ui/footer';
import FormSteps from './components/ui/form-steps';
import { useStepForms } from './hooks/use-step-forms';

export default function App() {
  const { setIsModalOpen, isModalOpen } = useStepForms()
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden pb-20">
      <MainBackground />
      <Header setIsModalOpen={setIsModalOpen} />
      <Hero setIsModalOpen={setIsModalOpen} />
      <CtaCard />
      <MoveTrack />
      <Transformation />
      <Timeline />
      <Fit />
      <Footer setIsModalOpen={setIsModalOpen} />
      {isModalOpen && (
        <FormSteps />
      )}
    </div>
  );
}