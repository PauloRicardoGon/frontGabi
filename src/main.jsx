import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CustomerProvider>
          <App />
        </CustomerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
