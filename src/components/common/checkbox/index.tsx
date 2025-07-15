import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // now optional
  id?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  className = "",
  disabled = false,
  children,
  ...rest
}) => {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`} htmlFor={id}>
      <span className="relative flex items-center" style={{ marginRight: 12 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          id={id}
          disabled={disabled}
          className="peer appearance-none w-6 h-6 border border-white rounded-none bg-black checked:bg-green-500 checked:border-green-500 focus:outline-none transition-colors"
          {...rest}
        />
        {/* Custom checkmark, center, only show if checked */}
        {checked && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="11" viewBox="0 0 13 11" fill="none">
              <path d="M1 5L5 9L12 1" stroke="white" strokeWidth="2"/>
            </svg>
          </span>
        )}
      </span>
      {children}
    </label>
  );
};

export default Checkbox; 