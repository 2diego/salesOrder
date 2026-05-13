import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken } from '../../services/http';
import LoginForm from './LoginForm';
import './Login.css';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getStoredToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true">
            SalesOrder
          </span>
          <h1 className="login-brand-title">Administracion de pedidos</h1>
          <p className="login-brand-sub">Gestiona tus pedidos de manera eficiente</p>
        </div>

        <div className="login-section-title">
          <h2>Iniciar sesión</h2>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
