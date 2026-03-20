"use client";

import { useFormikContext } from "formik";
import type { ButtonHTMLAttributes } from "react";

type Props = {
  title: string;
  forceEnable?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

const SubmitButton = ({ title, forceEnable = false, className = "", ...props }: Props) => {
  const { isValid, dirty, isSubmitting } = useFormikContext();

  const isDisabled = !(isValid && (dirty || forceEnable)) || isSubmitting;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={isSubmitting}
      aria-disabled={isDisabled}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-primary bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 disabled:cursor-not-allowed disabled:opacity-55 ${className}`.trim()}
      {...props}
    >
      {isSubmitting ? "Submitting..." : title}
    </button>
  );
};

export default SubmitButton;
