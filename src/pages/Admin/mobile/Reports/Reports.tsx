import Header from "../../../../components/common/Header/Header"
import { Link } from "react-router-dom";
import NavTo from "../../../../components/common/NavTo/NavTo";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import { LuFileChartColumnIncreasing } from "react-icons/lu";

const Reports = () => {
  return (
    <>
      {/* Header */}  
      <Header>
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuFileChartColumnIncreasing />
      </Header>

      {/* Manage Title */}
      <SectionTitle>
        <h2>Reportes</h2>
      </SectionTitle>

      {/* Manage Options */}
      <Link to="/Reports" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Estadisticas de ventas" />
      </Link>
      <Link to="/OrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Historial de pedidos" />
      </Link>
      <Link to="/Reports" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Reporte" />
      </Link>
      <Link to="/Reports" style={{ textDecoration: 'none', color: 'inherit' }}>
        <NavTo text="Reporte" />
      </Link>
    </>
  )
}

export default Reports