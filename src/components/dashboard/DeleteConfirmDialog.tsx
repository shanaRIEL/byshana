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
      className="backdrop:bg-ink/60 bg-transparent p-0 max-w-[400px] w-full"
    >
      <div className="bg-white border border-line p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-10 h-10 bg-b1/10 flex items-center justify-center shrink-0">
            <svg
              className="w-4.5 h-4.5 text-b2"
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
            <h3 className="font-playfair text-[1.2rem] text-ink">
              Delete listing
            </h3>
            <p className="text-[0.6rem] tracking-[0.12em] uppercase text-ink/40 font-montserrat font-semibold mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-[0.82rem] text-ink/60 font-light leading-relaxed mb-7">
          Are you sure you want to delete{" "}
          <span className="font-medium text-ink">&ldquo;{title}&rdquo;</span>?
          All associated images and data will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 border border-line text-[0.62rem] font-montserrat font-semibold tracking-[0.14em] uppercase text-ink/55 hover:border-ink/40 hover:text-ink transition-colors disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-b2 text-b8 border border-b2 text-[0.62rem] font-montserrat font-semibold tracking-[0.14em] uppercase hover:bg-transparent hover:text-b2 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
