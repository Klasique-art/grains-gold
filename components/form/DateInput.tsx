import { CalendarDays } from "lucide-react";
import type { DateInputProps } from "@/types/form.types";

const DateInput = ({
  name,
  label,
  labelClassName,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  min,
  max,
  errorId,
  isInvalid = false,
}: DateInputProps) => {
  const inputId = `date-${name}`;
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
        <input
          type="date"
          id={inputId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          disabled={disabled}
          aria-required={required}
          aria-invalid={isInvalid}
          aria-describedby={errorId}
          className={`h-12 w-full rounded-xl border bg-white py-2 pl-12 pr-4 text-sm text-primary transition outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${borderClasses}`}
        />
        <CalendarDays
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default DateInput;
