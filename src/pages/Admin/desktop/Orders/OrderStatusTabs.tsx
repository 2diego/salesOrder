import React from 'react';

export type OrderDesktopFilter = 'pending' | 'validated' | 'processed' | 'cancelled' | 'all';

interface OrderStatusTabsProps {
  activeFilter: OrderDesktopFilter;
  onChange: (filter: OrderDesktopFilter) => void;
}

const ORDER_TABS: Array<{ key: OrderDesktopFilter; label: string }> = [
  { key: 'pending', label: 'Pendiente' },
  { key: 'validated', label: 'Validado' },
  { key: 'processed', label: 'Cargado' },
  { key: 'cancelled', label: 'Cancelado' },
  { key: 'all', label: 'Todos' },
];

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({ activeFilter, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {ORDER_TABS.map((tab) => {
        const active = activeFilter === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            style={{
              border: active ? '1px solid rgba(96,165,250,0.8)' : '1px solid rgba(100,100,100,0.4)',
              background: active ? 'rgba(96,165,250,0.22)' : 'rgb(31, 41, 55)',
              color: 'rgb(233, 232, 232)',
              borderRadius: '999px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: active ? 700 : 500,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default OrderStatusTabs;
