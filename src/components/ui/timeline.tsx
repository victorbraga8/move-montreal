import { Calendar, Rocket, Target, Users, Video } from "lucide-react";

export default function Timeline() {
  return (
    <section className="container mx-auto px-6 py-16 relative z-10 border-t border-slate-800">
      <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-20 animate-in fade-in duration-500">Timeline do Programa</h2>

      <div className="max-w-5xl mx-auto relative animate-in fade-in duration-500">
        <div className="absolute top-8 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 hidden md:block rounded-full shadow-inner overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/4 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse transition-all duration-1000"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative">
          {[
            { step: "Inscrições", date: "Abertas", icon: <Rocket />, active: true },
            { step: "Fim das Inscrições", date: "Em breve", icon: <Calendar />, active: false },
            { step: "Pitch Day", date: "Seleção", icon: <Video />, active: false },
            { step: "Onboarding", date: "Início", icon: <Users />, active: false },
            { step: "Demo Day", date: "Deploy", icon: <Target />, active: false }
          ].map((phase, i) => (
            <div key={i} className="flex flex-col items-center text-center relative group animate-in fade-in" style={{ animationDelay: `${i * 150}ms` }}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 z-10 transition-all duration-300 group-hover:-translate-y-1 ${phase.active ? 'bg-cyan-950 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]' : 'bg-slate-900 border-2 border-slate-800 text-slate-500 group-hover:border-slate-600 group-hover:text-slate-300 group-hover:bg-slate-800'}`}>
                {phase.icon}
              </div>
              <h4 className={`font-bold text-sm mb-1 ${phase.active ? 'text-white' : 'text-slate-300'} transition-colors group-hover:text-white`}>{phase.step}</h4>
              <p className={`text-xs font-bold uppercase tracking-wider ${phase.active ? 'text-cyan-400' : 'text-slate-500'} transition-colors group-hover:text-cyan-500`}>{phase.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}