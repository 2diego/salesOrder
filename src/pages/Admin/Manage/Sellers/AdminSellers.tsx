import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import NavTo from "../../../../components/NavTo/NavTo";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";

const AdminSellers = () => {
  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LiaToolsSolid fontSize={"1.75rem"}/>
      </Header>

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