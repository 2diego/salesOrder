import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Header from "../../../components/common/Header/Header"
import { HeaderBackNavLink } from "../../../components/mobile/header/HeaderBackNavLink";
import { CartHeaderIcon } from '../../../components/mobile/header/CartHeaderIcon';
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle"
import ProductList from "../../../components/common/ProductList/ProductList"
import BtnBlue from "../../../components/common/BtnBlue/BtnBlue"
import { ordersLinksService } from '../../../services/ordersLinksService'
import { customerPortalService } from '../../../services/customerPortalService'
import { productsService } from '../../../services/productsService'
import type { ProductItem } from '../../../components/desktop/CustomerPanels/types'
import { mapOrderItemToProductItem, mergeProductItemsWithCatalog } from '../../../utils/mapProductItem'
import { getDefaultProductImageUrl, resolveProductListImageSrc } from '../../../config/productImages'

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
  const [showSendConfirm, setShowSendConfirm] = useState(false)

  const productsToSend = useMemo(
    () => products.filter((p) => p.quantity > 0),
    [products],
  )

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
        const client = await customerPortalService.findClient(clientId, token)
        setClientName(client.name)

        // 3. Cargar items de la orden existentes si hay alguno
        const existingItems = await customerPortalService.findOrderItems(orderIdValue, token)

        // Catálogo para completar imageUrl (localStorage suele no traerla)
        const catalog = await productsService.findAll()
        
        // 4. Cargar productos seleccionados - priorizar items existentes sobre localStorage
        let selectedProducts: ProductItem[] = []

        if (existingItems.length > 0) {
          // Convertir items existentes a formato ProductItem
          selectedProducts = existingItems
            .filter(item => item.quantity > 0)
            .map(item => mapOrderItemToProductItem(item))
        } else {
          // Si no hay items existentes, intentar cargar desde localStorage
          const savedProducts = localStorage.getItem(`cart-${token}`)
          if (savedProducts) {
            selectedProducts = JSON.parse(savedProducts)
          }
        }

        selectedProducts = mergeProductItemsWithCatalog(selectedProducts, catalog)

        setProducts(selectedProducts)
        
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos')
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

    if (productsToSend.length === 0) {
      setError('Debe seleccionar al menos un producto para enviar el pedido')
      return
    }

    try {
      setSending(true)
      setError(null)

      // Crear items de la orden para cada producto con cantidad > 0
      for (const product of productsToSend) {
        await customerPortalService.createOrderItem(
          {
            orderId,
            productId: parseInt(product.id, 10),
            quantity: product.quantity,
          },
          token,
        )
      }

      // Limpiar localStorage
      localStorage.removeItem(`cart-${token}`)

      // Navegar a CustomerOrderHistory para mostrar el pedido enviado
      navigate(`/CustomerOrderHistory?token=${token}`)
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar el pedido')
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
      <Header
        title={orderNumber || 'Pedido'}
        subtitle={orderDate || ''}
        leftSlot={
          <HeaderBackNavLink
            to={`/NewOrder${token ? `?token=${token}` : ''}`}
            ariaLabel="Volver al pedido"
          />
        }
        rightSlot={<CartHeaderIcon />}
      />
      
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
          onClick={() => setShowSendConfirm(true)}
          disabled={sending || productsToSend.length === 0}
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

      {showSendConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowSendConfirm(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#F7FAFC',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              maxHeight: '80vh',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1rem 0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0D141C' }}>Confirmar envío de pedido</h3>
              <p style={{ margin: '0.5rem 0 0', color: '#4D7099', fontSize: '0.9rem' }}>
                Mi pedido:
              </p>
            </div>

            <div style={{ padding: '0.25rem 1rem 1rem', maxHeight: '45vh', overflowY: 'auto' }}>
              {productsToSend.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.55rem', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', minWidth: 0 }}>
                    <img
                      src={resolveProductListImageSrc(p.imageUrl)}
                      alt=""
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, background: '#e8edf2' }}
                      onError={(e) => {
                        const el = e.currentTarget
                        if (el.dataset.fallback === '1') return
                        el.dataset.fallback = '1'
                        el.src = getDefaultProductImageUrl()
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      {p.detail && (
                        <div style={{ fontSize: '0.8rem', color: '#4D7099', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.detail}
                        </div>
                      )}
                    </div>
                  </div>
                  <strong>x{p.quantity}</strong>
                </div>
              ))}
            </div>

            <div style={{ padding: '0 1rem 1rem' }}>
              <BtnBlue
                width="100%"
                height="2.75rem"
                onClick={() => {
                  setShowSendConfirm(false)
                  handleSendOrder()
                }}
                disabled={sending || productsToSend.length === 0}
              >
                <span>{sending ? 'Enviando...' : 'Confirmar envío'}</span>
              </BtnBlue>
              <BtnBlue
                width="100%"
                height="2.75rem"
                onClick={() => setShowSendConfirm(false)}
                background="rgba(107, 114, 128, 0.9)"
              >
                <span>Cancelar</span>
              </BtnBlue>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
