import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  form?: string;
  disabled?: boolean;
  required?: boolean;
}

export function TimeInput({ 
  value: initialValue, 
  onChange,
  name,
  form,
  disabled = false,
  required = false
}: TimeInputProps) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const formatTimeValue = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/[^\d]/g, '');
    
    // Pad with zeros to ensure we have enough digits
    const padded = numbers.padEnd(9, '0');
    
    // Extract parts
    const hours = padded.slice(0, 2);
    const minutes = padded.slice(2, 4);
    const seconds = padded.slice(4, 6);
    const milliseconds = padded.slice(6, 9);
    
    // Format parts
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^\d]/g, '');
    
    // Format as user types
    if (newValue.length > 0) {
      let formatted = newValue;
      
      // Add first colon after hours (if we have enough digits)
      if (newValue.length >= 2) {
        formatted = formatted.slice(0, 2) + ':' + formatted.slice(2);
      }
      
      // Add second colon after minutes (if we have enough digits)
      if (newValue.length >= 4) {
        formatted = formatted.slice(0, 5) + ':' + formatted.slice(5);
      }
      
      // Add decimal point after seconds (if we have enough digits)
      if (newValue.length >= 6) {
        formatted = formatted.slice(0, 8) + '.' + formatted.slice(8);
      }
      
      // Limit to maximum length (HH:MM:SS.mmm)
      if (newValue.length > 9) {
        newValue = newValue.slice(0, 9);
        formatted = formatTimeValue(newValue);
      }
      
      setValue(formatted);
    } else {
      setValue('');
    }
  };

  const handleBlur = () => {
    setFocused(false);
    // If empty or incomplete, format with zeros
    const formattedValue = value ? formatTimeValue(value.replace(/[^\d]/g, '')) : '00:00:00.000';
    setValue(formattedValue);
    onChange(formattedValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    e.target.select();
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Clock className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        name={name}
        form={form}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="00:00:00.000"
        pattern="^([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}$"
        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
        disabled={disabled}
        required={required}
      />
      {focused && (
        <div className="absolute inset-x-0 bottom-full mb-1 text-xs text-gray-500">
          Format: HH:MM:SS.mmm
        </div>
      )}
    </div>
  );
}