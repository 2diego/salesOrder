import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";
import { ordersItemsService, OrderItem } from "../../../../services/ordersItemsService";
import { ordersValidationsService } from "../../../../services/ordersValidationsService";
import { productsService, Product } from "../../../../services/productsService";
import { clientsService } from "../../../../services/clientsService";
import './ValidateOrderDesktop.css';

interface ProductItem {
  id: string;
  name: string;
  detail?: string;
  quantity: number;
  price?: number;
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '1rem'
};
const modalContentStyle: React.CSSProperties = {
  borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflow: 'auto'
};
const desktopTextareaStyle: React.CSSProperties = {
  width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(100,100,100,0.3)',
  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', resize: 'vertical', backgroundColor: 'rgb(31,41,55)', color: 'rgb(233,232,232)'
};
const desktopInputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(100,100,100,0.3)',
  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', backgroundColor: 'rgb(31,41,55)', color: 'rgb(233,232,232)'
};
const desktopLabelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'rgb(233,232,232)' };
const desktopBtnPrimaryStyle: React.CSSProperties = {
  flex: 1, height: '3rem', background: 'linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))',
  border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: 600
};
const desktopBtnSecondaryStyle: React.CSSProperties = {
  flex: 1, height: '3rem', backgroundColor: 'rgba(55,65,81,0.8)', border: '1px solid rgba(100,100,100,0.3)',
  borderRadius: '12px', color: 'rgb(233,232,232)', cursor: 'pointer', fontWeight: 500
};
const desktopBtnRejectStyle: React.CSSProperties = {
  flex: 1, height: '3rem', backgroundColor: '#a11a1a', border: 'none', borderRadius: '12px',
  color: 'white', cursor: 'pointer', fontWeight: 600
};
const desktopWarningStyle: React.CSSProperties = {
  padding: '0.75rem', backgroundColor: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)',
  borderRadius: '8px', marginBottom: '1rem', color: '#fcd34d'
};

