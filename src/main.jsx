import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

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
