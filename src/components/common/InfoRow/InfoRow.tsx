import './InfoRow.css'

interface InfoRowProps {
  columns: React.ReactNode[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  onRowClick?: () => void;
  className?: string;
}

const InfoRow = ({
  columns,
  actionLabel,
  actionIcon,
  onActionClick,
  onRowClick,
  className = ''
}: InfoRowProps) => {
  // Reservar columna de acción si hay label o icon para mantener alineación (en header se oculta el icono)
  const hasActionColumn = Boolean(actionLabel || actionIcon)
  const totalColumns = columns.length + (hasActionColumn ? 1 : 0)

  return (
    <div
      className={`info-row ${onRowClick ? 'clickable' : ''} ${className}`}
      style={{ '--columns': totalColumns } as React.CSSProperties}
      onClick={onRowClick}
    >
      {columns.map((content, idx) => (
        <div key={idx} className="info-cell">
          {content}
        </div>
      ))}

      {hasActionColumn && (
        <div className="info-cell action-cell">
          <button
            type="button"
            className="row-action"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick && onActionClick();
            }}
          >
            {actionIcon && (
              <span className="action-icon">{actionIcon}</span>
            )}
            {actionLabel && <span>{actionLabel}</span>}
          </button>
        </div>
      )}
    </div>
  )
}



export default InfoRow


