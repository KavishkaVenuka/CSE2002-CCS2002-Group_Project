import React, { InputHTMLAttributes } from 'react';

export interface PriceInputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Accepts standard input attributes
}

export function PriceInput({ onChange, onKeyDown, ...props }: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const val = parseFloat(e.target.value);
      if (val < 0) {
        e.target.value = Math.abs(val).toString();
      }
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent typing characters that result in negative numbers or scientific notation
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault();
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <input
      type="number"
      min="0"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
