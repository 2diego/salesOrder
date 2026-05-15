import Header from "../../../../components/common/Header/Header"
import { HeaderBackNavLink } from "../../../../components/mobile/header/HeaderBackNavLink";
import { Link } from "react-router-dom";
import NavTo from "../../../../components/common/NavTo/NavTo";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import { LuFileChartColumnIncreasing } from "react-icons/lu";

const Reports = () => {
  return (
    <>
      {/* Header */}  
      <Header
        leftSlot={<HeaderBackNavLink to="/Manage" ariaLabel="Volver a administrar" />}
        rightSlot={<LuFileChartColumnIncreasing />}
      />

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