export default function Button({ children, ...props }) {
  return (
    <button
      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      {...props}
    >
      {children}
    </button>
  );
}
