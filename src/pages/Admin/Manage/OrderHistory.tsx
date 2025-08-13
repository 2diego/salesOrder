import Header from "../../../components/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle";
import BtnBlue from "../../../components/BtnBlue";
import InfoRow from "../../../components/InfoRow";
import { LuClipboardList } from 'react-icons/lu';

const OrderHistory = () => {
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
        <h2>Historial de pedidos</h2>
      </SectionTitle>

      {/* Order History Options */}
      <div style={{ marginBottom: '1.2rem !important' }}>
      <InfoRow
        columns={[
          <span key={'date'}>Fecha</span>,
          <span key={'id'}>Nro de pedido</span>,
          <span key={'client'}>Cliente</span>,
          <span key={'status'}>Estado</span>,
        ]}
        actionLabel="Ver más"
        actionIcon={<LuClipboardList />}
      />
      </div>
      <InfoRow
        columns={[
          <span key={'date'}>12/02/24</span>,
          <span key={'id'}>00000456</span>,
          <span key={'client'}>Juan Pérez</span>,
          <span key={'status'}>S/V</span>,
        ]}
        actionLabel="Ver detalle"
        actionIcon={<LuClipboardList />}
      />
      <InfoRow
        columns={[
          <span key={'date'}>12/02/24</span>,
          <span key={'id'}>00000456</span>,
          <span key={'client'}>Juan Pérez</span>,
          <span key={'status'}>V</span>,
        ]}
        actionLabel="Ver detalle"
        actionIcon={<LuClipboardList />}
      />

      {/* Back Button */}
      <Link to="/Manage" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default OrderHistory