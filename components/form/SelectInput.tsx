import { ChevronDown } from "lucide-react";
import type { SelectInputProps } from "@/types/form.types";

const SelectInput = ({
  name,
  label,
  labelClassName,
  value,
  onChange,
  onBlur,
  options,
  required = false,
  disabled = false,
  placeholder,
  errorId,
  isInvalid = false,
}: SelectInputProps) => {
  const inputId = `select-${name}`;
  const borderClasses = isInvalid
    ? "border-red-600 focus-visible:outline-red-600"
    : "border-secondary/35 hover:border-secondary/60";

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={`mb-2 block text-sm font-semibold ${labelClassName ?? "text-primary"}`}
      >
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <select
          id={inputId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-required={required}
          aria-invalid={isInvalid}
          aria-describedby={errorId}
          className={`h-12 w-full cursor-pointer appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-primary transition outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${borderClasses}`}
        >
          <option value="" disabled>
            {placeholder || `Select ${label}`}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default SelectInput;
