import { useState } from 'react'
import FilterButton from '../../components/FilterButton'
import './NewOrder.css'
import BtnBlue from '../../components/BtnBlue'
import Header from '../../components/Header'
import FormField from '../../components/FormField'
import ProductList from '../../components/ProductList'
import SectionTitle from '../../components/SectionTitle'
import { Link } from 'react-router-dom'

const NewOrder = () => {
  const [activeCategory, setActiveCategory] = useState('Todos')

  const [products, setProducts] = useState([ // TODO: Buscar productos en la base de datos
    { id: 1, name: 'Producto 1', quantity: 0 },
    { id: 2, name: 'Producto 2', quantity: 0 },
    { id: 3, name: 'Producto 3', quantity: 0 },
  ])

  const categories = ['Todos', 'Categ. 1', 'Categ. 2'] // TODO: Agregar carrusel de categorías y buscar categorías en la base de datos

  const updateQuantity = (productId, change) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    )
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    // TODO: Agregar logica para filtrar productos por categoría
    console.log('Categoría seleccionada:', category)
  }

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

        {/* Customer Name Field */} {/* TODO: Agregar lógica para obtener el nombre del cliente - Deberia ser un FORM? */}
        <FormField
          label="Nombre cliente"
          value={"Nombre cliente"}
          editable={false}
        />
        

        {/* Address Field */} {/* TODO: Agregar lógica para obtener la dirección del cliente - Deberia ser un FORM? */}
        <FormField 
          label="Direccion"
          value={"Direccion"}
          editable={false}
        />

        {/* Products Title */}
        <SectionTitle>
          <h2>Productos</h2>
        </SectionTitle>

        {/* Category Filter */}
        <FilterButton 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          showArrows={true}
        />

        {/* Products List */}
        <ProductList 
          products={products}
          onQuantityChange={updateQuantity}
          showQuantityControls={true}
          showExpandArrow={true}
        />
        {/* Para OrderHistory (read only):
        <ProductList 
          products={cartProducts}
          showQuantityControls={false}
          showExpandArrow={false}
        />

        */}
        

        {/* Bottom Actions */}
        <div className="bottom-actions">
          {/* View Order Button */}
          <BtnBlue width="100%" height="3rem">
            <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.8256 4.51906C20.6831 4.34851 20.4723 4.24996 20.25 4.25H5.12625L4.66781 1.73187C4.53823 1.01862 3.91711 0.500105 3.19219 0.5H1.5C1.08579 0.5 0.75 0.835786 0.75 1.25C0.75 1.66421 1.08579 2 1.5 2H3.1875L5.58375 15.1522C5.65434 15.5422 5.82671 15.9067 6.08344 16.2087C5.09996 17.1273 4.97046 18.6409 5.7836 19.7132C6.59675 20.7855 8.08911 21.0692 9.23899 20.37C10.3889 19.6709 10.8238 18.2154 10.2459 17H14.5041C14.3363 17.3513 14.2495 17.7357 14.25 18.125C14.25 19.5747 15.4253 20.75 16.875 20.75C18.3247 20.75 19.5 19.5747 19.5 18.125C19.5 16.6753 18.3247 15.5 16.875 15.5H7.79719C7.43472 15.4999 7.12417 15.2407 7.05937 14.8841L6.76219 13.25H17.6372C18.7246 13.2498 19.6563 12.4721 19.8506 11.4022L20.9906 5.13406C21.0297 4.91473 20.9692 4.68938 20.8256 4.51906ZM9 18.125C9 18.7463 8.49632 19.25 7.875 19.25C7.25368 19.25 6.75 18.7463 6.75 18.125C6.75 17.5037 7.25368 17 7.875 17C8.49632 17 9 17.5037 9 18.125ZM18 18.125C18 18.7463 17.4963 19.25 16.875 19.25C16.2537 19.25 15.75 18.7463 15.75 18.125C15.75 17.5037 16.2537 17 16.875 17C17.4963 17 18 17.5037 18 18.125ZM18.375 11.1341C18.31 11.4917 17.9979 11.7513 17.6344 11.75H6.48938L5.39906 5.75H19.3509L18.375 11.1341Z" fill="#F7FAFC"/>
            </svg>
            <span>Ver pedido</span>
          </BtnBlue>

          {/* Order History Button */}
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/CustomerOrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
              <BtnBlue width="100%" height="3rem">
                <svg width="24" height="24" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 7C18 7.41421 17.6642 7.75 17.25 7.75H0.75C0.335786 7.75 0 7.41421 0 7C0 6.58579 0.335786 6.25 0.75 6.25H17.25C17.6642 6.25 18 6.58579 18 7ZM0.75 1.75H17.25C17.6642 1.75 18 1.41421 18 1C18 0.585786 17.6642 0.25 17.25 0.25H0.75C0.335786 0.25 0 0.585786 0 1C0 1.41421 0.335786 1.75 0.75 1.75ZM17.25 12.25H0.75C0.335786 12.25 0 12.5858 0 13C0 13.4142 0.335786 13.75 0.75 13.75H17.25C17.6642 13.75 18 13.4142 18 13C18 12.5858 17.6642 12.25 17.25 12.25Z" fill="#F7FAFC"/>
                </svg>
                <span>Historial de pedidos</span>
              </BtnBlue>
            </Link>
          </div>

          {/* Footer Text */}
          <div className="expiration-text">
            <span>Este enlace caduca en 24 horas</span>
          </div>
        </div>
      </>
  )
}

export default NewOrder