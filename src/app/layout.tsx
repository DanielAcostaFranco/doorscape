import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DoorScape',
  description: 'A collaborative 3D escape-room adventure.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
