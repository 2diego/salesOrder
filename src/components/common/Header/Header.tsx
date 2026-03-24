import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Header = ({ title, subtitle, children }: HeaderProps) => {
  const childrenArray = React.Children.toArray(children);
  const [iconIzq, iconDer] = childrenArray;

  return (
    <div className="header-container">
      <div className="icon-left">{iconIzq}</div>
      <div className="header-text">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
      </div>
      <div className="icon-right">{iconDer}</div>
    </div>
  );
};



export default Header;
