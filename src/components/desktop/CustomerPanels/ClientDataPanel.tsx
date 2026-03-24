import SectionTitle from '../../common/SectionTitle/SectionTitle';
import FormField from '../../common/FormField/FormField';

interface ClientDataPanelProps {
  clientName: string;
  clientAddress: string;
}

const ClientDataPanel = ({ clientName, clientAddress }: ClientDataPanelProps) => (
  <>
    <SectionTitle>
      <h2>Datos del cliente</h2>
    </SectionTitle>
    <div className="customer-desktop-client-data">
      <FormField label="Nombre cliente" value={clientName} editable={false} />
      <FormField label="Dirección" value={clientAddress} editable={false} />
    </div>
  </>
);

export default ClientDataPanel;
