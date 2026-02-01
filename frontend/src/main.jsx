import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import "./index.css";
import History from "./pages/History";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recommend" element={<App />} />
        <Route path="/history" element={<History />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
