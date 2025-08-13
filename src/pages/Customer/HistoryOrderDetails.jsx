import Header from "../../components/Header";
import SectionTitle from "../../components/SectionTitle";
import BtnBlue from "../../components/BtnBlue";
import { Link } from "react-router-dom";
import ProductList from "../../components/ProductList";

const HistoryOrderDetails = () => {

  const products = [ // TODO: Buscar productos en la base de datos
      { id: 1, name: 'Producto 1', quantity: 2 },
      { id: 2, name: 'Producto 2', quantity: 1 },
      { id: 3, name: 'Producto 3', quantity: 4 },
      { id: 4, name: 'Producto 4', quantity: 3 },
      { id: 5, name: 'Producto 5', quantity: 2 },
      { id: 6, name: 'Producto 6', quantity: 5 },
    ]

  return (
    <>
            {/* Header */}        
            <Header title="Pedido Nº 00000005" subtitle="12/02/2024">
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

            {/* Order Details */}
            <ProductList 
              products={products}
              showQuantityControls={false}
              showExpandArrow={false}
            />


            
            {/* Bottom Actions */}
            <div className="bottom-actions">
              {/* Send Order Button */}
              <BtnBlue width="100%" height="3rem">
                <span>Repetir pedido</span>
              </BtnBlue>
      
              {/* Back Button */}
              <div style={{ marginBottom: '2rem', width: '100%' }}>
                <Link to="/CustomerOrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default HistoryOrderDetails;


/* Para OrderHistory (read only):
        <ProductList 
          products={cartProducts}
          showQuantityControls={false}
          showExpandArrow={false}
        />

        */