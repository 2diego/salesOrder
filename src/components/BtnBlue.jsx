import PropTypes from 'prop-types';
import './BtnBlue.css';

const BtnBlue = ({ width, height, children, isBackButton = false }) => {
  return (
    <div className={`btn-container ${isBackButton ? 'btn-back' : ''}`}>
      <button className="btn-blue" style={{ width: width, height: height }}>
        {children}
      </button>
    </div>
  );
};

BtnBlue.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isBackButton: PropTypes.bool,
};

export default BtnBlue;
