import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import React from 'react';

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: IconType;
  path: string;
};

type SidebarItemProps = {
  item: SidebarNavItem;
  isActive: boolean;
  /** Si está definido y el ítem es `logout`, se usa botón en lugar de `Link`. */
  onLogoutClick?: () => void;
};

const SidebarItem = ({ item, isActive, onLogoutClick }: SidebarItemProps) => {
  const content = (
    <>
      <span className="sidebar-item-icon">{React.createElement(item.icon)}</span>
      <span className="sidebar-item-label">{item.label}</span>
    </>
  );

  if (item.id === 'logout' && onLogoutClick) {
    return (
      <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
        <button type="button" className="sidebar-item-link" onClick={onLogoutClick}>
          {content}
        </button>
      </div>
    );
  }

  return (
    <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
      <Link to={item.path} className="sidebar-item-link">
        {content}
      </Link>
    </div>
  );
};

export default SidebarItem;
