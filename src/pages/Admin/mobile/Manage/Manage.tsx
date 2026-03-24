import Header from "../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import NavTo from "../../../../components/common/NavTo/NavTo";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";

const Manage = () => {
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