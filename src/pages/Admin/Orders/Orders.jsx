import Header from "../../../components/Header";
import BtnBlue from "../../../components/BtnBlue"
import NavTo from "../../../components/NavTo";
import { LuPlus, LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";

const Orders = () => {
  return (
    <>
      <Header text="Nombre usuario">
        <LuPlus style={{rotate: "45deg"}} />
        <LuClipboardList />
      </Header>
      <h2>Pedidos sin validar</h2>
      <Link to="/OrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Historial de pedidos" />
      </Link>
      <BtnBlue width="100%" height="3rem">
        <LuPlus style={{ fontSize: "1.5rem" }} /><p>Generar link</p>
      </BtnBlue>
    </>
  )
}

export default Orders