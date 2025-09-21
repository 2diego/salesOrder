import './BtnBlue.css';

interface BtnBlueProps {
  width: string;
  height: string;
  children: React.ReactNode;
  isBackButton?: boolean;
  borderRadius?: string;
}

const BtnBlue = ({ width, height, children, isBackButton = false, borderRadius = '12px' }: BtnBlueProps) => {
  return (
    <div className={`btn-container ${isBackButton ? 'btn-back' : ''}`}>
      <button className="btn-blue" style={{ width: width, height: height, borderRadius: borderRadius }}>
        {children}
      </button>
    </div>
  );
};



export default BtnBlue;
