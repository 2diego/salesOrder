import Header from "../../../../components/common/Header/Header"
import { useLogoutConfirm } from "../../../../hooks/useLogoutConfirm";
import { HeaderCloseIcon } from "../../../../components/mobile/header/MobileHeaderIcons";
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import NavTo from "../../../../components/common/NavTo/NavTo";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";

const Manage = () => {
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
        rightSlot={<LiaToolsSolid fontSize={"1.75rem"} />}
      />
      {logoutDialog}

      {/* Manage Title */}
      <SectionTitle>
        <h2>Administrar</h2>
      </SectionTitle>

      {/* Manage Options */}
      <Link to="/OrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Historial de pedidos" />
      </Link>
      <Link to="/Manage/AdminSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Administrar Vendedores" />
      </Link>
      <Link to="/Manage/AdminProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Administrar Productos" />
      </Link>
      <Link to="/Manage/AdminClients" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Administrar Clientes" />
      </Link>
    </>
  )
}

export default Manage