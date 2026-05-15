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
  /** Contenido columna izquierda (icono atrás, cerrar sesión, etc.). */
  leftSlot?: React.ReactNode;
  /** Contenido columna derecha. */
  rightSlot?: React.ReactNode;
}

const Header = ({ title, subtitle, leftSlot, rightSlot }: HeaderProps) => {
  const { user, displayName } = useAuth();

  const resolvedTitle =
    title !== undefined ? title : displayName?.trim() || user?.username?.trim() || 'Usuario';

  const resolvedSubtitle =
    subtitle !== undefined ? subtitle : formatRoleSubtitle(user?.role);

  return (
    <div className="header-container">
      <div className="header-side header-side--start">{leftSlot}</div>
      <div className="header-text">
        <span className="title">{resolvedTitle}</span>
        <span className="subtitle">{resolvedSubtitle}</span>
      </div>
      <div className="header-side header-side--end">{rightSlot}</div>
    </div>
  );
};

export default Header;
