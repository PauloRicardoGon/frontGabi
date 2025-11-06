const VARIANT_STYLES = {
  error: {
    container: "border-red-200 bg-red-50 text-red-700",
    icon: "⚠️",
    iconLabel: "Erro",
    titleClass: "text-red-800",
    descriptionClass: "text-red-700",
    buttonClass:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "⚠️",
    iconLabel: "Aviso",
    titleClass: "text-amber-800",
    descriptionClass: "text-amber-700",
    buttonClass:
      "bg-amber-500 text-white hover:bg-amber-600 focus-visible:outline-amber-500",
  },
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-700",
    icon: "ℹ️",
    iconLabel: "Informação",
    titleClass: "text-blue-800",
    descriptionClass: "text-blue-700",
    buttonClass:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600",
  },
  success: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "✅",
    iconLabel: "Sucesso",
    titleClass: "text-emerald-800",
    descriptionClass: "text-emerald-700",
    buttonClass:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600",
  },
};

const BASE_BUTTON_CLASSES = [
  "mt-4 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
].join(" ");

const resolveVariant = (variant) => VARIANT_STYLES[variant] ?? VARIANT_STYLES.info;

const resolveButtonClasses = (variant) => {
  const variantConfig = resolveVariant(variant);

  return `${BASE_BUTTON_CLASSES} ${variantConfig.buttonClass}`;
};

const shouldAnnounce = (variant) => ["error", "warning"].includes(variant);

const StatusNotice = ({
  variant = "info",
  title,
  description,
  actionLabel,
  onAction,
  children,
}) => {
  const variantConfig = resolveVariant(variant);
  const buttonClasses = resolveButtonClasses(variant);
  const announce = shouldAnnounce(variant);

  return (
    <div
      role={announce ? "alert" : undefined}
      className={`flex items-start gap-3 rounded-lg border p-4 shadow-sm ${variantConfig.container}`}
    >
      <span aria-hidden className="text-xl leading-none pt-0.5">
        {variantConfig.icon}
      </span>
      <div className="flex-1">
        {title && (
          <p className={`font-semibold ${variantConfig.titleClass}`}>{title}</p>
        )}
        {description && (
          <p className={`mt-1 text-sm ${variantConfig.descriptionClass}`}>
            {description}
          </p>
        )}
        {children}
        {actionLabel && onAction && (
          <button type="button" className={buttonClasses} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusNotice;
