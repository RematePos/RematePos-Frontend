import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`shared-btn shared-btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;