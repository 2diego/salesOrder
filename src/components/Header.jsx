import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ texto, children }) => {
  const [iconIzq, iconDer] = children;

  return (
    <div className="header-container">
      <div className="icon-left">{iconIzq}</div>
      <div className="header-text">{texto}</div>
      <div className="icon-right">{iconDer}</div>
    </div>
  );
};

Header.propTypes = {
  texto: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Header;
