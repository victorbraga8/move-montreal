import React, { useState } from 'react';
import { ArrowRight, ChevronRight, X, CheckCircle2, ChevronDown, Target, Zap, MapPin, Network, Lightbulb, Shield, Globe, Check, Minus, BarChart, Users, Rocket, Calendar, TrendingUp, LayoutDashboard, Video, Milestone } from 'lucide-react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [faqOpen, setFaqOpen] = useState(null);
  const [formData, setFormData] = useState({
    founderName: '', startupName: '', email: '', model: 'B2B', stage: 'Ideia', mrr: '', challenge: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { mrr, ...dataWithoutMrr } = formData;
    const finalData = formData.stage === 'Tracao' ? formData : dataWithoutMrr;

    console.log("=== JSON GERADO PARA A IA ===", JSON.stringify(finalData, null, 2));
    setStep(1);
    setIsModalOpen(false);
  };

  const faqs = [
    { q: "A quem se destina o MOVe?", a: "Startups em estágio inicial (Early Stage) com foco B2B ou B2B2C, que já possuam MVP validado no mercado." },
    { q: "Qual o valor do investimento?", a: "Até R$ 300k, estruturado estrategicamente através de um modelo SAFE." },
    { q: "Preciso ter dedicação exclusiva?", a: "Sim, buscamos founders que estejam 100% dedicados para garantir a velocidade máxima de tração." },
    { q: "Como funciona a seleção inteligente?", a: "Nossa IA faz a primeira triagem do seu pitch. Depois, passamos por entrevistas e comitê final de aprovação." }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden pb-20">

      {/* BACKGROUND GLOWS AMBIENTES */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[60vw] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* HEADER GLASS */}
      <header className="fixed top-0 w-full z-40 bg-[#030712]/60 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">MoVe<span className="text-cyan-500">Track</span></span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all backdrop-blur-md">
            Aplicar agora
          </button>
        </div>
      </header>

      {/* HERO SECTION - PRODUCT FIRST (FLAT & RESPONSIVE) */}
      <section className="container mx-auto px-6 pt-40 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Lado Esquerdo: Copy Principal */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Batch 2026 - Inscrições Abertas
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
              A força para a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">verdadeira inovação</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Aceleração intensiva para startups com a expertise de 30 anos do Grupo Montreal. Transforme sua startup em um negócio global e escalável.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <button onClick={() => setIsModalOpen(true)} className="group flex justify-center items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1">
                Avaliar minha Startup
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 items-center pt-8 border-t border-slate-800">
              <div><p className="text-3xl font-black text-white">30 Anos</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">de mercado</p></div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block"></div>
              <div><p className="text-3xl font-black text-white">10k+</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Colaboradores</p></div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block"></div>
              <div><p className="text-3xl font-black text-white">Top 3</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Líderes Tech</p></div>
            </div>
          </div>

          {/* O Produto - Flat e Responsivo ( Founder Portal ) */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none mt-12 lg:mt-0">
            {/* Glow focado */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-[2.5rem] blur-2xl transform rotate-3 scale-105"></div>

            {/* Card Flat com elevação no hover */}
            <div className="relative bg-[#0A1120] border border-slate-700 rounded-[2rem] p-6 shadow-2xl transition-transform duration-500 hover:-translate-y-2">

              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
                <div className="text-xs text-slate-300 font-semibold flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" /> Portal do Empreendedor
                </div>
              </div>

              <div className="space-y-4">

                {/* Smart Money Card */}
                <div className="bg-gradient-to-r from-cyan-950/80 to-blue-900/40 border border-cyan-800/50 rounded-2xl p-6 flex items-center justify-between shadow-inner">
                  <div>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Smart Money Disponível</p>
                    <p className="text-3xl sm:text-4xl font-black text-white">R$ 300.000</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 hover:scale-110 transition-transform">
                    <Rocket className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gráfico de Tração */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-slate-200">Tração MRR</p>
                      <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
                    </div>
                    {/* Gráfico CSS */}
                    <div className="h-16 flex items-end gap-2">
                      {[30, 45, 40, 60, 85, 100].map((h, i) => (
                        <div key={i} className="w-full bg-cyan-500/90 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%`, opacity: 0.5 + (i * 0.1) }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Próximo Passo do Programa */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Próxima Agenda</p>
                      <p className="text-sm font-bold text-white leading-tight">Mentoria: Go-to-Market B2B</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-950/50 w-fit px-3 py-2 rounded-lg border border-cyan-900 animate-in fade-in">
                      <Video className="w-4 h-4" /> Hoje, 14:00
                    </div>
                  </div>
                </div>

                {/* Progresso do Batch */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-2 leading-none">
                    <p className="text-sm font-medium text-slate-300">Progresso do Batch</p>
                    <p className="text-xs font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-900 leading-none">Semana 8 de 16</p>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/2 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LÍDER EM TECNOLOGIA - CARDS COM ALTO CONTRASTE & MOTION */}
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

      {/* MOVe Track: Transformação Intensiva */}
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

      {/* 16 SEMANAS DE TRANSFORMAÇÃO - CARDS COM ALTO CONTRASTE */}
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
            { num: "04", title: "Vendas & Growth", desc: "Estruturação de funis, métricas piratas e táticas validadas de crescimento acelerado." },
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

      {/* TIMELINE DO PROGRAMA - MOTION MODERADO */}
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
              { step: "Demo Day", date: "Formatura", icon: <Target />, active: false }
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

      {/* OPORTUNIDADE DE INVESTIMENTO & FIT - HIGH CONTRAST */}
      <section className="container mx-auto px-6 py-24 relative z-10 border-t border-slate-800 mt-12">
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Lado do Investimento (Ponto focal com glow) */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-black text-white mb-4 animate-in fade-in duration-500">Oportunidade de Investimento</h2>
              <p className="text-slate-300 mb-8 font-medium animate-in fade-in duration-500 delay-100">O capital e a estrutura necessários para você focar apenas em crescer a sua operação.</p>

              <div className="inline-block bg-[#030712] border border-cyan-500/40 p-10 rounded-3xl relative shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] transition-all duration-300 hover:border-cyan-500 hover:-translate-y-1 animate-in fade-in duration-500 delay-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-cyan-900 via-cyan-400 to-cyan-900"></div>
                <span className="block text-xs text-cyan-400 font-bold tracking-widest uppercase mb-3">Até</span>
                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 block transition-colors hover:text-cyan-300">R$ 300k</span>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <span className="bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-slate-700">Modelo SAFE</span>
                  <span className="bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-slate-700">Smart Money</span>
                </div>
              </div>
            </div>

            {/* Lado do Fit (Cards coloridos com punch visual) */}
            <div className="space-y-8 animate-in fade-in duration-500 delay-300">
              <div className="bg-green-950/20 p-8 rounded-3xl border border-green-700/50 shadow-inner hover:border-green-600 transition-colors group">
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-white group-hover:text-green-300 transition-colors"><div className="w-10 h-10 rounded-xl bg-green-900 border border-green-800 flex items-center justify-center shadow-lg"><CheckCircle2 className="text-green-400 w-5 h-5 animate-in zoom-in" /></div> Nosso perfil ideal:</h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {["Startups B2B e B2B2C", "MVP Validado no mercado", "Receitas recorrentes (MRR)", "Equipe 100% dedicada"].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner transition-colors hover:border-green-700 hover:text-white"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>{text}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-950/20 p-8 rounded-3xl border border-red-700/30 shadow-inner hover:border-red-600 transition-colors group">
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-white group-hover:text-red-300 transition-colors"><div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-900 flex items-center justify-center shadow-lg"><X className="text-red-500 w-5 h-5 animate-in zoom-in" /></div> Fora da tese:</h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {["Ideias apenas no papel", "Modelos B2C", "Projetos side-hustle", "Agências/Consultorias"].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner transition-colors hover:border-red-700 hover:text-white"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>{text}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER CTA - HIGH IMPACT & RESPONSIVE */}
      <footer className="border-t border-slate-800 bg-[#030712] relative z-10">
        <div className="container mx-auto px-6 py-24 text-center animate-in fade-in duration-500">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter leading-none transition-colors hover:text-cyan-300">Pronto para escalar <br className="hidden sm:block" /> sua startup?</h2>
          <p className="text-slate-300 mb-12 max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed delay-100">As vagas são limitadas. Dê o primeiro passo para conectar seu negócio ao Grupo Montreal.</p>
          <button onClick={() => setIsModalOpen(true)} className="group bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xl px-12 py-5 sm:px-16 sm:py-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] active:scale-95 animate-in fade-in duration-500 delay-200">
            Aplicar para o Batch 2026
            <ArrowRight className="w-6 h-6 inline-block ml-3 group-hover:translate-x-1 transition-transform animate-pulse" />
          </button>
        </div>
      </footer>

      {/* MODAL DO FORMULÁRIO - GLASSMORPHISM CONTRÁSTICO & MULTI-STEP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/95 backdrop-blur-md animate-in fade-in transition-opacity">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_100px_rgba(6,182,212,0.15)] animate-in slide-in-from-bottom-8">

            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors group">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 transition-colors group-hover:text-cyan-400">
                <Target className="w-6 h-6 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-in zoom-in delay-100" /> Avaliação MoVe
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-all bg-slate-800 p-2.5 rounded-full hover:bg-slate-700 hover:scale-110 active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-1 bg-slate-800 w-full relative shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
                  <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-cyan-500/50 pb-3 flex items-center gap-2 transition-colors hover:text-cyan-300"><Users className="w-5 h-5 text-cyan-400" /> Identificação</h3>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Nome do Founder</label>
                    <input type="text" name="founderName" value={formData.founderName} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700" placeholder="Ex: João Silva" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Nome da Startup</label>
                    <input type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700" placeholder="Ex: TechNova" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">E-mail Corporativo</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700" placeholder="joao@technova.com" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 delay-100 relative">
                  <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-cyan-500/50 pb-3 flex items-center gap-2 transition-colors hover:text-cyan-300"><Milestone className="w-5 h-5 text-cyan-400" /> Estágio do Negócio</h3>
                  <div className="relative">
                    <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Modelo de Negócio</label>
                    <select name="model" value={formData.model} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none font-medium hover:border-cyan-500/50 active:scale-95 transition-all shadow-inner pr-12 focus:shadow-lg focus:shadow-cyan-500/10">
                      <option value="B2B" className='bg-slate-900'>B2B (Business to Business)</option>
                      <option value="B2C" className='bg-slate-900'>B2C (Business to Consumer)</option>
                      <option value="B2B2C" className='bg-slate-900'>B2B2C</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.8rem] pointer-events-none group-active:text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Maturidade</label>
                    <select name="stage" value={formData.stage} onChange={handleInputChange} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 appearance-none font-medium hover:border-cyan-500/50 active:scale-95 transition-all shadow-inner pr-12 focus:shadow-lg focus:shadow-cyan-500/10">
                      <option value="Ideia" className='bg-slate-900'>Apenas Ideia (Pré-MVP)</option>
                      <option value="MVP" className='bg-slate-900'>MVP Validado (Sem receita)</option>
                      <option value="Tracao" className='bg-slate-900'>Tração (Com faturamento recorrente)</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-[2.8rem] pointer-events-none group-active:text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  {formData.stage === 'Tracao' && (
                    <div className="animate-in zoom-in-95 duration-300 shadow-[0_0_30px_rgba(6,182,212,0.1)] p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/50">
                      <label className="block text-sm text-cyan-400 mb-2 font-bold flex items-center gap-2 transition-colors hover:text-cyan-300"><TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" /> Faturamento Mensal Atual (MRR)</label>
                      <input type="text" name="mrr" value={formData.mrr} onChange={handleInputChange} className="w-full bg-cyan-950/30 border border-cyan-500/50 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-bold transition-all shadow-inner focus:shadow-lg focus:shadow-cyan-500/20 placeholder:font-medium placeholder:text-cyan-900" placeholder="Ex: R$ 15.000" />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 delay-100">
                  <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-cyan-500/50 pb-3 flex items-center gap-2 transition-colors hover:text-cyan-300"><Lightbulb className="w-5 h-5 text-cyan-400" /> O Grande Desafio</h3>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2 font-bold transition-colors hover:text-white">Descreva o problema que sua startup resolve:</label>
                    <textarea name="challenge" value={formData.challenge} onChange={handleInputChange} rows={8} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-all font-medium custom-scrollbar shadow-inner focus:shadow-lg focus:shadow-cyan-500/10 placeholder:font-medium placeholder:text-slate-700 hover:border-cyan-500/30 active:scale-[0.98]" placeholder="Venda o seu negócio. Qual dor do mercado vocês atacam e qual o seu diferencial competitivo? FOQUE EM CLAREZA E DADOS."></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-950 shadow-inner group-active:border-slate-700 transition-colors">
              {step > 1 ? (
                <button onClick={prevStep} className="px-6 py-3 text-slate-300 hover:text-white font-bold transition-all rounded-xl hover:bg-slate-800 hover:-translate-x-0.5 shadow hover:shadow-cyan-500/5 active:scale-90">Voltar</button>
              ) : <div></div>}

              {step < 3 ? (
                <button onClick={nextStep} className="flex items-center gap-3 bg-white text-slate-950 px-9 py-3 rounded-xl font-black text-lg hover:bg-slate-200 transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/15 active:scale-95">
                  Avançar <ChevronRight className="w-5 h-5 animate-in slide-in-from-left-2 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button onClick={handleSubmit} className="flex items-center gap-3 bg-cyan-500 text-slate-950 px-9 py-3 rounded-xl font-black text-lg hover:bg-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/20 hover:shadow-[0_8px_30px_rgba(6,182,212,0.4)] active:scale-95 animate-in fade-in">
                  Concluir Inscrição <CheckCircle2 className="w-5 h-5 animate-pulse transition-transform group-hover:scale-110" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}