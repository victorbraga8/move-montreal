import { MapPin, Network, Shield, Target, Users, Zap } from "lucide-react";

export default function MoveTrack() {
  return (
    <section className="container mx-auto px-6 py-12 relative z-10">
      <div className="text-center mb-16 animate-in fade-in duration-500">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">MOVe Track: Transformação Intensiva</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">Tudo o que sua startup precisa para atingir o próximo nível de maturidade e escala.</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "Mentorias Especializadas", icon: <Users /> },
          { title: "Workshops Práticos", icon: <Zap /> },
          { title: "Conexões Estratégicas", icon: <Network /> },
          { title: "Acompanhamento 1:1", icon: <Target /> },
          { title: "Acesso a Ferramentas", icon: <Shield /> },
          { title: "Infraestrutura Física", icon: <MapPin /> }
        ].map((item, i) => (
          <div key={i} className="group flex items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:bg-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="text-blue-400 p-2.5 bg-slate-800 rounded-xl group-hover:bg-blue-500/20 transition-colors">{item.icon}</div>
            <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}