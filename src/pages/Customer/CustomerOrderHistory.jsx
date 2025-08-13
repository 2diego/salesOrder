import Header from "../../components/Header";
import SectionTitle from "../../components/SectionTitle";
import BtnBlue from "../../components/BtnBlue";
import { Link } from "react-router-dom";
import InfoRow from '../../components/InfoRow'
import { LuClipboardList } from 'react-icons/lu'

const CustomerOrderHistory = () => {
  return (
    <>
            {/* Header */}        
            <Header title="Historial de pedidos">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
    
              <svg width="24" height="24" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.25 0.75H1.75C0.921573 0.75 0.25 1.42157 0.25 2.25V15.75C0.25 16.5784 0.921573 17.25 1.75 17.25H18.25C19.0784 17.25 19.75 16.5784 19.75 15.75V2.25C19.75 1.42157 19.0784 0.75 18.25 0.75ZM18.25 15.75H1.75V2.25H18.25V15.75ZM14.5 5.25C14.5 7.73528 12.4853 9.75 10 9.75C7.51472 9.75 5.5 7.73528 5.5 5.25C5.5 4.83579 5.83579 4.5 6.25 4.5C6.66421 4.5 7 4.83579 7 5.25C7 6.90685 8.34315 8.25 10 8.25C11.6569 8.25 13 6.90685 13 5.25C13 4.83579 13.3358 4.5 13.75 4.5C14.1642 4.5 14.5 4.83579 14.5 5.25Z" fill="#0D141C"/>
              </svg>
            </Header>
    
            {/* Section Title */}
            <SectionTitle>
              <h2>Nombre cliente</h2>
            </SectionTitle>

            <InfoRow
              columns={[
                <span key={"date"}>12/02/24</span>,
                <span key={"orderId"}>Pedido Nº 00000456</span>,
              ]}
              actionLabel="Ver detalle"
              actionIcon={<LuClipboardList />}
              onActionClick={() => {/* ver detalle */}}
              onRowClick={() => {/* opcional: abrir detalle */}}
            />
            <InfoRow
              columns={[
                <span key={"date"}>06/02/24</span>,
                <span key={"orderId"}>Pedido Nº 00000426</span>,
              ]}
              actionLabel="Ver detalle"
              actionIcon={<LuClipboardList />}
              onActionClick={() => {/* ver detalle */}}
              onRowClick={() => {/* opcional: abrir detalle */}}
            />
            <InfoRow
              columns={[
                <span key={"date"}>02/02/24</span>,
                <span key={"orderId"}>Pedido Nº 00000386</span>,
              ]}
              actionLabel="Ver detalle"
              actionIcon={<LuClipboardList />}
              onActionClick={() => {/* ver detalle */}}
              onRowClick={() => {/* opcional: abrir detalle */}}
            />
            
            {/* Bottom Actions */}
            <div className="bottom-actions">

              {/* Back Button */}
              <div style={{ marginBottom: '2rem', width: '100%' }}>
                <Link to="/NewOrder" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <BtnBlue width="100%" height="3rem">
                    <span>Volver</span>
                  </BtnBlue>
                </Link>
              </div>
      
              {/* Footer Text */}
              <div className="expiration-text">
                <span>Este enlace caduca en 24 horas</span>
              </div>
            </div>
    </>
  );
};

export default CustomerOrderHistory;


/* Para OrderHistory (read only):
        <ProductList 
          products={cartProducts}
          showQuantityControls={false}
          showExpandArrow={false}
        />

        */