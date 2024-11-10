import PropTypes from 'prop-types';
import './BtnBlue.css';

const BtnBlue = ({ width, height, children }) => {
  return (
    <div className="btn-container">
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
};

export default BtnBlue;
