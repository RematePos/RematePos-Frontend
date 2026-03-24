import React from "react";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => {
  return (
    <div className="shared-input-group">
      {label && <label className="shared-label">{label}</label>}
      <input
        className="shared-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;