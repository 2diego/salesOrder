import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import InfoRow from "../../../../components/InfoRow/InfoRow";
import { LuClipboardList, LuPlus } from 'react-icons/lu';

const ProductsList = () => {
  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LiaToolsSolid fontSize={"1.75rem"}/>
      </Header>

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionTitle>
          <h2>Productos</h2>
        </SectionTitle>
        <BtnBlue width="3rem" height="3rem" borderRadius="24px">
          <Link to="/Manage/AddProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span><LuPlus style={{ fontSize: "2rem" }} /></span>
          </Link>
        </BtnBlue>
      </div>


      { /* Search Bar */ }
      <SearchBar placeholder="Buscar productos" />

      { /* Products List */ }
      <InfoRow className="row-header"
        columns={[
          <span key={'id'}>Código</span>,
          <span key={'description'}>Descripción</span>
        ]}
        actionIcon={<LuClipboardList />}
      />
      <InfoRow
      columns={[
        <span key={'id'}>100</span>,
        <span key={'description'}>Sulleg Extra Blanco 12x4x30</span>
      ]}
      actionLabel="Editar"
      actionIcon={<LuClipboardList />}
      /> 
      <InfoRow
      columns={[
        <span key={'id'}>900</span>,
        <span key={'description'}>Elegante 4x120m</span>
      ]}
      actionLabel="Editar"
      actionIcon={<LuClipboardList />}
      /> 
      <InfoRow
        columns={[
          <span key={'id'}>904</span>,
          <span key={'description'}>Elegante 6x30m S/H</span>
        ]}
        actionLabel="Editar"
        actionIcon={<LuClipboardList />}
      /> 

      {/* Back Button */}
      <Link to="/Manage/AdminProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
};

export default ProductsList;