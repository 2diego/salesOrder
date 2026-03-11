import { useState, useRef, useEffect } from 'react';
import './FilterButton.css';

/**
 * FilterButton Component - Filtro de categorías con scroll infinito
 * @example
 * // Uso básico con estado interno
 * <FilterButton 
 *   categories={['Todos', 'Electrónicos', 'Ropa', 'Hogar']}
 *   onCategoryChange={(category) => console.log(category)}
 * />
 * // Componente controlado con estado externo
 * <FilterButton 
 *   categories={['Todos', 'Electrónicos', 'Ropa']}
 *   activeCategory={selectedCategory}
 *   onActiveCategoryChange={setSelectedCategory}
 *   onCategoryChange={handleCategoryChange} />
 * // Sin flechas de navegación (showArrows=false)
 * <FilterButton categories={['Todos', 'Categ. 1', 'Categ. 2']} showArrows={false} />
 */
interface FilterButtonProps {
  categories?: string[];
  onCategoryChange?: (category: string) => void;
  showArrows?: boolean;
  className?: string;
  activeCategory?: string;
  onActiveCategoryChange?: (category: string) => void;
}

const FilterButton = ({ 
  categories = ['Todos'], 
  onCategoryChange, 
  showArrows = true,
  className = '',
  activeCategory: externalActiveCategory,
  onActiveCategoryChange 
}: FilterButtonProps) => {
  const [internalActiveCategory, setInternalActiveCategory] = useState('Todos');
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Usar estado externo si se proporciona, de lo contrario usar estado interno
  const activeCategory = externalActiveCategory !== undefined ? externalActiveCategory : internalActiveCategory;
  const setActiveCategory = onActiveCategoryChange || setInternalActiveCategory;

  // Duplicar categorías para efecto de scroll infinito
  const duplicatedCategories = [...categories, ...categories, ...categories];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handleArrowClick = (direction: 'left' | 'right') => {
    const currentIndex = categories.indexOf(activeCategory);
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
    } else {
      newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
    }
    
    handleCategoryClick(categories[newIndex]);
    
    // Scroll a la categoría seleccionada
    scrollToCategory(categories[newIndex]);
  };

  const scrollToCategory = (category: string) => {
    if (!containerRef.current || categories.length === 0) return;
    
    const buttons = containerRef.current.querySelectorAll('.category-button');
    const categoryIndex = categories.indexOf(category);
    
    if (categoryIndex === -1) return;
    
    // Encontrar el conjunto de categorías del medio (el conjunto visible)
    const middleSetStart = categories.length;
    const targetIndex = middleSetStart + categoryIndex;
    
    if (buttons[targetIndex]) {
      isScrollingRef.current = true;
      buttons[targetIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'center' 
      });
      
      // Resetear el flag después de que el scroll complete
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  // Manejar scroll infinito
  useEffect(() => {
    const container = containerRef.current;
    if (!container || categories.length === 0) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      
      // Limpiar cualquier timeout existente
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      
      // Calcular el ancho de un conjunto de categorías
      const categorySetWidth = scrollWidth / 3;
      const threshold = 50; // Umbral pequeño para evitar jitter
      
      // Si se ha desplazado cerca del inicio del primer conjunto, saltar al conjunto del medio
      if (scrollLeft < categorySetWidth - threshold) {
        isScrollingRef.current = true;
        container.scrollLeft = categorySetWidth + scrollLeft;
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 100);
      }
      // Si se ha desplazado cerca del final del último conjunto, saltar al conjunto del medio
      else if (scrollLeft > categorySetWidth * 2 + threshold) {
        isScrollingRef.current = true;
        container.scrollLeft = categorySetWidth + (scrollLeft - categorySetWidth * 2);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 100);
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    // Inicializar posición de scroll al conjunto del medio después de un breve delay
    // para asegurar que el contenedor se haya renderizado
    const initTimeout = setTimeout(() => {
      if (container.scrollWidth > 0) {
        const categorySetWidth = container.scrollWidth / 3;
        container.scrollLeft = categorySetWidth;
      }
    }, 100);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
    };
  }, [categories]);

  // Scroll a la categoría activa cuando cambia
  useEffect(() => {
    if (activeCategory) {
      scrollToCategory(activeCategory);
    }
  }, [activeCategory]);

  return (
    <div className={`category-filter-container ${className}`}>
      <div className="category-wrapper">
        {/* Left arrow */}
        {showArrows && (
          <div 
            className="category-arrow left"
            onClick={() => handleArrowClick('left')}
          >
            <span>▼</span>
          </div>
        )}

        {/* Contenedor de categorías con scroll */}
        <div className="category-container" ref={containerRef}>
          {/* Categorías - duplicadas para efecto de scroll infinito */}
          {duplicatedCategories.map((category, index) => (
            <button
              key={`${category}-${index}`}
              onClick={() => handleCategoryClick(category)}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>

        {/* Right arrow */}
        {showArrows && (
          <div 
            className="category-arrow right"
            onClick={() => handleArrowClick('right')}
          >
            <span>▼</span>
          </div>
        )}
      </div>
    </div>
  );
};



export default FilterButton;
