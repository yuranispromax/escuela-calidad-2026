import { NextResponse } from 'next/server';
import { writeData } from '@/lib/store';

const demoData = {
  students: [
    {
      id: 'stu-demo-1',
      name: 'María Torres',
      group: 'Cohorte 01',
      email: 'maria@mired.com',
      attendance: [
        { date: '2026-10-01', status: 'Presente' },
        { date: '2026-10-02', status: 'Tarde' },
      ],
      notes: ['Excelente participación en el taller de mejora continua.'],
    },
    {
      id: 'stu-demo-2',
      name: 'Carlos Mena',
      group: 'Cohorte 02',
      email: 'carlos@mired.com',
      attendance: [
        { date: '2026-10-02', status: 'Presente' },
      ],
      notes: ['Avanza con buenos resultados en DMAIC.'],
    },
  ],
};

export async function POST() {
  await writeData(demoData);
  return NextResponse.json({ message: 'Datos demo cargados correctamente.' });
}
