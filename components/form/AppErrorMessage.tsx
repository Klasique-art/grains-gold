import { AlertCircle } from "lucide-react";

type Props = {
  id?: string;
  error?: string;
  visible?: boolean;
};

const AppErrorMessage = ({ id, error, visible }: Props) => {
  if (!error || !visible) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-1 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{error}</span>
    </p>
  );
};

export default AppErrorMessage;
