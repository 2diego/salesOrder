import Header from "../../components/Header"
import SectionTitle from "../../components/SectionTitle"
import ProductList from "../../components/ProductList"
import BtnBlue from "../../components/BtnBlue"
import { useState } from "react"
import { Link } from "react-router-dom"

const Cart = () => {

const [products, setProducts] = useState([ // TODO: Buscar productos en la base de datos
    { id: 1, name: 'Producto 1', quantity: 0 },
    { id: 2, name: 'Producto 2', quantity: 0 },
    { id: 3, name: 'Producto 3', quantity: 0 },
    { id: 4, name: 'Producto 4', quantity: 0 },
    { id: 5, name: 'Producto 5', quantity: 0 },
    { id: 6, name: 'Producto 6', quantity: 0 },
  ])

  const updateQuantity = (productId, change) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    )
  }

  return (
    <>
      {/* Header */}        
      <Header title="Pedido Nº 00000005" subtitle="12/02/2024">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 3.5L5 8L9.5 12.5" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 8H14" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>

        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
          {/* Cuerpo del carrito */}
          <path d="M3 3h2.4l1.8 9.6a2 2 0 0 0 2 1.6h7.4a1.6 1.6 0 0 0 1.6-1.2L21 6H6.8"
            stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Ruedas */}
          <circle cx="10.5" cy="19" r="1.4" stroke="#000" strokeWidth="1.2" fill="none"/>
          <circle cx="18.5" cy="19" r="1.4" stroke="#000" strokeWidth="1.2" fill="none"/>

          {/* Conexion rueda trasera a carro */}
          <line x1="10.5" y1="17.6" x2="10.5" y2="14.2" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Conexion entre ruedas */}
          <line x1="10.5" y1="17.6" x2="18.5" y2="17.6" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>

      </Header>
      
      {/* Orders Title */}
      <SectionTitle>
        <h2>Nombre Cliente</h2>
      </SectionTitle>
      
      {/* Products List */}
      <ProductList 
        products={products}
        onQuantityChange={updateQuantity}
        showQuantityControls={true}
        showExpandArrow={true}
      />

      {/* Bottom Actions */}
      <div className="bottom-actions">
        {/* Send Order Button */}
        <BtnBlue width="100%" height="3rem">
          <span>Enviar pedido</span>
        </BtnBlue>

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

export default Cart;
