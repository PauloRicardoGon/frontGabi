import { useContext } from "react";
import { CustomerContext } from "../contexts/CustomerContext";

export const useCustomers = () => useContext(CustomerContext);

export default useCustomers;
