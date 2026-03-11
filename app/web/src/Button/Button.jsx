import "./button.css";

export const Button = ({
  color,
  size,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  children = "Sign in",
}) => {
  return (
    <button
      className={`button ${className}`.trim()}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="sign-in-synthetic">{children}</div>
    </button>
  );
};
