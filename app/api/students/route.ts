import { NextResponse } from 'next/server';
import { addStudent, readData } from '@/lib/store';

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.students);
}

export async function POST(request: Request) {
  const body = await request.json();

  const student = await addStudent({
    name: body.name,
    group: body.group,
    email: body.email,
  });

  return NextResponse.json(student, { status: 201 });
}
