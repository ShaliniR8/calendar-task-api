import React, { useState } from "react";
import "./PriorityDropdown.css";

const PriorityDropdown = ({ priority, setPriority }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const priorityOptions = [
    { value: 0, label: "Low", color: "limegreen" },
    { value: 1, label: "Default", color: "gray" },
    { value: 2, label: "Medium", color: "orange" },
    { value: 3, label: "High", color: "red" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (value) => {
    setPriority(value);
    setDropdownOpen(false);
  };

  return (
    <div className="priority-dropdown">
      <div className="selected-priority" onClick={toggleDropdown}>
        <div
          className="priority-circle"
          style={{ backgroundColor: priorityOptions[priority].color }}
        ></div>
        <span>{priorityOptions[priority].label}</span>
      </div>
      {dropdownOpen && (
        <div className="priority-options">
          {priorityOptions.map((option) => (
            <div
              key={option.value}
              className="priority-option"
              onClick={() => handleSelect(option.value)}
            >
              <div
                className="priority-circle"
                style={{ backgroundColor: option.color }}
              ></div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityDropdown;
