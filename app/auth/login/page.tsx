import { NextResponse } from 'next/server';
import { getModuleById, updateModule } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const module = await getModuleById(params.id);
    if (!module) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }
    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener módulo' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateModule(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar módulo' }, { status: 500 });
  }
}
