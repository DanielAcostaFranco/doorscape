import Link from 'next/link';
import { themes } from '@/content/themes';

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">WDD 430 team project</p>
        <h1>DoorScape</h1>
        <p className="muted">
          A collaborative escape-room adventure built with Next.js, React Three Fiber,
          and Three.js.
        </p>
        <Link href="/room-101">Explore Door 101 · The Final Chapter →</Link>
      </section>

      <section>
        <h2>Choose a theme</h2>
        <div className="theme-grid">
          {themes.map((theme) => (
            <Link className="theme-card" href={`/themes/${theme.id}`} key={theme.id}>
              <h3>{theme.name}</h3>
              <p className="muted">Owner: {theme.owner}</p>
              <p>{theme.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
