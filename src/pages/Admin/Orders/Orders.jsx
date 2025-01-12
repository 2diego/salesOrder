import Header from "../../../components/Header";
import BtnBlue from "../../../components/BtnBlue"
import NavTo from "../../../components/NavTo";
import { LuPlus, LuClipboardList } from "react-icons/lu";

const Orders = () => {
  return (
    <div>
      <Header text="Nombre usuario">
        <LuPlus style={{rotate: "45deg"}} />
        <LuClipboardList />
      </Header>
      <h2>Pedidos sin validar</h2>
      <NavTo text="Historial de pedidos" />
      <BtnBlue width="100%" height="3rem">
        <LuPlus style={{ fontSize: "1.5rem" }} /><p>Generar link</p>
      </BtnBlue>
    </div>
  )
}

export default Orders