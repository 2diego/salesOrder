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
