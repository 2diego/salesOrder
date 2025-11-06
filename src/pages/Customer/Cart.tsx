import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Header from "../../components/Header/Header"
import SectionTitle from "../../components/SectionTitle/SectionTitle"
import ProductList from "../../components/ProductList/ProductList"
import BtnBlue from "../../components/BtnBlue/BtnBlue"
import { ordersLinksService } from '../../services/ordersLinksService'
import { clientsService } from '../../services/clientsService'
import { ordersService, Order } from '../../services/ordersService'
import { ordersItemsService } from '../../services/ordersItemsService'

interface ProductItem {
  id: string
  name: string
  detail?: string
  quantity: number
  price?: number
}

const Cart = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  
  // Data del cliente y la orden
  const [clientName, setClientName] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [orderId, setOrderId] = useState<number | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  // Productos
  const [products, setProducts] = useState<ProductItem[]>([])
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})

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

        // 1. Obtener datos de la orden
        const orderLink = await ordersLinksService.findByToken(token)
        
        if (!orderLink.order?.client) {
          throw new Error('No se encontró información del cliente')
        }

        const clientId = orderLink.order.clientId
        const orderIdValue = orderLink.orderId
        
        setOrderId(orderIdValue)
        setOrderNumber(`Pedido Nº ${orderIdValue.toString().padStart(8, '0')}`)
        
        if (orderLink.createdAt) {
          const date = new Date(orderLink.createdAt)
          setOrderDate(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }))
        }

        if (orderLink.expiresAt) {
          setExpiresAt(orderLink.expiresAt)
        }

        // 2. Obtener todos los datos del cliente
        const client = await clientsService.findOne(clientId)
        setClientName(client.name)

        // 3. Cargar items de la orden existentes si hay alguno
        const existingItems = await ordersItemsService.findAll({ orderId: orderIdValue })
        
        // 4. Cargar productos seleccionados - priorizar items existentes sobre localStorage
        let selectedProducts: ProductItem[] = []

        if (existingItems.length > 0) {
          // Convertir items existentes a formato ProductItem
          selectedProducts = existingItems
            .filter(item => item.quantity > 0)
            .map(item => ({
              id: item.productId.toString(),
              name: item.product?.name || 'Producto',
              detail: item.product?.sku || '',
              quantity: item.quantity,
              price: item.product?.price
            }))
        } else {
          // Si no hay items existentes, intentar cargar desde localStorage
          const savedProducts = localStorage.getItem(`cart-${token}`)
          if (savedProducts) {
            selectedProducts = JSON.parse(savedProducts)
          }
        }

        setProducts(selectedProducts)
        
        // Inicializar mapa de cantidades
        const initialQuantities: Record<string, number> = {}
        selectedProducts.forEach(product => {
          initialQuantities[product.id] = product.quantity
        })
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

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const updateQuantity = (productId: string, change: number) => {
    setProductQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[productId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      return {
        ...prevQuantities,
        [productId]: newQuantity
      }
    })
    
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, (product.quantity || 0) + change) }
          : product
      )
    )
  }

  const handleSendOrder = async () => {
    if (!orderId || !token) {
      setError('No se puede enviar el pedido: falta información de la orden')
      return
    }

    const productsToSend = products.filter(p => p.quantity > 0)
    
    if (productsToSend.length === 0) {
      setError('Debe seleccionar al menos un producto para enviar el pedido')
      return
    }

    try {
      setSending(true)
      setError(null)

      // Crear items de la orden para cada producto con cantidad > 0
      for (const product of productsToSend) {
        await ordersItemsService.create({
          orderId: orderId,
          productId: parseInt(product.id),
          quantity: product.quantity
        })
      }

      // Limpiar localStorage
      localStorage.removeItem(`cart-${token}`)

      // Navegar a CustomerOrderHistory para mostrar el pedido enviado
      navigate(`/CustomerOrderHistory?token=${token}`)
      
    } catch (err: any) {
      console.error('Error sending order:', err)
      setError(err.message || 'Error al enviar el pedido')
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error && !sending) {
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
        <Link 
          to={`/NewOrder${token ? `?token=${token}` : ''}`} 
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
        >
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 3.5L5 8L9.5 12.5" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 8H14" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </Link>

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
        <h2>{clientName}</h2>
      </SectionTitle>
      
      {/* Products List */}
      {products.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No hay productos seleccionados</p>
        </div>
      ) : (
        <ProductList 
          products={products}
          onQuantityChange={updateQuantity}
          showQuantityControls={true}
          showExpandArrow={false}
          className="products-list-full"
        />
      )}

      {/* Bottom Actions */}
      <div className="bottom-actions">
        {/* Send Order Button */}
        <BtnBlue 
          width="100%" 
          height="3rem"
          onClick={handleSendOrder}
          disabled={sending || products.filter(p => p.quantity > 0).length === 0}
        >
          <span>{sending ? 'Enviando...' : 'Enviar pedido'}</span>
        </BtnBlue>

        {/* Back Button */}
        <div style={{ marginBottom: '2rem', width: '100%' }}>
          <Link 
            to={`/NewOrder${token ? `?token=${token}` : ''}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <BtnBlue width="100%" height="3rem">
              <span>Volver</span>
            </BtnBlue>
          </Link>
        </div>

        {/* Footer Text */}
        <div className="expiration-text">
          <span>{timeRemaining || 'Este enlace caduca en 24 horas'}</span>
        </div>
      </div>
    </>
  );
};

export default Cart;
