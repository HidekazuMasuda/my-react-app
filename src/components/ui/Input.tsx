import React from 'react';
import './Input.css';

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
  error,
  label,
  className = '',
  onKeyDown,
  onBlur,
  autoFocus = false,
  id,
}) => {
  const inputClasses = `input ${error ? 'input--error' : ''} ${className}`.trim();

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        autoFocus={autoFocus}
      />
      {error && <span className="input-error-message error-message">{error}</span>}
    </div>
  );
};

export default Input;