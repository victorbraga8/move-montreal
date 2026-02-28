export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-800 bg-[#010205] relative z-10 ">
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <p className="text-sm text-slate-400">
            © {year} <span className="text-slate-200 font-semibold">Montreal Ventures</span>. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}