const ValidateOrderDesktop = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);

  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showValidateConfirmModal, setShowValidateConfirmModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);

  useEffect(() => {
    const loadOrderData = async () => {
      if (!id) {
        setError('ID de pedido no encontrado');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const orderData = await ordersService.findOne(parseInt(id));

        const addressMissing = !orderData.client?.address || (typeof orderData.client.address === 'string' && orderData.client.address.trim() === '');
        const cityMissing = !orderData.client?.city || (typeof orderData.client.city === 'string' && orderData.client.city.trim() === '');
        const needsFullClient = orderData.client && (addressMissing || cityMissing);

        if (needsFullClient && orderData.client) {
          try {
            const fullClient = await clientsService.findOne(orderData.clientId);
            orderData.client = {
              ...orderData.client,
              address: (fullClient.address && fullClient.address.trim()) || orderData.client.address || '',
              city: (fullClient.city && fullClient.city.trim()) || orderData.client.city || '',
            };
          } catch (err: any) {
            console.warn('Error loading full client data:', err);
          }
        } else if (!orderData.client && orderData.clientId) {
          try {
            const fullClient = await clientsService.findOne(orderData.clientId);
            orderData.client = {
              id: fullClient.id,
              name: fullClient.name,
              email: fullClient.email,
              phone: fullClient.phone,
              address: fullClient.address || '',
              city: fullClient.city || '',
            };
          } catch (err: any) {
            console.warn('Error loading client data:', err);
          }
        }

        setOrder(orderData);
        setNotes(orderData.notes || '');

        const items = await ordersItemsService.findAll({ orderId: orderData.id });
        setOrderItems(items);

        const mappedProducts: ProductItem[] = items.map(item => ({
          id: item.productId.toString(),
          name: item.product?.name || 'Producto',
          detail: item.product?.description || item.product?.sku || '',
          quantity: item.quantity,
          price: item.product?.price
        }));
        setProducts(mappedProducts);

        const allProducts = await productsService.findAll();
        setAvailableProducts(allProducts.filter(p => p.isActive));
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos del pedido');
      } finally {
        setLoading(false);
      }
    };
    loadOrderData();
  }, [id]);

  useEffect(() => {
    if (!showAddProductModal) return;
    productsService.findAll().then(all => setAvailableProducts(all.filter(p => p.isActive))).catch(() => {});
  }, [showAddProductModal]);

  const updateQuantity = async (productId: string, change: number) => {
    if (!order) return;
    const item = orderItems.find(i => i.productId.toString() === productId);
    if (!item?.id) {
      setError(item ? 'El item no tiene un ID válido' : 'Item no encontrado en la orden');
      return;
    }
    const newQuantity = Math.max(0, item.quantity + change);
    try {
      if (newQuantity === 0) {
        await ordersItemsService.remove(item.id);
        setOrderItems(prev => prev.filter(i => i.id !== item.id));
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        await ordersItemsService.update(item.id, { quantity: newQuantity });
        setOrderItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i));
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: newQuantity } : p));
      }
      const updatedOrder = await ordersService.findOne(order.id);
      setOrder(updatedOrder);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la cantidad');
    }
  };

  const handleAddProduct = async () => {
    if (!order || !selectedProductId || selectedProductQuantity <= 0) {
      setError('Seleccione un producto y una cantidad válida');
      return;
    }
    try {
      setError(null);
      const existingItem = orderItems.find(i => i.productId.toString() === selectedProductId);
      if (existingItem?.id) {
        const newQuantity = existingItem.quantity + selectedProductQuantity;
        await ordersItemsService.update(existingItem.id, { quantity: newQuantity });
      } else {
        await ordersItemsService.create({
          orderId: order.id,
          productId: parseInt(selectedProductId),
          quantity: selectedProductQuantity
        });
      }
      const updatedOrder = await ordersService.findOne(order.id);
      const items = await ordersItemsService.findAll({ orderId: order.id });
      setOrder(updatedOrder);
      setOrderItems(items);
      setProducts(items.map(item => ({
        id: item.productId.toString(),
        name: item.product?.name || 'Producto',
        detail: item.product?.description || item.product?.sku || '',
        quantity: item.quantity,
        price: item.product?.price
      })));
      setSelectedProductId('');
      setSelectedProductQuantity(1);
      setShowAddProductModal(false);
    } catch (err: any) {
      setError(err.message || 'Error al agregar el producto');
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;
    try {
      setError(null);
      await ordersService.update(order.id, { notes });
      setShowNotesModal(false);
    } catch (err: any) {
      setError(err.message || 'Error al guardar las observaciones');
    }
  };

  const handleValidateOrder = () => {
    if (order && id) setShowValidateConfirmModal(true);
  };

  const confirmValidateOrder = async () => {
    if (!order || !id) return;
    try {
      setValidating(true);
      setError(null);
      setShowValidateConfirmModal(false);
      if (notes !== order.notes) await ordersService.update(order.id, { notes });
      await ordersValidationsService.validateOrder(order.id, order.createdById, OrderStatus.VALIDATED, notes || undefined);
      navigate('/Orders');
    } catch (err: any) {
      setError(err.message || 'Error al validar el pedido');
      setValidating(false);
    }
  };

  const handleRejectOrder = () => {
    if (order && id) setShowRejectConfirmModal(true);
  };

  const confirmRejectOrder = async () => {
    if (!order || !id) return;
    try {
      setRejecting(true);
      setError(null);
      setShowRejectConfirmModal(false);
      if (notes !== order.notes) await ordersService.update(order.id, { notes });
      await ordersValidationsService.validateOrder(order.id, order.createdById, OrderStatus.CANCELLED, notes || undefined);
      navigate('/Orders');
    } catch (err: any) {
      setError(err.message || 'Error al rechazar el pedido');
      setRejecting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatOrderNumber = (orderId: number): string => {
    return `Pedido Nº ${orderId.toString().padStart(8, '0')}`;
  };

  if (loading) {
    return (
      <div className="validate-order-desktop">
        <div className="desktop-loading"><p>Cargando...</p></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="validate-order-desktop">
        <div className="desktop-error">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="validate-order-desktop">
        <div className="desktop-not-found"><p>Pedido no encontrado</p></div>
      </div>
    );
  }

  return (
    <div className="validate-order-desktop">
      {error && <div className="desktop-error">{error}</div>}

      <div className="desktop-header">
        <button className="desktop-back-btn" onClick={() => navigate('/Orders?status=pending')} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="desktop-order-info">
          <h1 className="desktop-order-title">{formatOrderNumber(order.id)}</h1>
          <p className="desktop-order-date">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="desktop-card">
        <div className="desktop-client-section">
          <h2 className="desktop-client-name">{order.client?.name || 'Sin cliente'}</h2>
          <p className="desktop-client-address">
            {order.client?.address || 'Sin dirección'}, {order.client?.city || 'Sin ciudad'}
          </p>
        </div>

        <div className="desktop-products-section">
          <h3 className="desktop-products-title">Productos</h3>
          <table className="desktop-products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{ width: '100px' }}>Cantidad</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div>{product.name}</div>
                    {product.detail && <div style={{ fontSize: '0.75rem', color: 'rgba(233,232,232,0.6)' }}>{product.detail}</div>}
                  </td>
                  <td>
                    <div className="desktop-qty-controls">
                      <button className="desktop-qty-btn" onClick={() => updateQuantity(product.id, -1)}>-</button>
                      <span className="desktop-qty-value">{product.quantity}</span>
                      <button className="desktop-qty-btn" onClick={() => updateQuantity(product.id, 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>{product.price != null ? `$${product.price}` : '-'}</td>
                </tr>
              ))}
              <tr className="desktop-total-row">
                <td colSpan={2}>Total</td>
                <td style={{ textAlign: 'right' }}>${(Number(order?.totalAmount) || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="desktop-actions-row">
          <button className="desktop-btn-secondary" onClick={() => setShowNotesModal(true)}>Observaciones</button>
          <button className="desktop-btn-secondary" onClick={() => setShowAddProductModal(true)}>Agregar productos</button>
          <button className="desktop-btn-validate" onClick={handleValidateOrder} disabled={validating || rejecting}>
            {validating ? 'Validando...' : 'Validar pedido'}
          </button>
          <button className="desktop-btn-reject" onClick={handleRejectOrder} disabled={validating || rejecting}>
            {rejecting ? 'Rechazando...' : 'Rechazar pedido'}
          </button>
        </div>
      </div>

      {showNotesModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, backgroundColor: '#1f2937' }}>
            <h3 style={{ marginBottom: '1rem', color: 'rgb(233,232,232)' }}>Observaciones</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agregar observaciones..." style={desktopTextareaStyle} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={desktopBtnPrimaryStyle} onClick={handleSaveNotes}>Guardar</button>
              <button style={desktopBtnSecondaryStyle} onClick={() => { setNotes(order.notes || ''); setShowNotesModal(false); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showAddProductModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, backgroundColor: '#1f2937' }}>
            <h3 style={{ marginBottom: '1rem', color: 'rgb(233,232,232)' }}>Agregar Producto</h3>
            {availableProducts.length === 0 && <div style={desktopWarningStyle}>No hay productos disponibles.</div>}
            <div style={{ marginBottom: '1rem' }}>
              <label style={desktopLabelStyle}>Producto</label>
              <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={desktopInputStyle}>
                <option value="">Seleccione un producto</option>
                {availableProducts.map(product => {
                  const existingProduct = products.find(p => p.id === product.id.toString());
                  const currentQuantity = existingProduct ? existingProduct.quantity : 0;
                  return (
                    <option key={product.id} value={product.id.toString()}>
                      {product.name} - ${product.price} {existingProduct ? `(Actual: ${currentQuantity})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={desktopLabelStyle}>Cantidad</label>
              <input type="number" min={1} value={selectedProductQuantity} onChange={(e) => setSelectedProductQuantity(parseInt(e.target.value) || 1)} style={desktopInputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={desktopBtnPrimaryStyle} onClick={handleAddProduct} disabled={!selectedProductId || selectedProductQuantity <= 0}>Agregar</button>
              <button style={desktopBtnSecondaryStyle} onClick={() => { setSelectedProductId(''); setSelectedProductQuantity(1); setShowAddProductModal(false); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showValidateConfirmModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, backgroundColor: '#1f2937' }}>
            <h3 style={{ marginBottom: '1rem', color: 'rgb(233,232,232)' }}>Confirmar Validación</h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(233,232,232,0.8)', fontSize: '0.875rem' }}>
              ¿Está seguro que desea validar este pedido? Esta acción confirmará el pedido y no se podrá modificar posteriormente.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={desktopBtnPrimaryStyle} onClick={confirmValidateOrder} disabled={validating}>Confirmar Validación</button>
              <button style={desktopBtnSecondaryStyle} onClick={() => setShowValidateConfirmModal(false)} disabled={validating}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showRejectConfirmModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, backgroundColor: '#1f2937' }}>
            <h3 style={{ marginBottom: '1rem', color: 'rgb(233,232,232)' }}>Confirmar Rechazo</h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(233,232,232,0.8)', fontSize: '0.875rem' }}>
              ¿Está seguro que desea rechazar este pedido? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={desktopBtnRejectStyle} onClick={confirmRejectOrder} disabled={rejecting}>Confirmar Rechazo</button>
              <button style={desktopBtnSecondaryStyle} onClick={() => setShowRejectConfirmModal(false)} disabled={rejecting}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidateOrderDesktop;
