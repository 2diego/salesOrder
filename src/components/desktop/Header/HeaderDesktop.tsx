import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BtnBlue from '../../BtnBlue/BtnBlue';
import HeaderNotification from '../HeaderNotification/HeaderNotification';
import CreateLink from '../../../pages/Admin/Orders/CreateLink';
import './HeaderDesktop.css';

const HeaderDesktop = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateLinkPopup, setShowCreateLinkPopup] = useState(false);

  const handleNavigateToOrders = () => {
    navigate('/Orders');
  };

  const handleNavigateToCreateLink = () => {
    setShowCreateLinkPopup(true);
  };

  const handleCloseCreateLinkPopup = () => {
    setShowCreateLinkPopup(false);
  };

  const handleLogout = () => {
    // Implementar logica de logout
    console.log('Logout clicked');
    setShowUserMenu(false);
  };

  const handleProfile = () => {
    navigate('/Profile');
    setShowUserMenu(false);
  };

  return (
    <header className="header-desktop">
      <div className="header-left">
        <div className="button-with-notification" onClick={handleNavigateToOrders}>
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
            count={3} 
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
        <span className="header-right-text">Bienvenido, {'user.name'}</span>
        <div className="user-menu-container">
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
              
              <div className="dropdown-item logout" onClick={handleLogout}>
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
    </header>
  );
};

export default HeaderDesktop;
