'use client';

import { useEffect, useState } from 'react';

type AttendanceStatus = 'Presente' | 'Tarde' | 'Ausente';

type Student = {
  id: string;
  name: string;
  group: string;
  email: string;
  attendance: { date: string; status: AttendanceStatus }[];
  notes: string[];
};

type DashboardData = {
  totalStudents: number;
  totalPresentes: number;
  totalTardes: number;
  totalAusentes: number;
  totalNotas: number;
  students: Student[];
};

const initialStudent = {
  name: '',
  group: '',
  email: '',
};

export default function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [newStudent, setNewStudent] = useState(initialStudent);
  const [attendanceForm, setAttendanceForm] = useState({ studentId: '', status: 'Presente' as AttendanceStatus });
  const [noteForm, setNoteForm] = useState({ studentId: '', text: '' });
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    const response = await fetch('/api/metrics');
    const data = await response.json();
    setDashboard(data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStudentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newStudent.name || !newStudent.group) return;

    setLoading(true);
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });

    if (response.ok) {
      setNewStudent(initialStudent);
      await fetchDashboard();
    }
    setLoading(false);
  };

  const handleAttendanceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!attendanceForm.studentId) return;

    setLoading(true);
    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceForm),
    });

    if (response.ok) {
      setAttendanceForm({ studentId: '', status: 'Presente' });
      await fetchDashboard();
    }
    setLoading(false);
  };

  const handleNoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!noteForm.studentId || !noteForm.text.trim()) return;

    setLoading(true);
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteForm),
    });

    if (response.ok) {
      setNoteForm({ studentId: '', text: '' });
      await fetchDashboard();
    }
    setLoading(false);
  };

  const statusColors: Record<AttendanceStatus, string> = {
    Presente: '#22c55e',
    Tarde: '#f59e0b',
    Ausente: '#ef4444',
  };

  return (
    <main className="container">
      <header className="hero">
        <div>
          <p className="eyebrow">MiRed IPS</p>
          <h1>Escuela de Calidad 2026</h1>
          <p className="subtitle">Control de asistencia, participación y notas del programa Yellow Belt.</p>
        </div>
        <button className="demo-button" onClick={() => fetch('/api/seed', { method: 'POST' }).then(fetchDashboard)}>
          Cargar datos demo
        </button>
      </header>

      {dashboard ? (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <span>Estudiantes</span>
              <strong>{dashboard.totalStudents}</strong>
            </article>
            <article className="stat-card">
              <span>Presentes</span>
              <strong>{dashboard.totalPresentes}</strong>
            </article>
            <article className="stat-card">
              <span>Tardes</span>
              <strong>{dashboard.totalTardes}</strong>
            </article>
            <article className="stat-card">
              <span>Ausentes</span>
              <strong>{dashboard.totalAusentes}</strong>
            </article>
            <article className="stat-card accent">
              <span>Notas registradas</span>
              <strong>{dashboard.totalNotas}</strong>
            </article>
          </section>

          <section className="panel-grid">
            <form className="panel" onSubmit={handleStudentSubmit}>
              <h2>Nuevo estudiante</h2>
              <input
                placeholder="Nombre completo"
                value={newStudent.name}
                onChange={(event) => setNewStudent({ ...newStudent, name: event.target.value })}
              />
              <input
                placeholder="Grupo / cohorte"
                value={newStudent.group}
                onChange={(event) => setNewStudent({ ...newStudent, group: event.target.value })}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={newStudent.email}
                onChange={(event) => setNewStudent({ ...newStudent, email: event.target.value })}
              />
              <button disabled={loading} type="submit">Guardar estudiante</button>
            </form>

            <form className="panel" onSubmit={handleAttendanceSubmit}>
              <h2>Registrar asistencia</h2>
              <select
                value={attendanceForm.studentId}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, studentId: event.target.value })}
              >
                <option value="">Selecciona un estudiante</option>
                {dashboard.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <select
                value={attendanceForm.status}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, status: event.target.value as AttendanceStatus })}
              >
                <option value="Presente">Presente</option>
                <option value="Tarde">Tarde</option>
                <option value="Ausente">Ausente</option>
              </select>
              <button disabled={loading} type="submit">Guardar asistencia</button>
            </form>

            <form className="panel" onSubmit={handleNoteSubmit}>
              <h2>Agregar nota</h2>
              <select
                value={noteForm.studentId}
                onChange={(event) => setNoteForm({ ...noteForm, studentId: event.target.value })}
              >
                <option value="">Selecciona un estudiante</option>
                {dashboard.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Escribe la observación o nota del estudiante..."
                rows={4}
                value={noteForm.text}
                onChange={(event) => setNoteForm({ ...noteForm, text: event.target.value })}
              />
              <button disabled={loading} type="submit">Guardar nota</button>
            </form>
          </section>

          <section className="list-panel">
            <h2>Listado de estudiantes</h2>
            <div className="student-list">
              {dashboard.students.map((student) => {
                const lastAttendance = student.attendance.at(-1)?.status ?? 'Ausente';

                return (
                  <article key={student.id} className="student-item">
                    <div>
                      <h3>{student.name}</h3>
                      <p>{student.group}</p>
                      <small>{student.email}</small>
                    </div>
                    <div className="student-meta">
                      <span className="tag" style={{ background: statusColors[lastAttendance] }}>
                        {lastAttendance}
                      </span>
                      <ul>
                        {student.notes.length ? (
                          student.notes.map((note, index) => <li key={`${student.id}-${index}`}>{note}</li>)
                        ) : (
                          <li>Sin observaciones</li>
                        )}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <p className="empty-state">Cargando información...</p>
      )}
    </main>
  );
}
