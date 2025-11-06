import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import CustomerManagement from "../pages/CustomerManagement";
import CustomerDetails from "../pages/CustomerDetails";
import CustomerForm from "../pages/CustomerForm";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../routes/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateRoute>
            <CustomerManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes/novo"
        element={
          <PrivateRoute>
            <CustomerForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes/:id"
        element={
          <PrivateRoute>
            <CustomerDetails />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
