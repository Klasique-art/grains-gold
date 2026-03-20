interface FormLoaderProps {
  visible: boolean;
  message?: string;
}

const FormLoader = ({ visible, message = "Processing your request..." }: FormLoaderProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-secondary/25 bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-accent/40" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-secondary" />
            <div className="absolute inset-[18px] animate-pulse rounded-full bg-accent-2/80" />
          </div>

          <div className="space-y-1.5">
            <p id="loading-message" className="text-base font-bold text-primary">
              {message}
            </p>
            <p className="text-sm text-secondary">Please hold on while we complete this step.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLoader;
