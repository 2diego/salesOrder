import "./FormField.css";

interface FormFieldProps {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ label, value, editable = false, onChange }: FormFieldProps) => {
  return (
    <div className="form-field">
      <div className="field-input">
        {editable ? (
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={label}
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
};



export default FormField;
