"use client";

import { useEffect, useRef } from "react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title,
}: DeleteConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-b1/60 bg-transparent p-0 rounded-[16px] max-w-[400px] w-full"
    >
      <div className="bg-b8 border border-b6 rounded-[16px] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-montserrat font-semibold text-[0.95rem] text-b1">
              Delete listing
            </h3>
            <p className="text-[0.78rem] text-b4 font-montserrat">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-[0.84rem] text-b3 font-light mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-b1">&ldquo;{title}&rdquo;</span>?
          All associated images and data will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-b6 rounded-[10px] text-[0.82rem] font-montserrat font-medium text-b4 hover:border-b4 transition-colors disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-b8 rounded-[10px] text-[0.82rem] font-montserrat font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
