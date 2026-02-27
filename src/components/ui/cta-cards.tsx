import { BarChart, Lightbulb, MapPin, Network } from "lucide-react";

export default function CtaCard() {
  return (
    <section className="container mx-auto px-6 py-24 relative z-10 border-t border-slate-800">
      <div className="text-center mb-16 animate-in fade-in duration-500">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Líder em Tecnologia: O Futuro Presente</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">Acesso ao ecossistema e expertise de um dos maiores grupos de tecnologia do país.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Expertise de Mercado", icon: <BarChart />, desc: "Anos de validação e construção de soluções enterprise seguras." },
          { title: "Presença Nacional", icon: <MapPin />, desc: "Alcance e infraestrutura tecnológica distribuída por todo o Brasil." },
          { title: "Acesso à Inovação", icon: <Lightbulb />, desc: "Contato direto com tecnologias de ponta e times especializados de P&D." },
          { title: "Redes de Negócios", icon: <Network />, desc: "Conexão estratégica com as maiores empresas e tomadores de decisão." }
        ].map((item, i) => (
          <div key={i} className="group bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5 animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">{item.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium transition-colors group-hover:text-white">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}