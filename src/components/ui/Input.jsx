const baseInputClasses =
  "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500";
const baseContainerClasses = "mb-4";
const baseLabelClasses = "block text-sm font-medium mb-1";

export default function Input({
  label,
  className = "",
  containerClassName = "",
  labelClassName = "",
  ...props
}) {
  return (
    <div className={[baseContainerClasses, containerClassName].filter(Boolean).join(" ")}>
      {label && (
        <label className={[baseLabelClasses, labelClassName].filter(Boolean).join(" ")}>
          {label}
        </label>
      )}
      <input
        className={[baseInputClasses, className].filter(Boolean).join(" ")}
        {...props}
      />
    </div>
  );
}
