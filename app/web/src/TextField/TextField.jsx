import "./text-field.css";

export const TextField = ({
  id,
  name,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  autoComplete,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`text-field ${className}`.trim()}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="text-field-input"
      />
    </div>
  );
};
