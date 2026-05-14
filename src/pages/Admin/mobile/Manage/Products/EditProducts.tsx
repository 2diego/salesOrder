import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useEffect, useMemo, useState } from "react";
import './AddProducts.css';
import { Product, UpdateProductDTO, productsService } from "../../../../../services/productsService";
import { categoriesService, Category } from "../../../../../services/categoriesService";

interface EditProductsProps {
  desktop?: boolean;
  onClose?: () => void;
  product?: Product;
  onProductUpdated?: (updated: Product) => void;
  onProductDeleted?: () => void;
}

const EditProducts: React.FC<EditProductsProps> = ({ desktop = false, onClose, product, onProductUpdated, onProductDeleted }) => {
  const navigate = useNavigate();
  const params = useParams();

  const [currentProduct, setCurrentProduct] = useState<Product | null>(product || null);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    categoryId: product?.categoryId || 0,
    priceString: product?.price ? product.price.toString() : '',
    stockString: product?.stock ? product.stock.toString() : '',
    imageUrlString: product?.imageUrl?.trim() || '',
  });
  // Cargar cuando se usa vía ruta
  useEffect(() => {
    const load = async () => {
      if (!currentProduct && params.id) {
        try {
          const data = await productsService.findOne(parseInt(params.id));
          setCurrentProduct(data);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            categoryId: data.categoryId || 0,
            priceString: data.price ? data.price.toString() : '',
            stockString: data.stock ? data.stock.toString() : '',
            imageUrlString: data.imageUrl?.trim() || '',
          });
        } catch (e: any) {
          setError(e.message || 'No se pudo cargar el producto');
        }
      }
    };
    load();
  }, [currentProduct, params.id]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const list = await categoriesService.findAll();
        setCategories(list);
      } catch (err: any) {
        setError('No se pudieron cargar las categorías');
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, categoryId: parseInt(e.target.value) || 0 }));
    if (error) setError(null);
  };

  const hasChanges = useMemo(() => {
    const priceNum = formData.priceString === '' ? 0 : parseFloat(formData.priceString) || 0;
    // const stockNum = formData.stockString === '' ? 0 : parseInt(formData.stockString) || 0; // Stock no usado por el momento
    const base = currentProduct || product;
    if (!base) return false;
    const imageChanged =
      formData.imageUrlString.trim() !== (base.imageUrl?.trim() || '');
    return (
      formData.name !== base.name ||
      formData.description !== (base.description || '') ||
      formData.categoryId !== base.categoryId ||
      priceNum !== base.price ||
      imageChanged
      // || stockNum !== base.stock
    );
  }, [formData, currentProduct, product]);

  const buildDiff = (): UpdateProductDTO => {
    const diff: UpdateProductDTO = {};
    const priceNum = formData.priceString === '' ? 0 : parseFloat(formData.priceString) || 0;
    // const stockNum = formData.stockString === '' ? 0 : parseInt(formData.stockString) || 0; // Stock no usado por el momento
    const base = currentProduct || product;
    if (!base) return diff;
    if (formData.name !== base.name) diff.name = formData.name;
    if (formData.description !== (base.description || '')) diff.description = formData.description || undefined;
    if (formData.categoryId !== base.categoryId) diff.categoryId = formData.categoryId;
    if (priceNum !== base.price) diff.price = priceNum;
    const nextImg = formData.imageUrlString.trim();
    const prevImg = base.imageUrl?.trim() || '';
    if (nextImg !== prevImg) diff.imageUrl = nextImg || null;
    // if (stockNum !== base.stock) diff.stock = stockNum;
    return diff;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) { setError('El nombre es obligatorio'); return false; }
    if (!formData.categoryId) { setError('La categoría es obligatoria'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const diff = buildDiff();
    if (Object.keys(diff).length === 0) { setError('No hay cambios para guardar'); return; }
    setLoading(true);
    setError(null);
    try {
      const base = currentProduct || product;
      if (!base) return;
      const updated = await productsService.update(base.id, diff);
      setSuccess(true);
      setSuccessMessage('¡Producto actualizado!');
      onProductUpdated && onProductUpdated(updated);
      setTimeout(() => {
        if (desktop && onClose) onClose(); else navigate('/Manage/AdminProducts');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const base = currentProduct || product;
    if (!base) return;

    // Confirmación visual manejada por estado (showDeactivateConfirm)
    setDeleting(true);
    setError(null);
    try {
      await productsService.remove(base.id);
      setSuccess(true);
      setSuccessMessage('Producto desactivado correctamente');
      onProductDeleted && onProductDeleted();
      setTimeout(() => {
        if (desktop && onClose) onClose(); else navigate('/Manage/AdminProducts');
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto');
    } finally {
      setDeleting(false);
      setShowDeactivateConfirm(false);
    }
  };

  const content = (
    <>
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Editar Producto</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {!desktop && (
        <Header>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <LiaToolsSolid fontSize={"1.75rem"}/>
        </Header>
      )}

      {!desktop && (
        <SectionTitle>
          <h2>Editar producto</h2>
        </SectionTitle>
      )}

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
          <span>{successMessage || '¡Producto actualizado!'}</span>
        </div>
      )}

      {showDeactivateConfirm && !success && (
        <div className={`alert alert-error ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
          <span>
            ¿Seguro que quieres desactivar este producto? No se podrá usar en nuevos pedidos, pero los pedidos históricos se mantienen.
          </span>
        </div>
      )}

      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Código</h4>
        <FormField label="nombre" value={formData.name} placeholder="Código del producto" editable={true} onChange={handleInputChange('name')} />

        <h4 className="field-label">Categoría</h4>
        <div className="form-field">
          <div className="field-input">
            <select
              value={formData.categoryId || 0}
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
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <h4 className="field-label">Descripción</h4>
        <FormField label="descripcion" value={formData.description} placeholder="Descripción" editable={true} onChange={handleInputChange('description')} />

        <h4 className="field-label">URL de imagen (opcional)</h4>
        <FormField
          label="imageUrl"
          value={formData.imageUrlString}
          placeholder="https://i.ibb.co/..."
          editable={true}
          onChange={handleInputChange('imageUrlString')}
        />

        <h4 className="field-label">Precio</h4>
        <FormField label="precio" value={formData.priceString} placeholder="Ej: 100" editable={true} onChange={handleInputChange('priceString')} />

        {/* Stock no usado por el momento
        <h4 className="field-label">Stock</h4>
        <FormField label="stock" value={formData.stockString} placeholder="Ej: 50" editable={true} onChange={handleInputChange('stockString')} />
        */}

        <BtnBlue width="100%" height="3rem" onClick={(loading || deleting) ? undefined : handleSubmit} disabled={loading || deleting}>
          <span>{loading ? 'Guardando...' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}</span>
        </BtnBlue>

        {showDeactivateConfirm ? (
          <>
            <BtnBlue
              width="100%"
              height="3rem"
              background="rgba(239, 68, 68, 0.9)"
              onClick={(loading || deleting) ? undefined : handleDelete}
              disabled={loading || deleting}
            >
              <span>{deleting ? 'Desactivando...' : 'Confirmar desactivación'}</span>
            </BtnBlue>
            <BtnBlue
              width="100%"
              height="3rem"
              background="#6b7280"
              onClick={deleting ? undefined : () => setShowDeactivateConfirm(false)}
              disabled={deleting}
            >
              <span>Cancelar</span>
            </BtnBlue>
          </>
        ) : (
          <BtnBlue
            width="100%"
            height="3rem"
            background="rgba(239, 68, 68, 0.9)"
            onClick={(loading || deleting) ? undefined : () => setShowDeactivateConfirm(true)}
            disabled={loading || deleting}
          >
            <span>Desactivar producto</span>
          </BtnBlue>
        )}

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

export default EditProducts;


