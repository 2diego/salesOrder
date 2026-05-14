import React from 'react';
import './Header.css';
import { useAuth } from '../../../context/AuthContext';
import { formatRoleSubtitle } from '../../../utils/roleLabel';

export interface HeaderProps {
  /**
   * Título del encabezado. Si no se envía, se usa el nombre del perfil,
   * el nombre de cuenta (username) o "Usuario".
   */
  title?: string;
  /** Subtítulo. Si no se envía, se deriva del rol de la sesión. */
  subtitle?: string;
  children: React.ReactNode;
}

const Header = ({ title, subtitle, children }: HeaderProps) => {
  const { user, displayName } = useAuth();

  const resolvedTitle =
    title !== undefined
      ? title
      : displayName?.trim() || user?.username?.trim() || 'Usuario';

  const resolvedSubtitle =
    subtitle !== undefined ? subtitle : formatRoleSubtitle(user?.role);

  const childrenArray = React.Children.toArray(children);
  const [iconIzq, iconDer] = childrenArray;

  return (
    <div className="header-container">
      <div className="icon-left">{iconIzq}</div>
      <div className="header-text">
        <span className="title">{resolvedTitle}</span>
        <span className="subtitle">{resolvedSubtitle}</span>
      </div>
      <div className="icon-right">{iconDer}</div>
    </div>
  );
};

export default Header;
