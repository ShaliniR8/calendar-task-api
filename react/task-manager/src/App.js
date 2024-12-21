import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewTask from "./components/NewTask";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/new" element={<NewTask />} />
      </Routes>
    </Router>
  );
};

export default App;
