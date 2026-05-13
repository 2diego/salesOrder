import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from "../../../components/common/Header/Header";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../components/common/BtnBlue/BtnBlue";
import InfoRow from '../../../components/common/InfoRow/InfoRow'
import { LuClipboardList } from 'react-icons/lu'
import { ordersLinksService } from '../../../services/ordersLinksService'
import { customerPortalService } from '../../../services/customerPortalService'
import type { Order } from '../../../services/ordersService'
import { useNavigate } from 'react-router-dom'

const CustomerOrderHistory = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

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

        // 1. Obtener datos de la orden para obtener ID del cliente
        const orderLink = await ordersLinksService.findByToken(token)
        
        if (!orderLink.order?.client) {
          throw new Error('No se encontró información del cliente')
        }

        const clientId = orderLink.order.clientId

        // Set fecha de expiracion
        if (orderLink.expiresAt) {
          setExpiresAt(orderLink.expiresAt)
        }

        // 2. Get datos del cliente (nombre)
        const client = await customerPortalService.findClient(clientId, token)
        setClientName(client.name)

        // 3. Cargar todas las ordenes del cliente
        const clientOrders = await customerPortalService.findOrdersByClient(clientId, token)
        // Ordenar por fecha de creación (más reciente primero)
        const sortedOrders = clientOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        setOrders(sortedOrders)

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

    // Calcular inmediatamente
    calculateTimeRemaining()

    // Actualizar cada minuto
    const interval = setInterval(calculateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
  }

  const formatOrderNumber = (orderId: number) => {
    return `Pedido Nº ${orderId.toString().padStart(8, '0')}`
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
            <Header title="Historial de pedidos" subtitle="Cliente">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
    
              <svg width="24" height="24" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.25 0.75H1.75C0.921573 0.75 0.25 1.42157 0.25 2.25V15.75C0.25 16.5784 0.921573 17.25 1.75 17.25H18.25C19.0784 17.25 19.75 16.5784 19.75 15.75V2.25C19.75 1.42157 19.0784 0.75 18.25 0.75ZM18.25 15.75H1.75V2.25H18.25V15.75ZM14.5 5.25C14.5 7.73528 12.4853 9.75 10 9.75C7.51472 9.75 5.5 7.73528 5.5 5.25C5.5 4.83579 5.83579 4.5 6.25 4.5C6.66421 4.5 7 4.83579 7 5.25C7 6.90685 8.34315 8.25 10 8.25C11.6569 8.25 13 6.90685 13 5.25C13 4.83579 13.3358 4.5 13.75 4.5C14.1642 4.5 14.5 4.83579 14.5 5.25Z" fill="#0D141C"/>
              </svg>
            </Header>
    
            {/* Section Title */}
            <SectionTitle>
              <h2>{clientName}</h2>
            </SectionTitle>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No hay pedidos registrados</p>
              </div>
            ) : (
              orders.map((order) => (
                <InfoRow
                  key={order.id}
                  columns={[
                    <span key={"date"}>{formatDate(order.createdAt)}</span>,
                    <span key={"orderId"}>{formatOrderNumber(order.id)}</span>,
                  ]}
                  actionLabel="Ver detalle"
                  actionIcon={<LuClipboardList />}
                  onActionClick={() => {
                    navigate(`/HistoryOrderDetails/${order.id}${token ? `?token=${token}` : ''}`)
                  }}
                  onRowClick={() => {
                    navigate(`/HistoryOrderDetails/${order.id}${token ? `?token=${token}` : ''}`)
                  }}
                />
              ))
            )}
            
            {/* Bottom Actions */}
            <div className="bottom-actions">

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

export default CustomerOrderHistory;


/* Para OrderHistory (read only):
        <ProductList 
          products={cartProducts}
          showQuantityControls={false}
          showExpandArrow={false}
        />

        */