import BtnBlue from "../../../components/BtnBlue"
import { LuPlus } from "react-icons/lu";

const Orders = () => {
  return (
    <div>
      <h1>Orders</h1>
      <BtnBlue width="100%" height="48px">
        <LuPlus style={{ fontSize: "24px" }} /><p>Generar link</p>
      </BtnBlue>
    </div>
  )
}

export default Orders