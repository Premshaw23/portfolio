"use client";

import { useEffect, useRef } from "react";

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (open && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-55"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onCancel();
        }
      }}
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full text-white shadow-lg">
        <h3 id="confirm-modal-title" className="text-lg font-semibold mb-2">
          {title}
        </h3>
        <p id="confirm-modal-description" className="mb-6 text-gray-300">
          {description}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
