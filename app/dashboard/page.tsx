'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@mired.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const defaultAccounts = [
    { role: 'Admin', email: 'admin@mired.com', password: 'admin123' },
    { role: 'Instructor', email: 'instructor@mired.com', password: 'instructor123' },
    { role: 'Estudiante', email: 'student@mired.com', password: 'student123' },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Credenciales inválidas');
        setLoading(false);
        return;
      }

      Cookies.set('token', data.token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Error al iniciar sesión. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          <img src="/assets/logos/mired-logo.svg" alt="MiRed IPS" />
          <span>MiRed IPS</span>
        </div>

        <h1>Escuela de Calidad</h1>
        <p className="subtitle">Gestión institucional de formación académica</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@mired.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="error-message" style={{ marginTop: '20px' }}>
          <strong>Cuentas demo:</strong>
          {defaultAccounts.map((account) => (
            <div key={account.email} style={{ marginTop: '6px' }}>
              {account.role}: {account.email} / {account.password}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
