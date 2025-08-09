import "./FormField.css";
import PropTypes from "prop-types";

const FormField = ({ label, value, editable = false, onChange }) => {
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

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
};

export default FormField;
