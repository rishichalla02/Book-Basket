import "./formfield.css";

const FormField = ({
  label,
  type,
  placeholder,
  className,
  Icon,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="input-groups">
      <div className="input-Container">
        <label className="input-labels">{label}</label>
        {Icon && <Icon className="input-icons" />}
        <input
          type={type}
          placeholder={placeholder}
          className={`${className} ${error ? "border-red-500" : ""}`}
          required
          value={value}
          onChange={onChange}
        />
        {error && (
          <p className="text-red-500 text-sm relative top-3 left-4 bottom-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormField;
