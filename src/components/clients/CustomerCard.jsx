import { useNavigate } from "react-router-dom";

export default function CustomerCard({ customer }) {
  const navigate = useNavigate();
  const address = customer.address ?? {};

  return (
    <div
      onClick={() => navigate(`/clientes/${customer.id}`)}
      className="
        cursor-pointer
        p-3
        bg-[#37618E]
        text-white
        rounded-xl
        transition-all
        duration-300
        ease-in-out
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <h2 className="text-xl font-semibold mb-2">{customer.name}</h2>
      <div className="space-y-1 text-sm text-white/90">
        <p>
          <span className="font-semibold">CPF/CNPJ:</span>{" "}
          {customer.document || "Não informado"}
        </p>
        <p>
          <span className="font-semibold">Telefone:</span>{" "}
          {customer.phone || "Não informado"}
        </p>
        <div className="pt-2 space-y-1">
          <p className="font-semibold">Endereço</p>
          {address.formatted ? (
            <>
              {(address.street || address.number) && (
                <p>{[address.street, address.number].filter(Boolean).join(", ")}</p>
              )}
              {address.complement && <p>Complemento: {address.complement}</p>}
              {address.district && <p>Bairro: {address.district}</p>}
              {address.city && <p>Cidade: {address.city}</p>}
            </>
          ) : (
            <p>Não informado</p>
          )}
        </div>
      </div>
    </div>
  );
}
