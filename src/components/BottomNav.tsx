import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LiaToolsSolid } from 'react-icons/lia';
import { LuUser2, LuClipboardList, LuFileBarChart } from "react-icons/lu";
import './BottomNav.css';

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState("Orders");
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith("/Orders")) {
      setActiveTab("Orders");
    } else if (currentPath.startsWith("/Reports")) {
      setActiveTab("Reports");
    } else if (currentPath.startsWith("/Manage")) {
      setActiveTab("Manage");
    } else if (currentPath.startsWith("/Profile")) {
      setActiveTab("Profile");
    }
  }, [location]);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
  }

  return (
    <div className="bottom-nav">
      <Link to={"/Orders"} style={{ textDecoration: 'none' }}
        className={`nav-item ${activeTab === "Orders" ? "active" : ""}`}
        onClick={() => handleNavClick("Orders")}
      >
        <LuClipboardList />
        <span>Pedidos</span>
      </Link>
      <Link to={"/Reports"} style={{ textDecoration: 'none' }}
        className={`nav-item ${activeTab === "Reports" ? "active" : ""}`}
        onClick={() => handleNavClick("Reports")}
      >
        <LuFileBarChart />
        <span>Reportes</span>
      </Link>
      <Link to={"/Manage"} style={{ textDecoration: 'none' }}
        className={`nav-item ${activeTab === "Manage" ? "active" : ""}`}
        onClick={() => handleNavClick("Manage")}
      >
        <LiaToolsSolid  />
        <span>Administrar</span>
      </Link>
      <Link to={"/Profile"} style={{ textDecoration: 'none' }}
        className={`nav-item ${activeTab === "Profile" ? "active" : ""}`}
        onClick={() => handleNavClick("Profile")}
      >
        <LuUser2 />
        <span>Perfil</span>
      </Link>
    </div>
  );
};

export default BottomNav;
