import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";       // renamed from App.jsx
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ListItem from "./pages/ListItem.jsx";

import "./css/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Home Page */}
        <Route path="/home" element={<Home />} />

        {/* List Items Page */}
        <Route path="/list/:id" element={<ListItem />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
