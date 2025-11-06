const baseClasses =
  "w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition";

export default function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={[baseClasses, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
