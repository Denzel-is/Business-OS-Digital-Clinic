export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16 sm:px-10">
      <section aria-labelledby="foundation-title" className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Frontend foundation
        </p>
        <h1 id="foundation-title" className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Business OS: Digital Clinic
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Каркас приложения готов. Дизайн-система и полноценная главная страница будут добавлены
          отдельными проверяемыми этапами.
        </p>
      </section>
    </main>
  );
}
