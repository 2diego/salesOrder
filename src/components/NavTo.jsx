import propTypes from 'prop-types';
import './NavTo.css';
import { LuArrowRight } from "react-icons/lu";

const NavTo = ({text}) => {
  return (
    <div className="navto-container">
      <p>{text}</p>
      <LuArrowRight style={{ fontSize: "1.5rem" }}/>
    </div>
  )
};

NavTo.propTypes = {
  text: propTypes.string.isRequired,
};

export default NavTo;