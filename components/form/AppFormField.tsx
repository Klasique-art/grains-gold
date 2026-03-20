"use client";

import { useFormikContext } from "formik";
import type { ComponentPropsWithoutRef } from "react";
import type { FormFieldOption } from "@/types/form.types";
import AppErrorMessage from "./AppErrorMessage";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

type StringFieldFormValues = Record<string, string>;

type Props<Values extends StringFieldFormValues = StringFieldFormValues> = {
  name: keyof Values & string;
  label: string;
  multiline?: boolean;
  rows?: number;
  styles?: string;
  options?: FormFieldOption[];
  labelClassName?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "select"
    | "date";
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
} & Omit<
  ComponentPropsWithoutRef<typeof TextInput>,
  "name" | "label" | "value" | "onChange" | "onBlur" | "required" | "disabled" | "type"
>;

const AppFormField = <Values extends StringFieldFormValues = StringFieldFormValues>({
  name,
  label,
  multiline = false,
  rows = 4,
  styles,
  options = [],
  labelClassName,
  type = "text",
  required = false,
  disabled = false,
  placeholder,
  min,
  max,
  ...props
}: Props<Values>) => {
  const { errors, setFieldTouched, handleChange, touched, values } = useFormikContext<Values>();

  const error = (errors[name] as string | undefined) ?? "";
  const isTouched = Boolean(touched[name]);
  const currentValue = (values[name] as string | undefined) ?? "";
  const errorId = `${name}-error`;
  const isInvalid = Boolean(error && isTouched);

  return (
    <div className={`flex w-full flex-col gap-1 ${styles ?? ""}`.trim()}>
      {type === "select" ? (
        <SelectInput
          name={name}
          label={label}
          labelClassName={labelClassName}
          value={currentValue}
          onChange={handleChange(name)}
          onBlur={() => {
            void setFieldTouched(name, true, true);
          }}
          options={options}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          errorId={errorId}
          isInvalid={isInvalid}
        />
      ) : type === "date" ? (
        <DateInput
          name={name}
          label={label}
          labelClassName={labelClassName}
          value={currentValue}
          onChange={handleChange(name)}
          onBlur={() => {
            void setFieldTouched(name, true, true);
          }}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          errorId={errorId}
          isInvalid={isInvalid}
        />
      ) : (
        <TextInput
          type={type}
          name={name}
          label={label}
          labelClassName={labelClassName}
          multiline={multiline}
          rows={rows}
          onBlur={() => {
            void setFieldTouched(name, true, true);
          }}
          onChange={handleChange(name)}
          value={currentValue}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          errorId={errorId}
          isInvalid={isInvalid}
          {...props}
        />
      )}
      <AppErrorMessage id={errorId} error={error} visible={isTouched} />
    </div>
  );
};

export default AppFormField;
