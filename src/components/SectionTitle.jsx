import './SectionTitle.css';
import PropTypes from 'prop-types';

const SectionTitle = ({ children }) => {
  return (
    <div className="section-title">
      {children}
    </div>
  );
};

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionTitle;
