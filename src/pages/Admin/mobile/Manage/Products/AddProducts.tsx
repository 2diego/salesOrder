import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useState, useEffect } from "react";
import './AddProducts.css';
import { CreateProductDTO } from "../../../../../services/productsService";
import { productsService } from "../../../../../services/productsService";
import { categoriesService, Category } from "../../../../../services/categoriesService";

interface AddProductsProps {
  desktop?: boolean;
  onClose?: () => void;
  onProductAdded?: () => void; // Callback para refrescar la lista de productos
}

const AddProducts: React.FC<AddProductsProps> = ({ desktop = false, onClose, onProductAdded }) => {
  const [productData, setProductData] = useState<CreateProductDTO>({
    name: '',
    categoryId: 0,
    description: '',
    price: 0,
    stock: 0
  });

  const [priceString, setPriceString] = useState('');
  const [stockString, setStockString] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categorias al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoriesService.findAll();
        setCategories(fetchedCategories);
      } catch (err: any) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir vacío y números
    if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
      setPriceString(value);
      setProductData(prev => ({
        ...prev,
        price: value === '' ? 0 : parseFloat(value) || 0
      }));
    }
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir vacío y números enteros
    if (value === '' || /^\d+$/.test(value)) {
      setStockString(value);
      setProductData(prev => ({
        ...prev,
        stock: value === '' ? 0 : parseInt(value) || 0
      }));
    }
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'new') {
      // Mostrar input para nueva categoría
      setShowNewCategoryInput(true);
      setProductData(prev => ({
        ...prev,
        categoryId: 0
      }));
    } else {
      // Ocultar input y establecer categoría
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      setProductData(prev => ({
        ...prev,
        categoryId: parseInt(value) || 0
      }));
    }
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handleNewCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
    if (error) setError(null);
  };

  const handleCreateCategoryAndContinue = async () => {
    if (!newCategoryName.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      const newCategory = await categoriesService.create({ name: newCategoryName.trim() });
      
      // Actualizar la lista de categorías
      setCategories(prev => [...prev, newCategory]);
      
      // Establecer la nueva categoría como seleccionada
      setProductData(prev => ({
        ...prev,
        categoryId: newCategory.id
      }));
      
      // Ocultar el input
      setShowNewCategoryInput(false);
      setNewCategoryName('');
    } catch (err: any) {
      console.error('Error al crear categoría:', err);
      setError(err.message || 'Error al crear la categoría');
    }
  };

  const validateForm = (): boolean => {
    if (!productData.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!productData.categoryId || productData.categoryId === 0) {
      setError('La categoría es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar al servicio para crear el producto
      const newProduct = await productsService.create(productData);
      console.log('Producto creado exitosamente:', newProduct);
      
      setSuccess(true);

      // Llamar al callback para refrescar la lista (si existe)
      if (onProductAdded) {
        onProductAdded();
      }

      // Mostrar mensaje de éxito por 1.5 segundos y luego cerrar/navegar
      setTimeout(() => {
        if (desktop && onClose) {
          onClose();
        } else {
          navigate('/Manage/AdminProducts');
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error al crear producto:', err);
      setError(err.message || 'Error al crear el producto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Nuevo Producto</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Header */}
      {!desktop && (
        <Header title="Nombre usuario" subtitle="Admin">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <LiaToolsSolid fontSize={"1.75rem"}/>
        </Header>
      )}

      {/* Mobile Title */}
      {!desktop && (
        <SectionTitle>
          <h2>Nuevo producto</h2>
        </SectionTitle>
      )}

      {/* Mensajes de Error y Éxito */}
      {error && (
        <div className={`alert alert-error ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={`alert alert-success ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
          </svg>
          <span>¡Producto creado exitosamente!</span>
        </div>
      )}

      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Código</h4>
        <FormField
          label="código"
          value={productData.name}
          placeholder="Ej: COD-001"
          editable={true}
          onChange={handleInputChange('name')}
        />

        <h4 className="field-label">Categoría</h4>
        {!showNewCategoryInput ? (
          <div className="form-field">
            <div className="field-input">
              <select
                value={productData.categoryId || 0}
                onChange={handleCategoryChange}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
              >
                <option value={0}>Seleccione una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="new">+ Crear nueva categoría</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <div className="form-field">
              <div className="field-input">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={handleNewCategoryNameChange}
                  placeholder="Nombre de la nueva categoría"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'center' }}>
              <BtnBlue
                width="100%"
                height="2.5rem"
                onClick={handleCreateCategoryAndContinue}
              >
                <span>Crear categoría</span>
              </BtnBlue>
              <BtnBlue
                width="100%"
                height="2.5rem"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategoryName('');
                  setProductData(prev => ({ ...prev, categoryId: 0 }));
                }}
                background="#9ca3af"
              >
                <span>Cancelar</span>
              </BtnBlue>
            </div>
          </>
        )}

        <h4 className="field-label">Descripción</h4>
        <FormField
          label="descripcion"
          value={productData.description || ''}
          placeholder="Ej: Producto de prueba"
          editable={true}
          onChange={handleInputChange('description')}
        />

        <h4 className="field-label">Precio</h4>
        <FormField
          label="precio"
          value={priceString}
          placeholder="Ej: 100"
          editable={true}
          onChange={handlePriceChange}
        />

        <h4 className="field-label">Stock</h4>
        <FormField
          label="stock"
          value={stockString}
          placeholder="Ej: 50"
          editable={true}
          onChange={handleStockChange}
        />

        <BtnBlue
          width="100%"
          height="3rem"
          onClick={loading ? undefined : handleSubmit}>
          <span>{loading ? 'Guardando...' : 'Agregar producto'}</span>
        </BtnBlue>

        {/* Back Button mobile */}
        {!desktop && (
          <Link to="/Manage/AdminProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem">
              <span>Volver</span>
            </BtnBlue>
          </Link>
        )}
      </div>
    </>
  );

  if (desktop) {
    return (
      <div className="desktop-popup-overlay" onClick={onClose}>
        <div className="desktop-popup" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default AddProducts;