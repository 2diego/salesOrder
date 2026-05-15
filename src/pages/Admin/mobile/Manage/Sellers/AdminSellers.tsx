import Header from "../../../../../components/common/Header/Header"
import { HeaderBackNavLink } from "../../../../../components/mobile/header/HeaderBackNavLink";
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import NavTo from "../../../../../components/common/NavTo/NavTo";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";

const AdminSellers = () => {
  return (
    <>
      {/* Header */}  
      <Header
        leftSlot={<HeaderBackNavLink to="/Manage" ariaLabel="Volver a administrar" />}
        rightSlot={<LiaToolsSolid fontSize={"1.75rem"} />}
      />

      {/* Manage Title */}
      <SectionTitle>
        <h2>Administrar vendedores</h2>
      </SectionTitle>

      {/* Manage Options */}
      <Link to="/Manage/SellersList" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Ver Vendedores" />
      </Link>
      <Link to="/Manage/AddSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Agregar Vendedores" />
      </Link>

      {/* Back Button */}
      <Link to="/Manage" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default AdminSellers