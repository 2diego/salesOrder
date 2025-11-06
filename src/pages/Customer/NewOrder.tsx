import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterButton from '../../components/FilterButton/FilterButton'
import './NewOrder.css'
import BtnBlue from '../../components/BtnBlue/BtnBlue'
import Header from '../../components/Header/Header'
import FormField from '../../components/FormField/FormField'
import ProductList from '../../components/ProductList/ProductList'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { Link } from 'react-router-dom'
import { ordersLinksService } from '../../services/ordersLinksService'
import { clientsService } from '../../services/clientsService'
import { productsService, Product } from '../../services/productsService'
import { categoriesService } from '../../services/categoriesService'
import { ordersItemsService } from '../../services/ordersItemsService'

interface ProductItem {
  id: string
  name: string
  detail?: string
  quantity: number
  price?: number
}

const NewOrder = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Data cliente y orden
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  // Productos y categorías
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<string[]>(['Todos'])
  const [activeCategory, setActiveCategory] = useState('Todos')
  // Mantener registro de las cantidades de productos
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
  // Estado para saber si el pedido ya fue enviado
  const [orderSent, setOrderSent] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setError('Token no encontrado en la URL')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // 1. Get order link data (con ID del cliente y orden)
        const orderLink = await ordersLinksService.findByToken(token)
        
        if (!orderLink.order?.client) {
          throw new Error('No se encontró información del cliente')
        }

        const clientId = orderLink.order.clientId
        const orderId = orderLink.orderId
        
        // Set numero y fecha de la orden
        setOrderNumber(`Pedido Nº ${orderId.toString().padStart(8, '0')}`)
        if (orderLink.createdAt) {
          const date = new Date(orderLink.createdAt)
          setOrderDate(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }))
        }

        // Set fecha de expiracion
        if (orderLink.expiresAt) {
          setExpiresAt(orderLink.expiresAt)
        }

        // 2. Get data del cliente (direccion)
        const client = await clientsService.findOne(clientId)
        setClientName(client.name)
        setClientAddress(client.address || '')

        // 3. Cargar todos los productos
        const productsData = await productsService.findAll()
        setAllProducts(productsData)

        // 4. Cargar categorías
        const categoriesData = await categoriesService.findAll()
        const activeCategories = categoriesData.filter(cat => cat.isActive)
        const categoryNames = ['Todos', ...activeCategories.map(cat => cat.name)]
        setCategories(categoryNames)

        // 5. Cargar items de la orden existentes o estado guardado
        const existingItems = await ordersItemsService.findAll({ orderId: orderId })
        const savedProducts = localStorage.getItem(`cart-${token}`)
        
        // Si ya hay items existentes en el backend, el pedido ya fue enviado
        if (existingItems.length > 0) {
          setOrderSent(true)
        }
        
        // Construir mapa de cantidades desde items existentes o estado guardado
        const initialQuantities: Record<string, number> = {}
        
        // Si ya hay items existentes en el backend, el pedido ya fue enviado
        // No cargar desde localStorage para evitar duplicación
        if (existingItems.length > 0) {
          // Pedido ya enviado - cargar solo desde items existentes
          existingItems.forEach(item => {
            if (item.quantity > 0) {
              initialQuantities[item.productId.toString()] = item.quantity
            }
          })
        }
        // Si no hay items existentes, intentar cargar desde localStorage (pedido en progreso)
        else if (savedProducts) {
          try {
            const savedProductsArray: ProductItem[] = JSON.parse(savedProducts)
            savedProductsArray.forEach(product => {
              if (product.quantity > 0) {
                initialQuantities[product.id] = product.quantity
              }
            })
          } catch (e) {
            console.error('Error parsing saved products:', e)
          }
        }

        // 6. Mapear productos a formato ProductItem con cantidades guardadas
        const mappedProducts: ProductItem[] = productsData
          .filter(product => product.isActive)
          .map(product => ({
            id: product.id.toString(),
            name: product.name,
            detail: product.description || '',
            quantity: initialQuantities[product.id.toString()] || 0,
            price: product.price
          }))
        
        setFilteredProducts(mappedProducts)
        setProductQuantities(initialQuantities)

      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message || 'Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  // Calcular y actualizar tiempo restante
  useEffect(() => {
    if (!expiresAt) return

    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const expiration = new Date(expiresAt).getTime()
      const difference = expiration - now

      if (difference <= 0) {
        setTimeRemaining('Este enlace ha caducado')
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (hours > 0) {
        setTimeRemaining(`Este enlace caduca en ${hours} hora${hours !== 1 ? 's' : ''}${minutes > 0 ? ` y ${minutes} minuto${minutes !== 1 ? 's' : ''}` : ''}`)
      } else if (minutes > 0) {
        setTimeRemaining(`Este enlace caduca en ${minutes} minuto${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` y ${seconds} segundo${seconds !== 1 ? 's' : ''}` : ''}`)
      } else {
        setTimeRemaining(`Este enlace caduca en ${seconds} segundo${seconds !== 1 ? 's' : ''}`)
      }
    }

    // Calcular inmediatamente
    calculateTimeRemaining()

    // Actualizar cada minuto
    const interval = setInterval(calculateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [expiresAt])

  // Filtrar productos por categoría
  useEffect(() => {
    let productsToShow: Product[]
    
    if (activeCategory === 'Todos') {
      productsToShow = allProducts.filter(product => product.isActive)
    } else {
      // Filtrar productos por nombre de categoría
      productsToShow = allProducts.filter(
        product => product.isActive && product.category?.name === activeCategory
      )
    }
    
    // Mapear productos a formato ProductItem, preservando cantidades
    const mappedProducts: ProductItem[] = productsToShow.map(product => ({
      id: product.id.toString(),
      name: product.name,
      detail: product.description || '',
      quantity: productQuantities[product.id.toString()] || 0,
      price: product.price
    }))
    
    setFilteredProducts(mappedProducts)
  }, [activeCategory, allProducts, productQuantities])

  const updateQuantity = (productId: string, change: number) => {
    // No permitir cambios si el pedido ya fue enviado
    if (orderSent) return

    setProductQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[productId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      const updatedQuantities = {
        ...prevQuantities,
        [productId]: newQuantity
      }
      
      // Guardar en localStorage cuando cambian las cantidades (solo si el pedido no fue enviado)
      if (token && !orderSent) {
        // Obtener todos los productos con sus cantidades actualizadas
        const productsWithQuantities = allProducts
          .filter(product => product.isActive)
          .map(product => ({
            id: product.id.toString(),
            name: product.name,
            detail: product.description || '',
            quantity: updatedQuantities[product.id.toString()] || 0,
            price: product.price
          }))
          .filter(p => p.quantity > 0)
        
        localStorage.setItem(`cart-${token}`, JSON.stringify(productsWithQuantities))
      }
      
      return updatedQuantities
    })
    
    // Actualizar filteredProducts
    setFilteredProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, (product.quantity || 0) + change) }
          : product
      )
    )
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <>
        {/* Header */}        
        <Header title={orderNumber || 'Pedido'} subtitle={orderDate || ''}>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>

          <svg width="24" height="24" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M18.25 0.75H1.75C0.921573 0.75 0.25 1.42157 0.25 2.25V15.75C0.25 16.5784 0.921573 17.25 1.75 17.25H18.25C19.0784 17.25 19.75 16.5784 19.75 15.75V2.25C19.75 1.42157 19.0784 0.75 18.25 0.75ZM18.25 15.75H1.75V2.25H18.25V15.75ZM14.5 5.25C14.5 7.73528 12.4853 9.75 10 9.75C7.51472 9.75 5.5 7.73528 5.5 5.25C5.5 4.83579 5.83579 4.5 6.25 4.5C6.66421 4.5 7 4.83579 7 5.25C7 6.90685 8.34315 8.25 10 8.25C11.6569 8.25 13 6.90685 13 5.25C13 4.83579 13.3358 4.5 13.75 4.5C14.1642 4.5 14.5 4.83579 14.5 5.25Z" fill="#0D141C"/>
          </svg>
        </Header>

        {/* Customer Name Field */}
        <FormField
          label="Nombre cliente"
          value={clientName}
          editable={false}
        />
        

        {/* Address Field */}
        <FormField 
          label="Direccion"
          value={clientAddress}
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

        {/* Order Sent Message */}
        {orderSent && (
          <div style={{ 
            background: 'rgba(60, 146, 52, 0.1)', 
            border: '1px solid rgba(60, 146, 52, 0.3)', 
            color: '#3c9234', 
            padding: '1rem', 
            borderRadius: '8px', 
            margin: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              ✓ Pedido enviado correctamente. Ya no puede ser modificado.
            </p>
          </div>
        )}

        {/* Products List */}
        <ProductList 
          products={filteredProducts}
          onQuantityChange={orderSent ? undefined : updateQuantity}
          showQuantityControls={!orderSent}
          showExpandArrow={false}
          className="products-list-full"
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
          {/* View Order Button - Solo mostrar si el pedido no fue enviado */}
          {!orderSent && (
            <Link 
              to={`/Cart${token ? `?token=${token}` : ''}`} 
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              onClick={() => {
                // Guardar productos seleccionados en localStorage para Cart
                const selectedProducts = filteredProducts.filter(p => p.quantity > 0)
                localStorage.setItem(`cart-${token}`, JSON.stringify(selectedProducts))
              }}
            >
              <BtnBlue width="100%" height="3rem">
                <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.8256 4.51906C20.6831 4.34851 20.4723 4.24996 20.25 4.25H5.12625L4.66781 1.73187C4.53823 1.01862 3.91711 0.500105 3.19219 0.5H1.5C1.08579 0.5 0.75 0.835786 0.75 1.25C0.75 1.66421 1.08579 2 1.5 2H3.1875L5.58375 15.1522C5.65434 15.5422 5.82671 15.9067 6.08344 16.2087C5.09996 17.1273 4.97046 18.6409 5.7836 19.7132C6.59675 20.7855 8.08911 21.0692 9.23899 20.37C10.3889 19.6709 10.8238 18.2154 10.2459 17H14.5041C14.3363 17.3513 14.2495 17.7357 14.25 18.125C14.25 19.5747 15.4253 20.75 16.875 20.75C18.3247 20.75 19.5 19.5747 19.5 18.125C19.5 16.6753 18.3247 15.5 16.875 15.5H7.79719C7.43472 15.4999 7.12417 15.2407 7.05937 14.8841L6.76219 13.25H17.6372C18.7246 13.2498 19.6563 12.4721 19.8506 11.4022L20.9906 5.13406C21.0297 4.91473 20.9692 4.68938 20.8256 4.51906ZM9 18.125C9 18.7463 8.49632 19.25 7.875 19.25C7.25368 19.25 6.75 18.7463 6.75 18.125C6.75 17.5037 7.25368 17 7.875 17C8.49632 17 9 17.5037 9 18.125ZM18 18.125C18 18.7463 17.4963 19.25 16.875 19.25C16.2537 19.25 15.75 18.7463 15.75 18.125C15.75 17.5037 16.2537 17 16.875 17C17.4963 17 18 17.5037 18 18.125ZM18.375 11.1341C18.31 11.4917 17.9979 11.7513 17.6344 11.75H6.48938L5.39906 5.75H19.3509L18.375 11.1341Z" fill="#F7FAFC"/>
                </svg>
                <span>Ver pedido</span>
              </BtnBlue>
            </Link>
          )}

          {/* Order History Button */}
          <div style={{ marginBottom: '2rem' }}>
            <Link 
              to={`/CustomerOrderHistory${token ? `?token=${token}` : ''}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
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
            <span>{timeRemaining || 'Este enlace caduca en 24 horas'}</span>
          </div>
        </div>
      </>
  )
}

export default NewOrder