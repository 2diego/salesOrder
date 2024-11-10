import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LiaToolsSolid } from 'react-icons/lia';
import { LuUser2, LuClipboardList, LuFileBarChart } from "react-icons/lu";
import './BottomNav.css';

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState("Orders");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/Orders") {
      setActiveTab("Orders");
    } else if (currentPath === "/Reports") {
      setActiveTab("Reports");
    } else if (currentPath === "/Manage") {
      setActiveTab("Manage");
    } else if (currentPath === "/Profile") {
      setActiveTab("Profile");
    }
  }, [location]);

  const handleNavClick = (tab, route) => {
    setActiveTab(tab);
    navigate(route);
  }

  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${activeTab === "Orders" ? "active" : ""}`}
        onClick={() => handleNavClick("Orders", "/Orders")}
      >
        <LuClipboardList />
        <span>Pedidos</span>
      </div>
      <div
        className={`nav-item ${activeTab === "Reports" ? "active" : ""}`}
        onClick={() => handleNavClick("Reports", "/Reports")}
      >
        <LuFileBarChart />
        <span>Reportes</span>
      </div>
      <div
        className={`nav-item ${activeTab === "Manage" ? "active" : ""}`}
        onClick={() => handleNavClick("Manage", "/Manage")}
      >
        <LiaToolsSolid  />
        <span>Administrar</span>
      </div>
      <div
        className={`nav-item ${activeTab === "Profile" ? "active" : ""}`}
        onClick={() => handleNavClick("Profile", "/Profile")}
      >
        <LuUser2 />
        <span>Perfil</span>
      </div>
    </div>
  );
};

export default BottomNav;
