import { NextResponse } from 'next/server';
import { addAttendance } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.studentId || !body.status) {
    return NextResponse.json({ error: 'studentId and status are required' }, { status: 400 });
  }

  try {
    const student = await addAttendance(body.studentId, body.status);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
}
