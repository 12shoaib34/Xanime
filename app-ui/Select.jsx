"use client";

import React, { useState, useRef, useEffect } from "react";

const Select = ({
  onSelect = () => {},
  options = [],
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select an option",
  valuePropName = "value",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-64 w-full" ref={dropdownRef}>
      <div
        className="border border-primary bg-background-secondary rounded-lg p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <span>{selected ? selected[labelKey] : placeholder}</span>
        <span className="ml-2">▾</span>
      </div>
      {isOpen && (
        <div className="absolute w-full mt-2 bg-background-secondary border border-primary rounded-lg shadow-lg max-h-60 overflow-auto hide-scrollbar">
          {options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={index}
                className="p-3 hover:bg-background-tertiary cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option[labelKey]}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
