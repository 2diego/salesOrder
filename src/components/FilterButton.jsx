import { useState } from 'react';
import propTypes from 'prop-types';
import './FilterButton.css';

/**
 * FilterButton Component - A reusable category filter component
 * 
 * This component provides a horizontal scrollable list of category buttons
 * with optional navigation arrows. It can be controlled externally or manage
 * its own state internally.
 * 
 * @example
 * // Basic usage with internal state
 * <FilterButton 
 *   categories={['Todos', 'Electrónicos', 'Ropa', 'Hogar']}
 *   onCategoryChange={(category) => console.log(category)}
 * />
 * 
 * @example
 * // Controlled component with external state
 * <FilterButton 
 *   categories={['Todos', 'Electrónicos', 'Ropa']}
 *   activeCategory={selectedCategory}
 *   onActiveCategoryChange={setSelectedCategory}
 *   onCategoryChange={handleCategoryChange}
 * />
 * 
 * @example
 * // Without navigation arrows
 * <FilterButton 
 *   categories={['Todos', 'Categ. 1', 'Categ. 2']}
 *   showArrows={false}
 * />
 */
const FilterButton = ({ 
  categories = ['Todos'], 
  onCategoryChange, 
  showArrows = true,
  className = '',
  activeCategory: externalActiveCategory,
  onActiveCategoryChange 
}) => {
  const [internalActiveCategory, setInternalActiveCategory] = useState('Todos');
  
  // Use external state if provided, otherwise use internal state
  const activeCategory = externalActiveCategory !== undefined ? externalActiveCategory : internalActiveCategory;
  const setActiveCategory = onActiveCategoryChange || setInternalActiveCategory;

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handleArrowClick = (direction) => {
    const currentIndex = categories.indexOf(activeCategory);
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
    } else {
      newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
    }
    
    handleCategoryClick(categories[newIndex]);
  };

  return (
    <div className={`category-filter-container ${className}`}>
      <div className="category-container">
        {/* Left arrow */}
        {showArrows && (
          <div 
            className="category-arrow left"
            onClick={() => handleArrowClick('left')}
          >
            <span>▼</span>
          </div>
        )}

        {/* Categories */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`category-button ${activeCategory === category ? 'active' : ''}`}
          >
            <span>{category}</span>
          </button>
        ))}

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

FilterButton.propTypes = {
  /** Array of category names to display */
  categories: propTypes.arrayOf(propTypes.string),
  /** Callback function called when a category is selected */
  onCategoryChange: propTypes.func,
  /** Whether to show navigation arrows (default: true) */
  showArrows: propTypes.bool,
  /** Additional CSS classes to apply to the container */
  className: propTypes.string,
  /** Currently active category (for controlled component) */
  activeCategory: propTypes.string,
  /** Callback function to update active category (for controlled component) */
  onActiveCategoryChange: propTypes.func
};

export default FilterButton;
