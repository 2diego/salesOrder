import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import Header from "../../../components/Header/Header"
import { LuClipboardList } from "react-icons/lu";
import ProductList from "../../../components/ProductList/ProductList";
import BtnBlue from "../../../components/BtnBlue/BtnBlue";
import { ordersService, Order, OrderStatus } from "../../../services/ordersService";
import { ordersItemsService, OrderItem } from "../../../services/ordersItemsService";
import { ordersValidationsService } from "../../../services/ordersValidationsService";
import { productsService, Product } from "../../../services/productsService";

interface ProductItem {
  id: string;
  name: string;
  detail?: string;
  quantity: number;
  price?: number;
}

const ValidateOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  
  // Order data
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  
  // Form states
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showValidateConfirmModal, setShowValidateConfirmModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);

  // Load order data
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

        // 1. Load order
        const orderData = await ordersService.findOne(parseInt(id));
        setOrder(orderData);
        setNotes(orderData.notes || '');

        // 2. Load order items
        const items = await ordersItemsService.findAll({ orderId: orderData.id });
        console.log('Loaded order items:', items.map(i => ({ id: i.id, productId: i.productId, quantity: i.quantity })));
        setOrderItems(items);

        // 3. Map order items to ProductItem format
        const mappedProducts: ProductItem[] = items.map(item => ({
          id: item.productId.toString(),
          name: item.product?.name || 'Producto',
          detail: item.product?.description || item.product?.sku || '',
          quantity: item.quantity,
          price: item.product?.price
        }));
        setProducts(mappedProducts);

        // 4. Load available products for adding
        const allProducts = await productsService.findAll();
        const activeProducts = allProducts.filter(p => p.isActive);
        console.log('Available products loaded:', activeProducts.length);
        setAvailableProducts(activeProducts);

      } catch (err: any) {
        console.error('Error loading order data:', err);
        setError(err.message || 'Error al cargar los datos del pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [id]);

  // Reload products when modal opens to ensure fresh data
  useEffect(() => {
    const reloadProducts = async () => {
      if (showAddProductModal) {
        try {
          const allProducts = await productsService.findAll();
          const activeProducts = allProducts.filter(p => p.isActive);
          console.log('Reloading products for modal:', activeProducts.length);
          setAvailableProducts(activeProducts);
        } catch (err: any) {
          console.error('Error reloading products:', err);
          setError('Error al cargar los productos disponibles');
        }
      }
    };

    reloadProducts();
  }, [showAddProductModal]);

  const updateQuantity = async (productId: string, change: number) => {
    if (!order) return;

    const item = orderItems.find(item => item.productId.toString() === productId);
    if (!item) {
      console.error('Item not found in orderItems for productId:', productId);
      setError('Item no encontrado en la orden');
      return;
    }

    if (!item.id) {
      console.error('Item has no ID:', item);
      setError('El item no tiene un ID válido');
      return;
    }

    const newQuantity = Math.max(0, item.quantity + change);

    try {
      console.log('Updating item:', { itemId: item.id, productId, currentQuantity: item.quantity, newQuantity });
      
      if (newQuantity === 0) {
        // Remove item
        await ordersItemsService.remove(item.id);
        setOrderItems(prev => prev.filter(i => i.id !== item.id));
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        // Update item quantity
        await ordersItemsService.update(item.id, { quantity: newQuantity });
        setOrderItems(prev =>
          prev.map(i =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
        setProducts(prev =>
          prev.map(p =>
            p.id === productId ? { ...p, quantity: newQuantity } : p
          )
        );
      }

      // Reload order to get updated total
      const updatedOrder = await ordersService.findOne(order.id);
      setOrder(updatedOrder);

    } catch (err: any) {
      console.error('Error updating quantity:', err);
      console.error('Item details:', { itemId: item.id, productId, orderId: order.id });
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
      
      // Check if product already exists in order
      const existingItem = orderItems.find(item => item.productId.toString() === selectedProductId);
      
      if (existingItem) {
        if (!existingItem.id) {
          console.error('Existing item has no ID:', existingItem);
          setError('El item existente no tiene un ID válido');
          return;
        }
        
        console.log('Updating existing item:', { 
          itemId: existingItem.id, 
          productId: selectedProductId, 
          currentQuantity: existingItem.quantity, 
          addingQuantity: selectedProductQuantity 
        });
        
        // Update existing item quantity (add to current quantity)
        const newQuantity = existingItem.quantity + selectedProductQuantity;
        await ordersItemsService.update(existingItem.id, { quantity: newQuantity });
      } else {
        console.log('Creating new item:', { 
          orderId: order.id, 
          productId: selectedProductId, 
          quantity: selectedProductQuantity 
        });
        
        // Create new item
        await ordersItemsService.create({
          orderId: order.id,
          productId: parseInt(selectedProductId),
          quantity: selectedProductQuantity
        });
      }

      // Reload order and items
      const updatedOrder = await ordersService.findOne(order.id);
      const items = await ordersItemsService.findAll({ orderId: order.id });
      
      console.log('Reloaded items:', items.map(i => ({ id: i.id, productId: i.productId, quantity: i.quantity })));
      
      setOrder(updatedOrder);
      setOrderItems(items);
      
      const mappedProducts: ProductItem[] = items.map(item => ({
        id: item.productId.toString(),
        name: item.product?.name || 'Producto',
        detail: item.product?.description || item.product?.sku || '',
        quantity: item.quantity,
        price: item.product?.price
      }));
      setProducts(mappedProducts);

      // Reset form
      setSelectedProductId('');
      setSelectedProductQuantity(1);
      setShowAddProductModal(false);

    } catch (err: any) {
      console.error('Error adding product:', err);
      console.error('Order details:', { orderId: order.id, selectedProductId, selectedProductQuantity });
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
      console.error('Error saving notes:', err);
      setError(err.message || 'Error al guardar las observaciones');
    }
  };

  const handleValidateOrder = () => {
    if (!order || !id) return;
    setShowValidateConfirmModal(true);
  };

  const confirmValidateOrder = async () => {
    if (!order || !id) return;

    try {
      setValidating(true);
      setError(null);
      setShowValidateConfirmModal(false);

      // Update order notes if changed
      if (notes !== order.notes) {
        await ordersService.update(order.id, { notes });
      }

      // Get current user ID (using createdById as the validator for now)
      // TODO: Get actual logged-in user ID from auth context
      const validatedById = order.createdById;

      // Validate order
      await ordersValidationsService.validateOrder(
        order.id,
        validatedById,
        OrderStatus.VALIDATED,
        notes || undefined
      );

      // Navigate back to orders list
      navigate('/Orders');

    } catch (err: any) {
      console.error('Error validating order:', err);
      setError(err.message || 'Error al validar el pedido');
      setValidating(false);
    }
  };

  const handleRejectOrder = () => {
    if (!order || !id) return;
    setShowRejectConfirmModal(true);
  };

  const confirmRejectOrder = async () => {
    if (!order || !id) return;

    try {
      setRejecting(true);
      setError(null);
      setShowRejectConfirmModal(false);

      // Update order notes if changed
      if (notes !== order.notes) {
        await ordersService.update(order.id, { notes });
      }

      // Get current user ID
      const validatedById = order.createdById;

      // Reject order (cancel it)
      await ordersValidationsService.validateOrder(
        order.id,
        validatedById,
        OrderStatus.CANCELLED,
        notes || undefined
      );

      // Navigate back to orders list
      navigate('/Orders');

    } catch (err: any) {
      console.error('Error rejecting order:', err);
      setError(err.message || 'Error al rechazar el pedido');
      setRejecting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatOrderNumber = (orderId: number): string => {
    return `Pedido Nº ${orderId.toString().padStart(8, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Pedido no encontrado</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}        
      <Header 
        title={formatOrderNumber(order.id)} 
        subtitle={formatDate(order.createdAt)}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => navigate('/Orders')}
          style={{ cursor: 'pointer' }}
        >
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuClipboardList />
      </Header>

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '8px', 
          margin: '1rem' 
        }}>
          {error}
        </div>
      )}

      {/* Section Title */}
      <SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2>{order.client?.name || 'Sin cliente'}</h2>
            <h4>{order.client?.address || 'Sin dirección'}, {order.client?.city || 'Sin ciudad'}</h4>
          </div>
          <BtnBlue width="100%" height="2.5rem">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256">
              <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="start">
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
        showExpandArrow={false}
      />

      {/* Action Buttons */}
      <div className="btn-group">
        <button 
          className="btn-gray"
          onClick={() => setShowNotesModal(true)}
        >
          <span>Observaciones</span>
        </button>
        <button 
          className="btn-gray"
          onClick={() => setShowAddProductModal(true)}
        >
          <span>Agregar productos</span>
        </button>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7FAFC',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Observaciones</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar observaciones sobre el pedido..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #E8EDF2',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <BtnBlue 
                width="100%" 
                height="3rem"
                onClick={handleSaveNotes}
              >
                <span>Guardar</span>
              </BtnBlue>
              <button
                onClick={() => {
                  setNotes(order.notes || '');
                  setShowNotesModal(false);
                }}
                style={{
                  width: '100%',
                  height: '3rem',
                  backgroundColor: '#E8EDF2',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7FAFC',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Agregar Producto</h3>
            
            {availableProducts.length === 0 && (
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffc107', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                color: '#856404'
              }}>
                No hay productos disponibles. Cargando...
              </div>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Producto
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E8EDF2',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">Seleccione un producto</option>
                {availableProducts.length === 0 ? (
                  <option disabled>No hay productos disponibles</option>
                ) : (
                  availableProducts.map(product => {
                    const existingProduct = products.find(p => p.id === product.id.toString());
                    const currentQuantity = existingProduct ? existingProduct.quantity : 0;
                    return (
                      <option key={product.id} value={product.id.toString()}>
                        {product.name} - ${product.price} {existingProduct ? `(Actual: ${currentQuantity})` : ''}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={selectedProductQuantity}
                onChange={(e) => setSelectedProductQuantity(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E8EDF2',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <BtnBlue 
                width="100%" 
                height="3rem"
                onClick={handleAddProduct}
                disabled={!selectedProductId || selectedProductQuantity <= 0}
              >
                <span>Agregar</span>
              </BtnBlue>
              <button
                onClick={() => {
                  setSelectedProductId('');
                  setSelectedProductQuantity(1);
                  setShowAddProductModal(false);
                }}
                style={{
                  width: '100%',
                  height: '3rem',
                  backgroundColor: '#E8EDF2',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Validate Confirmation Modal */}
      {showValidateConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7FAFC',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#0D141C' }}>Confirmar Validación</h3>
            <p style={{ marginBottom: '1.5rem', color: '#4D7099', fontSize: '0.875rem' }}>
              ¿Está seguro que desea validar este pedido? Esta acción confirmará el pedido y no se podrá modificar posteriormente.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <BtnBlue 
                width="100%" 
                height="3rem"
                onClick={confirmValidateOrder}
                disabled={validating}
              >
                <span>{validating ? 'Validando...' : 'Confirmar Validación'}</span>
              </BtnBlue>
              <button
                onClick={() => setShowValidateConfirmModal(false)}
                disabled={validating}
                style={{
                  width: '100%',
                  height: '3rem',
                  backgroundColor: '#E8EDF2',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: validating ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: validating ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validate Button */}
      <BtnBlue 
        width="100%" 
        height="3rem"
        onClick={handleValidateOrder}
        disabled={validating || rejecting}
      >
        <span>{validating ? 'Validando...' : 'Validar pedido'}</span>
      </BtnBlue>

      {/* Reject Confirmation Modal */}
      {showRejectConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7FAFC',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#0D141C' }}>Confirmar Rechazo</h3>
            <p style={{ marginBottom: '1.5rem', color: '#4D7099', fontSize: '0.875rem' }}>
              ¿Está seguro que desea rechazar este pedido? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={confirmRejectOrder}
                disabled={rejecting}
                style={{
                  width: '100%',
                  height: '3rem',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: rejecting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: rejecting ? 0.6 : 1
                }}
              >
                {rejecting ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
              <button
                onClick={() => setShowRejectConfirmModal(false)}
                disabled={rejecting}
                style={{
                  width: '100%',
                  height: '3rem',
                  backgroundColor: '#E8EDF2',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: rejecting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: rejecting ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Button */}
      <div className="btn-container">
        <button 
          className="btn-red"
          onClick={handleRejectOrder}
          disabled={validating || rejecting}
        >
          <span>{rejecting ? 'Rechazando...' : 'Rechazar pedido'}</span>
        </button>
      </div>     

    </>
  )
}

export default ValidateOrder
