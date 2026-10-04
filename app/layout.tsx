import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Escuela de Calidad 2026',
  description: 'Panel de asistencia y notas para la Escuela de Calidad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
