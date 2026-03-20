import './BtnBlue.css';

interface BtnBlueProps {
  width: string;
  height: string;
  children: React.ReactNode;
  isBackButton?: boolean;
  borderRadius?: string;
  background?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BtnBlue = ({ width, height, children, isBackButton = false, borderRadius = '12px', background, onClick, disabled = false }: BtnBlueProps) => {
  if (isBackButton) {
    // Reserva espacio real en el layout para que el botón fijo no tape contenido.
    // El spacer debe acompañar también al padding vertical que define la clase `.btn-back` (ver CSS).
    const spacerHeight = `calc(${height} + 1.5rem)`;

    return (
      <>
        <div className="btn-back-spacer" style={{ height: spacerHeight }} aria-hidden="true" />
        <div className={`btn-container btn-back`}>
          <button
            className="btn-blue"
            style={{
              width: width,
              height: height,
              borderRadius: borderRadius,
              background: background,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={`btn-container ${isBackButton ? 'btn-back' : ''}`}>
      <button 
        className="btn-blue" 
        style={{ width: width, height: height, borderRadius: borderRadius, background: background, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }} 
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};



export default BtnBlue;
