import { NextResponse } from 'next/server';
import { createModule, getModules } from '@/lib/store';

export async function GET() {
  try {
    const modules = await getModules();
    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener módulos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const module = await createModule({
      title: body.title,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
      instructorId: body.instructorId,
      students: body.students || [],
      status: body.status || 'upcoming',
      materials: body.materials || [],
      evaluations: body.evaluations || [],
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear módulo' }, { status: 500 });
  }
}
