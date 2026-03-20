"use client";

import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isHighContrast?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isHighContrast = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <button
        type="button"
        aria-label="Close confirmation modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div
        className={`relative w-full max-w-md rounded-2xl border p-5 shadow-2xl ${
          isHighContrast ? "border-black bg-white text-black" : "border-secondary/30 bg-white text-primary"
        }`}
      >
        <h2 id="confirm-modal-title" className="text-xl font-black">
          {title}
        </h2>
        <p className={`mt-2 text-sm ${isHighContrast ? "text-black/85" : "text-primary/80"}`}>{description}</p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isHighContrast
                ? "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black"
                : "border-secondary/35 text-primary hover:bg-accent/20 focus-visible:outline-accent-2"
            }`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isHighContrast
                ? "border-black bg-black text-white hover:bg-white hover:text-black focus-visible:outline-black"
                : "border-primary bg-primary text-white hover:bg-secondary focus-visible:outline-accent-2"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
