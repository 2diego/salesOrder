import './BtnBlue.css';

interface BtnBlueProps {
  width: string;
  height: string;
  children: React.ReactNode;
  isBackButton?: boolean;
}

const BtnBlue = ({ width, height, children, isBackButton = false }: BtnBlueProps) => {
  return (
    <div className={`btn-container ${isBackButton ? 'btn-back' : ''}`}>
      <button className="btn-blue" style={{ width: width, height: height }}>
        {children}
      </button>
    </div>
  );
};



export default BtnBlue;
