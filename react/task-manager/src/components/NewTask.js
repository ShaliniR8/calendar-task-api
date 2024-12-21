import React, { useState } from "react";
import "./NewTask.css";

const NewTask = () => {
  const [task, setTask] = useState("");
  const [datetime, setDatetime] = useState(new Date().toISOString().slice(0, 16));
  const [priority, setPriority] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      task,
      datetime,
      priority,
    };

    try {
      const response = await fetch("/api/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        alert("Task added successfully");
        setTask("");
        setDatetime(new Date().toISOString().slice(0, 16));
        setPriority(1);
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the task");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="border p-4 rounded" style={{ backgroundColor: "black" }}>
        {/* First Row */}
        <div className="form-row justify-content-center align-items-center">
          {/* Priority Dropdown */}
          <div className="col-auto">
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="form-control"
            >
              <option value={0}>Low</option>
              <option value={1}>Default</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>

          {/* Task Input */}
          <div className="col-6">
            <input
              type="text"
              placeholder="Enter task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="form-control text-white bg-dark"
              required
            />
          </div>

          {/* Add Task Button */}
          <div className="col-auto">
            <button type="submit" className="btn btn-dark">
              Add Task
            </button>
          </div>
        </div>

        {/* Second Row */}
        <div className="form-row mt-2">
          <div className="col-3 offset-6">
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="form-control text-white bg-dark"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTask;
