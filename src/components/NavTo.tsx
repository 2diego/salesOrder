import './NavTo.css';
import { LuArrowRight } from "react-icons/lu";

interface NavToProps {
  text: string;
}

const NavTo = ({text}: NavToProps) => {
  return (
    <div className="navto-container">
      <p>{text}</p>
      <LuArrowRight style={{ fontSize: "1.5rem" }}/>
    </div>
  )
};



export default NavTo;