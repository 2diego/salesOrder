import Header from "../../../components/Header/Header";
import BtnBlue from "../../../components/BtnBlue/BtnBlue"
import { LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import InfoRow from '../../../components/InfoRow/InfoRow'

const Orders = () => {

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuClipboardList />
      </Header>

      {/* Orders Title */}
      <SectionTitle>
        <h2>Pedidos sin validar</h2>
      </SectionTitle>
      
      <InfoRow
        columns={[
          <span key={'date'}>12/02/2024</span>,
          <span key={'client-name'}>Juan Perez</span>,
        ]}
        actionLabel="Ver pedido"
        actionIcon={<LuClipboardList />}
        onActionClick={() => {/* validar */}}
      />
      <InfoRow
        columns={[
          <span key={'date'}>12/02/2024</span>,
          <span key={'client-name'}>Ruben Gonzalez</span>,
        ]}
        actionLabel="Ver pedido"
        actionIcon={<LuClipboardList />}
        onActionClick={() => {/* validar */}}
      />
      <InfoRow
        columns={[
          <span key={'date'}>11/02/2024</span>,
          <span key={'client-name'}>Maria Gimenez</span>,
        ]}
        actionLabel="Ver pedido"
        actionIcon={<LuClipboardList />}
        onActionClick={() => {/* validar */}}
      />
      <InfoRow
        columns={[
          <span key={'date'}>10/02/2024</span>,
          <span key={'client-name'}>Miguel Martinez</span>,
        ]}
        actionLabel="Ver pedido"
        actionIcon={<LuClipboardList />}
        onActionClick={() => {/* validar */}}
      />


      {/* Bottom Actions Block */}
      <div className="bottom-actions-block" style={{
        position: 'fixed',
        bottom: 84,
        left: 0,
        right: 0,
      }}>

        {/* Generate Link Button */}
        <Link to="/OrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <BtnBlue width="100%" height="3rem">
            <span>Historial de pedidos</span>
          </BtnBlue>
        </Link>
        
      </div>
    </>
  )
}

export default Orders