import { NextResponse } from 'next/server';
import { addNote } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.studentId || !body.text?.trim()) {
    return NextResponse.json({ error: 'studentId and text are required' }, { status: 400 });
  }

  try {
    const student = await addNote(body.studentId, body.text);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
}
