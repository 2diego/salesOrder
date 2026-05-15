import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BtnBlue from '../../common/BtnBlue/BtnBlue';
import HeaderNotification from '../HeaderNotification/HeaderNotification';
import CreateLink from '../../../pages/Admin/mobile/Orders/CreateLink';
import { ordersService, OrderStatus } from '../../../services/ordersService';
import { useAuth } from '../../../context/AuthContext';
import { useLogoutConfirm } from '../../../hooks/useLogoutConfirm';
import './HeaderDesktop.css';

const HeaderDesktop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, displayName } = useAuth();
  const { requestLogout, logoutDialog } = useLogoutConfirm({
    variant: 'desktop',
    onConfirmed: () => navigate('/login', { replace: true }),
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateLinkPopup, setShowCreateLinkPopup] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUserMenu) return;
    const handlePointerDown = (e: PointerEvent) => {
      const root = userMenuRef.current;
      if (root && !root.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [showUserMenu]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const result = await ordersService.findPaged({
          page: 1,
          limit: 1,
          status: OrderStatus.PENDING,
        });
        setPendingOrdersCount(result.total || 0);
      } catch (err) {
        console.warn('Error al cargar conteo de pedidos pendientes:', err);
        setPendingOrdersCount(0);
      }
    };
    fetchPendingCount();
    // También refrescar al volver al tab
    const onFocus = () => fetchPendingCount();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [location.pathname, location.search]);

  const handleNavigateToUnvalidatedOrders = () => {
    navigate('/Orders?status=pending');
  };

  const handleNavigateToCreateLink = () => {
    setShowCreateLinkPopup(true);
  };

  const handleCloseCreateLinkPopup = () => {
    setShowCreateLinkPopup(false);
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    requestLogout();
  };

  const handleProfile = () => {
    navigate('/Profile');
    setShowUserMenu(false);
  };

  return (
    <header className="header-desktop">
      <div className="header-left">
        <div className="button-with-notification" onClick={handleNavigateToUnvalidatedOrders}>
          <BtnBlue
            width="12rem"
            height="2.75rem"
            borderRadius="0.5rem"
            isBackButton={false}
            background='linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))'
          >
            Pedidos sin validar
          </BtnBlue>
          <HeaderNotification 
            count={pendingOrdersCount} 
            variant="warning" 
            showZero={false}
          />
        </div>
        
        <BtnBlue
          width="12rem"
          height="2.75rem"
          borderRadius="0.5rem"
          isBackButton={false}
          background='linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))'
          onClick={handleNavigateToCreateLink}
        >
          Generar Link
        </BtnBlue>
      </div>

      <div className="header-right">
        <span className="header-right-text">
          Bienvenido, {displayName?.trim() || user?.username?.trim() || 'Usuario'}
        </span>
        <div className="user-menu-container" ref={userMenuRef}>
          <button 
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="avatar-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={handleProfile}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                </svg>
                <span>Perfil</span>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-item logout" onClick={handleLogoutClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z" fill="currentColor"/>
                  <path d="M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                </svg>
                <span>Salir</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Link Popup */}
      {showCreateLinkPopup && (
        <CreateLink 
          desktop={true} 
          onClose={handleCloseCreateLinkPopup}
        />
      )}
      {logoutDialog}
    </header>
  );
};

export default HeaderDesktop;
