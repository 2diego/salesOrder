import Header from "../../../../components/common/Header/Header";
import { Link } from "react-router-dom";
import NavTo from "../../../../components/common/NavTo/NavTo";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import { LuUser, LuLogOut } from "react-icons/lu";
import { useLogoutConfirm } from "../../../../hooks/useLogoutConfirm";
import { HeaderCloseIcon } from "../../../../components/mobile/header/MobileHeaderIcons";
import "../../../../components/common/NavTo/NavTo.css";
import "./Profile.css";

const Profile = () => {
  const { requestLogout, logoutDialog } = useLogoutConfirm();

  return (
    <>
      {/* Header */}
      <Header
        leftSlot={
          <button type="button" className="header-icon-button" onClick={requestLogout} aria-label="Cerrar sesión">
            <HeaderCloseIcon width={24} height={24} />
          </button>
        }
        rightSlot={<LuUser />}
      />
      {logoutDialog}

      {/* Manage Title */}
      <SectionTitle>
        <h2>Perfil de usuario</h2>
      </SectionTitle>

      {/* Manage Options */}
      <Link to="/Profile/EditProfile" className="profile-options-link">
        <NavTo text="Modificar datos de perfil" />
      </Link>
      <Link to="/Profile/EditPassword" className="profile-options-link">
        <NavTo text="Modificar contraseña" />
      </Link>
      <button
        type="button"
        className="navto-container profile-logout-row"
        onClick={requestLogout}
      >
        <p className="profile-logout-row__label">Cerrar sesión</p>
        <LuLogOut className="profile-logout-row__icon" aria-hidden />
      </button>
    </>
  );
};

export default Profile;
