import React, { useState } from 'react';
import './Table.css';
import BtnBlue from '../../common/BtnBlue/BtnBlue';
import SearchBar from '../../common/SearchBar/SearchBar';

export interface TableColumn {
  key: string; // Tiene que coincidir con las variables del objeto data
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

export interface TableProps {
  title: string;
  subtitle?: string;
  columns: TableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  onAddNew?: () => void;
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  addButtonText?: string;
}

const Table: React.FC<TableProps> = ({
  title,
  subtitle,
  columns,
  data,
  onRowClick,
  onAddNew,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  searchPlaceholder = "Buscar...",
  addButtonText = "Agregar nuevo"
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtrar datos según el término de búsqueda
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(row => {
      // Buscar en todos los valores de la fila
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const renderCell = (column: TableColumn, row: any) => {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    return value;
  };

  return (
    <div className="table-container">
      {/* Card Header */}
      <div className="table-header">
        <div className="table-header-content">

          <div className="table-title-section">
            <h3 className="table-title">{title}</h3>
            {subtitle && <span className="table-subtitle">{subtitle}</span>}
          </div>
          
          <div className="table-controls">
            {/* Search Input */}
            <SearchBar 
              placeholder={searchPlaceholder} 
              mobile={false}
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
            />

            {/* Add Button */}
            <BtnBlue width="auto" height="2.75rem" borderRadius="0.5rem" isBackButton={false} background='linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))' onClick={onAddNew}>
              <svg className="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {addButtonText}
            </BtnBlue>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="table-scroll">
          <div className="table-content">
            <table className="data-table">

              <thead className="table-head">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className={`table-header-cell ${column.sortable ? 'sortable' : ''}`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.label}
                      {column.sortable && (
                        <svg className="sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="table-body">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="loading-cell">
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="empty-cell">
                      <div className="empty-message">
                        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>{emptyMessage}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`table-row ${index % 2 === 0 ? 'even' : 'odd'} ${onRowClick ? 'clickable' : ''}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="table-cell">
                          {renderCell(column, row)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

