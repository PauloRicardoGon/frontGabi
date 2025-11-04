import { useNavigate } from "react-router-dom";

export default function CustomerCard({ customer }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/clientes/${customer.id}`)}
      className="
        p-3 
        bg-[#37618E] 
        text-white 
        rounded-xl 
        transition-all 
        duration-300 
        ease-in-out
      "
    >
      <h2 className="text-xl font-semibold mb-1">{customer.name}</h2>
      <p className="text-sm opacity-90">{customer.phone}</p>
    </div>
  );
}
