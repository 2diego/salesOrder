import Header from "../../../components/Header/Header"
import { Link } from "react-router-dom";
import NavTo from "../../../components/NavTo/NavTo";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { LuUser } from "react-icons/lu";

const Profile = () => {

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuUser />
      </Header>

      {/* Manage Title */}
      <SectionTitle>
        <h2>Perfil de usuario</h2>
      </SectionTitle>

      {/* Manage Options */}
      <Link to="/Profile/EditProfile" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Modificar datos de perfil" />
      </Link>
      <Link to="/Profile/EditPassword" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Modificar contraseña" />
      </Link>
    </>
  )
}

export default Profile