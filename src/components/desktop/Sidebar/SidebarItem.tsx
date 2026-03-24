import { Link } from 'react-router-dom';
import { IconType } from "react-icons";
import React from 'react';

interface SidebarItemProps {
  item: {
    id: string;
    label: string;
    icon: IconType;
    path: string;
  };
  isActive: boolean;
}

const SidebarItem = ({ item, isActive }: SidebarItemProps) => {
  return (
    <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
      <Link 
        to={item.path} 
        className="sidebar-item-link"
      >
        <span className="sidebar-item-icon">{React.createElement(item.icon)}</span>
        <span className="sidebar-item-label">{item.label}</span>
      </Link>
    </div>
  );
};

export default SidebarItem;