import type {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export type FormFieldOption = {
  value: string;
  label: string;
  metadata?: Record<string, unknown>;
};

export type TextInputProps = {
  name: string;
  label: string;
  labelClassName?: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  icon?: "eye" | "eye-slash";
  iconAria?: string;
  iconClick?: () => void;
  errorId?: string;
  isInvalid?: boolean;
  helperText?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange" | "onBlur" | "type"> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "value" | "onChange" | "onBlur">;

export type SelectInputProps = {
  name: string;
  label: string;
  labelClassName?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  options: FormFieldOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  errorId?: string;
  isInvalid?: boolean;
};

export type DateInputProps = {
  name: string;
  label: string;
  labelClassName?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  errorId?: string;
  isInvalid?: boolean;
};
