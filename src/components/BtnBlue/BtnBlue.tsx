import './BtnBlue.css';

interface BtnBlueProps {
  width: string;
  height: string;
  children: React.ReactNode;
  isBackButton?: boolean;
  borderRadius?: string;
  background?: string;
  onClick?: () => void;
}

const BtnBlue = ({ width, height, children, isBackButton = false, borderRadius = '12px', background, onClick }: BtnBlueProps) => {
  return (
    <div className={`btn-container ${isBackButton ? 'btn-back' : ''}`}>
      <button className="btn-blue" style={{ width: width, height: height, borderRadius: borderRadius, background: background }} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};



export default BtnBlue;
