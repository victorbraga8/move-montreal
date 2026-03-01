export default function Transformation() {
  return (
    <section className="container mx-auto px-6 py-24 relative z-10 border-t border-slate-800 mt-12">
      <div className="text-center mb-16 animate-in fade-in duration-500">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">16 Semanas de Transformação</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">Uma jornada estruturada em módulos intensivos para escalar seu negócio de ponta a ponta.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { num: "01", title: "Produto & Tech", desc: "Refinamento de arquitetura, escalabilidade e roadmap tecnológico de classe mundial." },
          { num: "02", title: "Go-to-Market", desc: "Estratégias de lançamento, posicionamento e conquista dos primeiros clientes enterprise." },
          { num: "03", title: "Pitch & FundRaising", desc: "Preparação intensiva para captação, valuation e narrativa de impacto para investidores." },
          { num: "04", title: "Vendas & Growth", desc: "Estruturação de funis, métricas e táticas validadas de crescimento acelerado." },
          { num: "05", title: "Máquina de Vendas", desc: "Criação de processos previsíveis, playbooks e estruturação de times comerciais." },
          { num: "06", title: "Tração & Escala", desc: "Preparação da operação para multiplicar receita mantendo a alta qualidade da entrega." }
        ].map((item, i) => (
          <div key={i} className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 group shadow-lg animate-in fade-in" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="text-5xl font-black text-slate-800 absolute top-6 right-6 transition-colors duration-300 group-hover:text-slate-700 leading-none">{item.num}</div>
            <h3 className="text-xl font-bold text-white mb-3 mt-4 relative z-10 transition-colors group-hover:text-cyan-400">{item.title}</h3>
            <p className="text-sm text-slate-300 font-medium relative z-10 transition-colors group-hover:text-white">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}