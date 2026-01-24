export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">
            Corporativo Monarca
          </h1>
          <nav className="flex gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition" href="#">Servicios</a>
            <a className="hover:text-white transition" href="#">Experiencia</a>
            <a className="hover:text-white transition" href="#">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <section className="w-full">
          <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Defensa legal estratégica y confiable
              </h2>
              <p className="mt-6 text-slate-300 text-lg">
                Brindamos asesoría jurídica especializada para personas y empresas,
                con enfoque en resultados y absoluta confidencialidad.
              </p>

              <div className="mt-10 flex gap-4">
                <button className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Agenda una consulta
                </button>
                <button className="border border-slate-600 hover:border-white px-6 py-3 rounded-lg transition">
                  Contáctanos
                </button>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400">
                Imagen / Mockup
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-400 text-center">
          © {new Date().getFullYear()} Corporativo Monarca · Todos los derechos reservados
        </div>
      </footer>

    </div>
  );
}