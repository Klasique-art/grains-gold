import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { TextInputProps } from "@/types/form.types";

const baseInputClasses =
  "w-full rounded-xl border bg-white px-4 text-sm text-primary transition outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const TextInput = ({
  icon,
  name,
  label,
  labelClassName,
  value,
  onChange,
  onBlur,
  placeholder,
  multiline = false,
  rows = 4,
  iconAria,
  iconClick,
  required = false,
  disabled = false,
  type = "text",
  errorId,
  isInvalid = false,
  helperText,
  ...otherProps
}: TextInputProps) => {
  const inputId = `input-${name}`;

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

      {!multiline ? (
        <div className="relative w-full">
          <input
            id={inputId}
            type={type}
            name={name}
            value={value ?? ""}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            aria-required={required}
            aria-invalid={isInvalid}
            aria-describedby={errorId}
            className={`${baseInputClasses} h-12 ${icon ? "pr-12" : "pr-4"} ${borderClasses}`}
            {...(otherProps as InputHTMLAttributes<HTMLInputElement>)}
          />
          {icon && (
            <button
              type="button"
              className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-primary/65 transition-colors hover:text-primary"
              aria-label={iconAria ?? "Toggle input visibility"}
              onClick={iconClick}
              disabled={disabled}
            >
              {icon === "eye" ? (
                <Eye className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      ) : (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-required={required}
          aria-invalid={isInvalid}
          aria-describedby={errorId}
          className={`${baseInputClasses} min-h-28 py-3 resize-y ${borderClasses}`}
          {...(otherProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      )}

      {helperText ? <p className="mt-2 text-xs text-secondary">{helperText}</p> : null}
    </div>
  );
};

export default TextInput;
