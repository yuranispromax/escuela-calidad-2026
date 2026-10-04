import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Escuela de Calidad 2026 | MiRed IPS',
  description: 'Plataforma institucional para programas de calidad y seguridad del paciente.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
