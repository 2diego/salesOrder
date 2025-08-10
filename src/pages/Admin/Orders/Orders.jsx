import Header from "../../../components/Header";
import BtnBlue from "../../../components/BtnBlue"
import NavTo from "../../../components/NavTo";
import { LuPlus, LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle";

const Orders = () => {

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuClipboardList />
      </Header>

      {/* Orders Title */}
      <SectionTitle>
        <h2>Pedidos sin validar</h2>
      </SectionTitle>

      {/* Orders History */}
      <Link to="/OrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Historial de pedidos" />
      </Link>

      {/* Generate Link Button */}
      <BtnBlue width="100%" height="3rem">
        <LuPlus style={{ fontSize: "1.5rem" }} /><span>Generar link</span>
      </BtnBlue>
    </>
  )
}

export default Orders