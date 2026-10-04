import { promises as fs } from 'fs';
import path from 'path';
import { User, hashPassword } from './auth';

export interface Module {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  instructorId: string;
  students: string[];
  status: 'upcoming' | 'active' | 'completed';
  materials: string[];
  evaluations: string[];
}

export interface AppData {
  users: User[];
  modules: Module[];
}

const filePath = path.join(process.cwd(), 'data', 'app-data.json');

export async function readData(): Promise<AppData> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as AppData;
  } catch {
    const defaultData = await getDefaultData();
    await writeData(defaultData);
    return defaultData;
  }
}

async function getDefaultData(): Promise<AppData> {
  const adminPasswordHash = await hashPassword('admin123');
  const instructorPasswordHash = await hashPassword('instructor123');
  const studentPasswordHash = await hashPassword('student123');

  return {
    users: [
      {
        id: 'user-1',
        email: 'admin@mired.com',
        name: 'Administrador MiRed',
        role: 'admin',
        password: adminPasswordHash,
      },
      {
        id: 'user-2',
        email: 'instructor@mired.com',
        name: 'Instructor Yellow Belt',
        role: 'instructor',
        password: instructorPasswordHash,
      },
      {
        id: 'user-3',
        email: 'student@mired.com',
        name: 'Estudiante Ejemplo',
        role: 'student',
        password: studentPasswordHash,
      },
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Yellow Belt',
        description: 'Módulo de mejora continua orientado a Lean Six Sigma.',
        startDate: '2026-10-10',
        endDate: '2026-11-30',
        instructorId: 'user-2',
        students: ['user-3'],
        status: 'active',
        materials: ['Diapositivas iniciales', 'Guía de trabajo'],
        evaluations: ['Evaluación inicial'],
      },
      {
        id: 'mod-2',
        title: 'Seguridad del Paciente',
        description: 'Diplomado institucional en seguridad del paciente.',
        startDate: '2026-11-01',
        endDate: '2026-12-15',
        instructorId: 'user-2',
        students: ['user-3'],
        status: 'upcoming',
        materials: ['Material de seguridad', 'Casos clínicos'],
        evaluations: ['Caso clínico final'],
      },
    ],
  };
}

export async function writeData(data: AppData): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const data = await readData();
  return data.users.find((user) => user.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const data = await readData();
  return data.users.find((user) => user.id === id) || null;
}

export async function getModules(): Promise<Module[]> {
  const data = await readData();
  return data.modules;
}

export async function createModule(module: Omit<Module, 'id'>): Promise<Module> {
  const data = await readData();
  const newModule: Module = {
    ...module,
    id: `mod-${Date.now()}`,
  };
  data.modules.push(newModule);
  await writeData(data);
  return newModule;
}

export async function getModuleById(id: string): Promise<Module | null> {
  const data = await readData();
  return data.modules.find((module) => module.id === id) || null;
}

export async function updateModule(id: string, updates: Partial<Module>): Promise<Module | null> {
  const data = await readData();
  const index = data.modules.findIndex((module) => module.id === id);
  if (index === -1) return null;

  data.modules[index] = { ...data.modules[index], ...updates };
  await writeData(data);
  return data.modules[index];
}
