import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ title, subtitle, children }) => {
  const [iconIzq, iconDer] = children;

  return (
    <div className="header-container">
      <div className="icon-left">{iconIzq}</div>
      <div className="header-text">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
      </div>
      <div className="icon-right">{iconDer}</div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Header;
