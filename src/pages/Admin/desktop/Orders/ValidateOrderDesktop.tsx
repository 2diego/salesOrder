import { useState, useEffect, type SyntheticEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";
import { ordersItemsService, OrderItem } from "../../../../services/ordersItemsService";
import { ordersValidationsService } from "../../../../services/ordersValidationsService";
import { productsService, Product } from "../../../../services/productsService";
import { clientsService } from "../../../../services/clientsService";
import './ValidateOrderDesktop.css';
import type { ProductItem } from "../../../../components/desktop/CustomerPanels/types";
import { mapOrderItemToProductItem } from "../../../../utils/mapProductItem";
import { getDefaultProductImageUrl, resolveProductListImageSrc } from "../../../../config/productImages";
import { ProductImagePreview } from "../../../../components/common/ProductImagePreview/ProductImagePreview";

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 2001, padding: '1rem'
};
const modalContentStyle: React.CSSProperties = {
  borderRadius: '12px', padding: '2rem', maxWidth: '560px', width: '100%', maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box'
};
const desktopTextareaStyle: React.CSSProperties = {
  width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(100,100,100,0.3)',
  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', resize: 'vertical', backgroundColor: 'rgb(31,41,55)', color: 'rgb(233,232,232)',
  boxSizing: 'border-box', overflowX: 'hidden', whiteSpace: 'pre-wrap'
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
const desktopInfoCardStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(59, 130, 246, 0.12)',
  border: '1px solid rgba(96, 165, 250, 0.35)',
  borderRadius: '8px',
  marginBottom: '1rem',
  color: 'rgb(233,232,232)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
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

  // Permite editar cantidad usando teclado numérico.
  // Guardamos el "draft" como string para soportar estados intermedios (ej. borrar todo).
  const [quantityDraftByProductId, setQuantityDraftByProductId] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<{ src: string; alt: string } | null>(null);

  const handleProductThumbError = (e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.dataset.fallback === '1') return;
    el.dataset.fallback = '1';
    el.src = getDefaultProductImageUrl();
  };

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

        const mappedProducts: ProductItem[] = items.map((item) => mapOrderItemToProductItem(item));
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

  const setQuantityForProduct = async (productId: string, newQuantity: number) => {
    if (!order) return;
    const item = orderItems.find(i => i.productId.toString() === productId);
    if (!item?.id) {
      setError(item ? 'El item no tiene un ID válido' : 'Item no encontrado en la orden');
      return;
    }

    const target = Math.max(0, Math.floor(newQuantity));
    if (target === item.quantity) return;

    try {
      if (target === 0) {
        await ordersItemsService.remove(item.id);
      } else {
        await ordersItemsService.update(item.id, { quantity: target });
      }

      // Refrescar UI con el estado real del backend
      const updatedOrder = await ordersService.findOne(order.id);
      setOrder(updatedOrder);
      const items = await ordersItemsService.findAll({ orderId: order.id });
      setOrderItems(items);
      setProducts(items.map((i) => mapOrderItemToProductItem(i)));
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la cantidad');
    }
  };

  const applyQuantityDraft = (productId: string) => {
    const raw = quantityDraftByProductId[productId];
    const item = orderItems.find(i => i.productId.toString() === productId);

    // Si no tenemos draft o está vacío/invalidamos, volvemos al valor real.
    if (!item || raw === undefined || raw === '') {
      setQuantityDraftByProductId(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      return;
    }

    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setQuantityDraftByProductId(prev => {
        const copy = { ...prev };
        copy[productId] = String(item.quantity);
        return copy;
      });
      return;
    }

    setQuantityForProduct(productId, parsed).finally(() => {
      setQuantityDraftByProductId(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    });
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
      setProducts(items.map((item) => mapOrderItemToProductItem(item)));
      setSelectedProductId('');
      setSelectedProductQuantity(1);
      setShowAddProductModal(false);
    } catch (err: any) {
      setError(err.message || 'Error al agregar el producto');
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;
    const previousNotes = order.notes || '';
    const cleanedNotes = notes.trim();
    // UX: cerrar inmediatamente al guardar
    setShowNotesModal(false);
    // Reflejar de inmediato en la pantalla de validación
    setOrder(prev => (prev ? { ...prev, notes: cleanedNotes } : prev));

    try {
      setError(null);
      const updatedOrder = await ordersService.update(order.id, { notes: cleanedNotes || undefined });
      setOrder(updatedOrder);
      setNotes(updatedOrder.notes || '');
    } catch (err: any) {
      // Si falla, restaurar estado previo para no desincronizar UI
      setOrder(prev => (prev ? { ...prev, notes: previousNotes } : prev));
      setNotes(previousNotes);
      setError(err.message || 'Error al guardar las observaciones');
    }
  };

  const openNotesModal = () => {
    if (!order) return;
    setError(null);
    setNotes(order.notes || '');
    setShowNotesModal(true);
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

  if (error && error.trim() && !order) {
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
      {error && error.trim() && <div className="desktop-error">{error}</div>}

      <div className="desktop-header">
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

        {order.notes && order.notes.trim() && (
          <div className="desktop-notes-section">
            <h3 className="desktop-notes-title">Observaciones</h3>
            <p className="desktop-notes-text">{order.notes}</p>
          </div>
        )}

        <div className="desktop-products-section">
          <table className="desktop-products-table">
            <thead>
              <tr>
                <th className="desktop-products-table__th-thumb" aria-label="Imagen" />
                <th>Producto</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const thumbSrc = resolveProductListImageSrc(product.imageUrl);
                return (
                <tr key={product.id}>
                  <td className="desktop-product-thumb-cell">
                    <button
                      type="button"
                      className="desktop-product-thumb-btn"
                      aria-label={`Ver imagen ampliada: ${product.name}`}
                      onClick={(e) => {
                        const img = e.currentTarget.querySelector('img');
                        const src =
                          img instanceof HTMLImageElement
                            ? img.currentSrc || img.src || thumbSrc
                            : thumbSrc;
                        setImagePreview({ src, alt: `Producto ${product.name}` });
                      }}
                    >
                      <img
                        src={thumbSrc}
                        alt=""
                        className="desktop-product-thumb__img"
                        loading="lazy"
                        decoding="async"
                        onError={handleProductThumbError}
                      />
                    </button>
                  </td>
                  <td>
                    <div>{product.name}</div>
                    {product.detail && <div style={{ fontSize: '0.75rem', color: 'rgba(233,232,232,0.6)' }}>{product.detail}</div>}
                  </td>
                  <td>
                    <div className="desktop-qty-controls">
                      <button
                        className="desktop-qty-btn"
                        onClick={() => {
                          setQuantityDraftByProductId(prev => {
                            const copy = { ...prev };
                            delete copy[product.id];
                            return copy;
                          });
                          updateQuantity(product.id, -1);
                        }}
                      >
                        -
                      </button>

                      <input
                        className="desktop-qty-input"
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        value={quantityDraftByProductId[product.id] ?? String(product.quantity)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setQuantityDraftByProductId(prev => ({ ...prev, [product.id]: value }));
                        }}
                        onBlur={() => applyQuantityDraft(product.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.currentTarget as HTMLInputElement).blur();
                          }
                        }}
                      />

                      <button
                        className="desktop-qty-btn"
                        onClick={() => {
                          setQuantityDraftByProductId(prev => {
                            const copy = { ...prev };
                            delete copy[product.id];
                            return copy;
                          });
                          updateQuantity(product.id, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="desktop-actions-row">
          <button className="desktop-btn-secondary" onClick={openNotesModal}>Observaciones</button>
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
            <div style={desktopInfoCardStyle}>
              <div><strong>Vendedor que generó:</strong> {order.createdBy?.name || order.createdBy?.username || `ID ${order.createdById}`}</div>
              <div><strong>Cliente:</strong> {order.client?.name || 'Sin cliente'}</div>
              <div><strong>Fecha del pedido:</strong> {formatDate(order.createdAt)}</div>
            </div>
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
                      {product.name} {existingProduct ? `(Actual: ${currentQuantity})` : ''}
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

      {imagePreview && (
        <ProductImagePreview
          isOpen
          imageSrc={imagePreview.src}
          alt={imagePreview.alt}
          onClose={() => setImagePreview(null)}
        />
      )}
    </div>
  );
};

export default ValidateOrderDesktop;
