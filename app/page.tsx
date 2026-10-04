'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
}

interface Module {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  instructorId: string;
  students: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [showNewModuleForm, setShowNewModuleForm] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '', startDate: '', endDate: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsed = JSON.parse(stored) as User;
      setUser(parsed);
      fetchModules();
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  const fetchModules = async () => {
    const response = await fetch('/api/modules');
    if (response.ok) {
      const data = await response.json();
      setModules(data);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleCreateModule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const payload = {
      ...newModule,
      instructorId: user.id,
      students: [],
      status: 'upcoming',
      materials: [],
      evaluations: [],
    };

    const response = await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setNewModule({ title: '', description: '', startDate: '', endDate: '' });
      setShowNewModuleForm(false);
      await fetchModules();
    }
  };

  if (!user) return null;

  const stats = [
    { label: 'Módulos totales', value: modules.length, type: 'primary' },
    { label: 'Activos', value: modules.filter((m) => m.status === 'active').length, type: 'success' },
    { label: 'Próximos', value: modules.filter((m) => m.status === 'upcoming').length, type: 'warning' },
  ];

  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/assets/logos/mired-logo.svg" alt="MiRed IPS" />
              <span>Escuela de Calidad</span>
            </div>

            <ul className="nav-menu">
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Módulos</a></li>
              <li><a href="#">Academia</a></li>
            </ul>

            <div className="user-menu">
              <span>{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Bienvenido, {user.name}</h1>
            <p>Panel institucional para la gestión académica</p>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card ${stat.type}`}>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>

          {(user.role === 'admin' || user.role === 'instructor') && (
            <div style={{ marginBottom: '28px' }}>
              {!showNewModuleForm ? (
                <button className="btn-primary" style={{ width: '220px' }} onClick={() => setShowNewModuleForm(true)}>
                  + Nuevo módulo
                </button>
              ) : (
                <div className="table-container" style={{ padding: '20px' }}>
                  <h2 style={{ marginBottom: '18px' }}>Crear módulo</h2>
                  <form onSubmit={handleCreateModule}>
                    <div className="form-group">
                      <label>Título</label>
                      <input
                        type="text"
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        placeholder="Yellow Belt, Green Belt, Diplomado..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea
                        value={newModule.description}
                        onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                        rows={3}
                        placeholder="Descripción del programa"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label>Fecha de inicio</label>
                        <input
                          type="date"
                          value={newModule.startDate}
                          onChange={(e) => setNewModule({ ...newModule, startDate: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Fecha de fin</label>
                        <input
                          type="date"
                          value={newModule.endDate}
                          onChange={(e) => setNewModule({ ...newModule, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Guardar</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowNewModuleForm(false)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          <h2>Módulos</h2>
          <div className="modules-grid">
            {modules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="module-header">
                  <h3>{module.title}</h3>
                  <div className="module-meta">{module.startDate} - {module.endDate}</div>
                </div>
                <div className="module-body">
                  <span className={`module-status status-${module.status}`}>{module.status}</span>
                  <p className="module-description">{module.description}</p>
                  <div className="module-footer">
                    <button className="btn-accent">Ver detalles</button>
                    {(user.role === 'admin' || user.role === 'instructor') && (
                      <button className="btn-secondary">Editar</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
