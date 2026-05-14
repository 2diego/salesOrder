import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BtnBlue from '../../components/common/BtnBlue/BtnBlue';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const u = username.trim();
    if (!u || !password) {
      setError('Ingresá usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(u, password);
      navigate('/', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      noValidate
    >
      <div className="login-field">
        <label className="login-label" htmlFor="login-username">
          Usuario
        </label>
        <div className="login-input-wrap">
          <input
            id="login-username"
            name="username"
            className="login-input"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'login-error' : undefined}
            disabled={loading}
          />
        </div>
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="login-password">
          Contraseña
        </label>
        <div className="login-input-wrap">
          <input
            id="login-password"
            name="password"
            className="login-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'login-error' : undefined}
            disabled={loading}
          />
        </div>
      </div>

      {error ? (
        <p id="login-error" className="login-feedback login-feedback--error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="login-actions">
        <BtnBlue
          width="100%"
          height="3rem"
          borderRadius="0.75rem"
          background="linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))"
          htmlType="submit"
          disabled={loading}
        >
          <span>{loading ? 'Entrando…' : 'Iniciar sesión'}</span>
        </BtnBlue>
      </div>
    </form>
  );
}
