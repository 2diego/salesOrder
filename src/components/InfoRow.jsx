import PropTypes from 'prop-types'
import './InfoRow.css'

const InfoRow = ({
  columns,
  actionLabel,
  actionIcon,
  onActionClick,
  onRowClick,
  className = ''
}) => {
  const totalColumns = columns.length + (actionLabel ? 1 : 0)

  return (
    <div
      className={`info-row ${onRowClick ? 'clickable' : ''} ${className}`}
      style={{ '--columns': totalColumns }}
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
            <span>{actionLabel}</span>
            {actionIcon && (
              <span className="action-icon">{actionIcon}</span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

InfoRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.node).isRequired,
  actionLabel: PropTypes.string,
  actionIcon: PropTypes.node,
  onActionClick: PropTypes.func,
  onRowClick: PropTypes.func,
  className: PropTypes.string
}

export default InfoRow


