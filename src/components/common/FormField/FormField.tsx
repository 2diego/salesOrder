import "./FormField.css";

interface FormFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ value, placeholder, editable = false, onChange }: FormFieldProps) => {
  // Si no hay placeholder, usar el value como placeholder
  const inputPlaceholder = placeholder || value;
  
  // Mostrar placeholder cuando value esta vacio o es igual al placeholder
  const showPlaceholder = !value || value === inputPlaceholder;
  
  return (
    <div className="form-field">
      <div className="field-input">
        {editable ? (
          <input
            type="text"
            value={showPlaceholder ? '' : value}
            onChange={onChange}
            placeholder={inputPlaceholder}
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
};



export default FormField;
