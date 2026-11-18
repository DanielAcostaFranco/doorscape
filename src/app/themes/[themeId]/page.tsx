import Link from 'next/link';
import { notFound } from 'next/navigation';
import { themes } from '@/content/themes';

export function generateStaticParams() {
  return themes.map((theme) => ({ themeId: theme.id }));
}

export default async function ThemePage({ params }: { params: Promise<{ themeId: string }> }) {
  const { themeId } = await params;
  const theme = themes.find((item) => item.id === themeId);
  if (!theme) notFound();

  return (
    <main className="page">
      <p className="eyebrow">Theme workspace</p>
      <h1>{theme.name}</h1>
      <p className="muted">Owner: {theme.owner}</p>
      <p>{theme.description}</p>
      <p>{theme.roomCount} rooms are planned for this theme.</p>
      <Link href="/">← Back to DoorScape</Link>
    </main>
  );
}
