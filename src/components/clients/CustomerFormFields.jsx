import { FaWhatsapp } from "react-icons/fa";

const phoneFields = [
  { name: "telefone1", label: "Telefone 1", whatsappKey: "whatsapp1" },
  { name: "telefone2", label: "Telefone 2", whatsappKey: "whatsapp2" },
  { name: "celular", label: "Celular", whatsappKey: "whatsappCelular" },
];

export default function CustomerFormFields({
  form,
  onChange,
  onCepBlur,
  disabled = false,
}) {
  const handleChange = onChange ?? (() => {});
  const handleCepBlur = onCepBlur ?? (() => {});

  return (
    <>
      {phoneFields.map(({ name, label, whatsappKey }) => {
        const value = form?.[name] ?? "";
        const isChecked = Boolean(form?.[whatsappKey]);

        return (
          <div key={name} className="campo flex items-center gap-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                className="w-full"
                disabled={disabled}
              />
            </div>

            <label
              className={`flex items-center gap-1 mt-6 ${
                disabled ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                name={whatsappKey}
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
              />
              <FaWhatsapp
                className={`text-xl transition-colors duration-200 ${
                  isChecked ? "text-green-500" : "text-black"
                } ${disabled ? "opacity-60" : ""}`}
              />
            </label>
          </div>
        );
      })}

      <div className="campo">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form?.email ?? ""}
          onChange={handleChange}
          className="w-full"
          disabled={disabled}
        />
      </div>

      <div className="campo">
        <label className="block font-semibold mb-1">CEP</label>
        <input
          type="text"
          name="cep"
          value={form?.cep ?? ""}
          onChange={handleChange}
          onBlur={disabled ? undefined : handleCepBlur}
          className="w-full"
          disabled={disabled}
        />
      </div>

      <div className="campo">
        <label className="block font-semibold mb-1">Endereço</label>
        <input
          type="text"
          name="endereco"
          value={form?.endereco ?? ""}
          onChange={handleChange}
          className="w-full"
          disabled={disabled}
        />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div>
          <label className="block font-semibold mb-1">Número</label>
          <input
            type="text"
            name="numero"
            value={form?.numero ?? ""}
            onChange={handleChange}
            className="w-full"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Complemento</label>
          <input
            type="text"
            name="complemento"
            value={form?.complemento ?? ""}
            onChange={handleChange}
            className="w-full"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={form?.bairro ?? ""}
            onChange={handleChange}
            className="w-full"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="campo">
        <label className="block font-semibold mb-1">Cidade</label>
        <input
          type="text"
          name="cidade"
          value={form?.cidade ?? ""}
          onChange={handleChange}
          className="w-full"
          disabled={disabled}
        />
      </div>
    </>
  );
}
