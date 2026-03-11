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
  const totalColumns = columns.length + (actionLabel || actionIcon ? 1 : 0)

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

      {actionLabel && (
        <div className="info-cell action-cell">
          <button type="button" className="row-action" onClick={(e) => { e.stopPropagation(); onActionClick && onActionClick() }}>
            {actionIcon && (
              <span className="action-icon">{actionIcon}</span>
            )}
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  )
}



export default InfoRow


