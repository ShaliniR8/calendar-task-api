import React, { useState } from "react";
import PriorityDropdown from "./PriorityDropdown";
import "./NewTask.css";

const NewTask = () => {
  const [task, setTask] = useState("");
  const [datetime, setDatetime] = useState(new Date().toISOString().slice(0, 16));
  const [priority, setPriority] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { task, datetime, priority };
    console.log(newTask);
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit}>
        {/* First Row: Dropdown, Input, Submit Button */}
        <div className="form-row">
          {/* Priority Dropdown */}
          <PriorityDropdown priority={priority} setPriority={setPriority} />

          {/* Task Input */}
          <input
            type="text"
            placeholder="Enter task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />

          {/* Add Task Button */}
          <button type="submit">Add Task</button>
        </div>

        {/* Second Row: Date-Time Picker */}
        <div className="form-row">
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default NewTask;
