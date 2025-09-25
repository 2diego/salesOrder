import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import Header from "../../../components/Header/Header"
import { LuClipboardList } from "react-icons/lu";
import { useState } from "react";
import ProductList from "../../../components/ProductList/ProductList";
import BtnBlue from "../../../components/BtnBlue/BtnBlue";

const ValidateOrder = () => {

const [products, setProducts] = useState([ // TODO: Buscar productos en la base de datos
    { id: '1', name: 'Producto 1', quantity: 0 },
    { id: '2', name: 'Producto 2', quantity: 0 },
    { id: '3', name: 'Producto 3', quantity: 0 },
    { id: '4', name: 'Producto 4', quantity: 0 },
    { id: '5', name: 'Producto 5', quantity: 0 },
    { id: '6', name: 'Producto 6', quantity: 0 },
  ])

  const updateQuantity = (productId: string, change: number) => {
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
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuClipboardList />
      </Header>

      {/* Section Title */}
      <SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2>Nombre cliente</h2>
            <h4>Dirección de entrega</h4>
          </div>
          <BtnBlue width="100%" height="2.5rem">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256">
              <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none">
                <g transform="scale(10.66667,10.66667)">
                  <path d="M18,2c-1.64501,0 -3,1.35499 -3,3c0,0.19095 0.02179,0.37712 0.05664,0.55859l-7.13477,4.16211c-0.52334,-0.44285 -1.1898,-0.7207 -1.92187,-0.7207c-1.64501,0 -3,1.35499 -3,3c0,1.64501 1.35499,3 3,3c0.73208,0 1.39854,-0.27785 1.92188,-0.7207l7.13477,4.16016c-0.03509,0.18206 -0.05664,0.36893 -0.05664,0.56055c0,1.64501 1.35499,3 3,3c1.64501,0 3,-1.35499 3,-3c0,-1.64501 -1.35499,-3 -3,-3c-0.73252,0 -1.39841,0.27933 -1.92187,0.72266l-7.13477,-4.16406c0.03485,-0.18147 0.05664,-0.36764 0.05664,-0.55859c0,-0.19095 -0.02179,-0.37712 -0.05664,-0.55859l7.13477,-4.16211c0.52333,0.44285 1.1898,0.7207 1.92188,0.7207c1.64501,0 3,-1.35499 3,-3c0,-1.64501 -1.35499,-3 -3,-3zM18,4c0.56413,0 1,0.43587 1,1c0,0.56413 -0.43587,1 -1,1c-0.56413,0 -1,-0.43587 -1,-1c0,-0.56413 0.43587,-1 1,-1zM6,11c0.56413,0 1,0.43587 1,1c0,0.56413 -0.43587,1 -1,1c-0.56413,0 -1,-0.43587 -1,-1c0,-0.56413 0.43587,-1 1,-1zM18,18c0.56413,0 1,0.43587 1,1c0,0.56413 -0.43587,1 -1,1c-0.56413,0 -1,-0.43587 -1,-1c0,-0.56413 0.43587,-1 1,-1z"></path>
                </g>
              </g>
            </svg>
            <span>Vista previa</span>
          </BtnBlue>
        </div>
      </SectionTitle>

      {/* Products List */}
      <ProductList 
        products={products}
        onQuantityChange={updateQuantity}
        showQuantityControls={true}
        showExpandArrow={true}
      />

      <div className="btn-group">
        <button className="btn-gray">
          <span>Observaciones</span>
        </button>
        <button className="btn-gray">
          <span>Agregar productos</span>
        </button>
      </div>

      
      <BtnBlue width="100%" height="3rem">
        <span>Validar pedido</span>
      </BtnBlue>

      <div className="btn-container">
        <button className="btn-red">
          <span>Rechazar pedido</span>
        </button>
      </div>     

    </>
  )

}

export default ValidateOrder