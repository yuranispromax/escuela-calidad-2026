import { promises as fs } from 'fs';
import path from 'path';

export type AttendanceStatus = 'Presente' | 'Tarde' | 'Ausente';

export type Student = {
  id: string;
  name: string;
  group: string;
  email: string;
  attendance: { date: string; status: AttendanceStatus }[];
  notes: string[];
};

export type AppData = {
  students: Student[];
};

const filePath = path.join(process.cwd(), 'data', 'app-data.json');

export async function readData(): Promise<AppData> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as AppData;
  } catch {
    const defaultData: AppData = { students: [] };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function writeData(data: AppData) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getDashboardData() {
  const data = await readData();

  const totalPresentes = data.students.reduce(
    (sum, student) => sum + student.attendance.filter((entry) => entry.status === 'Presente').length,
    0,
  );

  const totalTardes = data.students.reduce(
    (sum, student) => sum + student.attendance.filter((entry) => entry.status === 'Tarde').length,
    0,
  );

  const totalAusentes = data.students.reduce(
    (sum, student) => sum + student.attendance.filter((entry) => entry.status === 'Ausente').length,
    0,
  );

  const totalNotas = data.students.reduce((sum, student) => sum + student.notes.length, 0);

  return {
    totalStudents: data.students.length,
    totalPresentes,
    totalTardes,
    totalAusentes,
    totalNotas,
    students: data.students,
  };
}

export async function addStudent(student: Omit<Student, 'id' | 'attendance' | 'notes'>) {
  const data = await readData();
  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    name: student.name,
    group: student.group,
    email: student.email,
    attendance: [],
    notes: [],
  };

  data.students.push(newStudent);
  await writeData(data);
  return newStudent;
}

export async function addAttendance(studentId: string, status: AttendanceStatus) {
  const data = await readData();
  const student = data.students.find((entry) => entry.id === studentId);

  if (!student) {
    throw new Error('Student not found');
  }

  student.attendance.push({
    date: new Date().toISOString().slice(0, 10),
    status,
  });

  await writeData(data);
  return student;
}

export async function addNote(studentId: string, text: string) {
  const data = await readData();
  const student = data.students.find((entry) => entry.id === studentId);

  if (!student) {
    throw new Error('Student not found');
  }

  student.notes.push(text.trim());
  await writeData(data);
  return student;
}
