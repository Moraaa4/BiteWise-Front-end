import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => (
  <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
    <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">restaurant</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-emerald-600">BiteWise</span>
      </Link>
      
      <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-10">
        <Link href="#how-it-works" className="text-sm font-semibold hover:text-emerald-500 transition-colors">Cómo funciona</Link>
        <Link href="#tu-cocina" className="text-sm font-semibold hover:text-emerald-500 transition-colors">Recetas</Link>
        <Link href="#impacto" className="text-sm font-semibold hover:text-emerald-500 transition-colors">Impacto</Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-bold px-4 py-2 hover:text-emerald-500 transition-all">Iniciar sesión</button>
      </div>
    </div>
  </header>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <Navbar />

      <main>
        <section className="relative px-6 pt-12 pb-12 lg:pt-20 lg:pb-24 max-w-7xl mx-auto lg:px-20 grid lg:grid-cols-2 gap-16 items-start">
          <article className="space-y-8 -mt-4 lg:-mt-6">
            <header className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Para estudiantes, independientes y encargados de hogar
              </span>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Cocina con <span className="text-emerald-500">BiteWise</span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
                Cocina fácil sin pensar. Ahorra tiempo, organiza costos y reduce el desperdicio de comida con nuestro asistente culinario.
              </p>
            </header>

            <ul className="space-y-3" role="list">
              {['Inventario en 30 segundos', '3 recetas listas de inmediato', 'Nunca olvides lo que compraste'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="material-symbols-outlined text-emerald-500 font-bold bg-emerald-100 rounded-full p-1 text-sm">check</span>
                  {item}
                </li>
              ))}
            </ul>

            <button className="bg-emerald-500 text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none flex items-center gap-2 hover:bg-emerald-600 transition-all">
              REGISTRATE
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </article>

          <figure className="relative self-start -mt-4 lg:-mt-6">
            <div className="aspect-[4/5] relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900">
              <Image 
                src="/kitchen.png" 
                alt="Persona cocinando de forma organizada"
                fill
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <div className="size-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ahorro Semanal</p>
                <p className="text-xl font-black">$35.00</p>
              </div>
            </figcaption>
          </figure>
        </section>

        <section id="tu-cocina" className="py-20 bg-white dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <header className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black">Tu cocina bajo control</h2>
              <p className="text-zinc-500 text-lg">Todo lo que necesitas para optimizar tu despensa en un solo lugar.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <article className="p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col items-start gap-6 hover:shadow-xl transition-shadow">
                <div className="size-14 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-3xl">inventory_2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-2xl">Gestión de Inventario</h3>
                  <p className="text-zinc-500">Visualiza tus ingredientes actuales de forma instantánea.</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {['Tomate', 'Pollo', 'Cebolla', 'Ajo', 'Pimentón', '+4 más'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white dark:bg-zinc-900 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>

              
              <article className="p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col items-start gap-6 hover:shadow-xl transition-shadow">
                <div className="size-14 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-3xl">skillet</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-2xl">Sugerencias de recetas</h3>
                  <p className="text-zinc-500">Recetas personalizadas basadas en lo que tienes hoy.</p>
                </div>
                <div className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-4 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                   <div className="size-16 rounded-xl bg-emerald-100 flex items-center justify-center overflow-hidden">
                     <Image src="/chiken.png" alt="Pollo" width={70} height={60} className="object-cover" />
                   </div>
                  <div>
                    <p className="text-lg font-bold">Pollo con Tomate</p>
                    <p className="text-sm text-zinc-500 font-medium italic">15 min • Dificultad Baja</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-4xl font-black mb-16 tracking-tight">En 3 simples pasos</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { n: 1, t: "Registra", d: "Registra rápidamente lo que hay en tu nevera." },
              { n: 2, t: "Descubre", d: "Te mostramos qué puedes cocinar ahora mismo sin salir de casa." },
              { n: 3, t: "Disfruta", d: "Sigue instrucciones y disfruta de tu comida saludable." }
            ].map(step => (
              <div key={step.n} className="space-y-6 group">
                <div className="size-20 mx-auto bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center text-3xl font-black text-emerald-500 shadow-xl border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold">{step.t}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
          <button className="mt-20 group inline-flex items-center gap-4 text-emerald-600 font-black text-2xl hover:gap-6 transition-all underline decoration-4 underline-offset-8 decoration-emerald-200">
            DEJA DE DESPERDICIAR COMIDA AHORA
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </section>

        <section id="impacto" className="py-20 px-6">
          <div
            className="max-w-5xl mx-auto bg-emerald-50 dark:bg-emerald-950/30 rounded-[3rem] p-12 lg:p-20 text-center space-y-8 border border-emerald-100 dark:border-emerald-900/50"
            style={{
              backgroundImage: "url('/desperdicio.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <h2 className="text-4xl lg:text-6xl font-black leading-tight">
              <span className="text-emerald-500">60%</span> del desperdicio de comida ocurre en casa*
            </h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
              *Food Waste Index Report 2024 UNEP
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">restaurant</span>
            </div>
            <span className="text-lg font-bold text-emerald-600">BiteWise</span>
          </div>
          <p className="text-sm text-zinc-500 font-medium">© 2025 BiteWise. Salvando tu despensa y el planeta.</p>
          <div className="flex gap-6">
             <span className="material-symbols-outlined text-zinc-400 hover:text-emerald-500 cursor-pointer transition-colors">share</span>
             <span className="material-symbols-outlined text-zinc-400 hover:text-emerald-500 cursor-pointer transition-colors">mail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}