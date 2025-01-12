import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ text, children }) => {
  const [iconIzq, iconDer] = children;

  return (
    <div className="header-container">
      <div className="icon-left">{iconIzq}</div>
      <p className="header-text">
        {text}
      </p>
      <div className="icon-right">{iconDer}</div>
    </div>
  );
};

Header.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Header;
