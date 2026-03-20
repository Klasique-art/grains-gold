import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  title?: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  ariaLabel?: string;
}

interface LinkProps extends BaseProps {
  url: string;
  type?: never;
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
}

interface NativeButtonProps extends BaseProps {
  url?: never;
  type?: "button" | "submit" | "reset";
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

type AppButtonProps =
  | (LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "className" | "children">)
  | (NativeButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "children">);

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-primary bg-primary text-white hover:bg-secondary focus-visible:outline-accent-2 disabled:border-primary/40 disabled:bg-primary/40",
  secondary:
    "border border-secondary bg-secondary text-white hover:bg-primary focus-visible:outline-accent-2 disabled:border-secondary/40 disabled:bg-secondary/40",
  outline:
    "border border-secondary/45 bg-white text-primary hover:bg-accent/20 focus-visible:outline-accent-2 disabled:border-secondary/25 disabled:text-primary/55",
  ghost:
    "border border-transparent bg-transparent text-primary hover:bg-accent/20 focus-visible:outline-accent-2 disabled:text-primary/55",
  danger:
    "border border-red-700 bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-700 disabled:border-red-400 disabled:bg-red-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-9 px-3 py-2 text-xs",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-sm",
};

const AppButton = ({
  url,
  title = "Button",
  type = "button",
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  ariaLabel,
  ...props
}: AppButtonProps) => {
  const baseClassName = [
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-70",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "w-auto",
    className,
  ]
    .join(" ")
    .trim();

  const content = (
    <>
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : icon && iconPosition === "left" ? (
        <span className="shrink-0">{icon}</span>
      ) : null}

      <span>{loading ? "Loading..." : title}</span>

      {!loading && icon && iconPosition === "right" ? <span className="shrink-0">{icon}</span> : null}
    </>
  );

  if (url) {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <Link
        href={url}
        className={baseClassName}
        aria-label={ariaLabel ?? title}
        aria-busy={loading}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={type}
      className={baseClassName}
      disabled={loading || buttonProps.disabled}
      aria-label={ariaLabel ?? title}
      aria-busy={loading}
      {...buttonProps}
    >
      {content}
    </button>
  );
};

export default AppButton;
