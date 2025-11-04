import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // substituir depois pela API real
    setCustomer({
      id,
      name: "Maria Silva",
      phone: "(11) 99999-9999",
      email: "maria@email.com",
      address: "Rua das Flores, 123",
    });
  }, [id]);

  if (!customer) return <div>Carregando...</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">{customer.name}</h1>
      <p><strong>Telefone:</strong> {customer.phone}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Endereço:</strong> {customer.address}</p>

      <div className="mt-8 flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Editar Cliente
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          Equipamentos
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Ordens de Serviço
        </button>
      </div>
    </div>
  );
}
