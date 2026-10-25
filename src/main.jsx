import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "@/context/AuthContext";
import "./index.css";

// Restore saved theme before first paint
const saved = localStorage.getItem("intellus_theme") || "dark";
document.documentElement.classList.remove("dark", "light");
document.documentElement.classList.add(saved);
document.documentElement.setAttribute("data-theme", saved);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
