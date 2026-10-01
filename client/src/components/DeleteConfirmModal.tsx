import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-6 border border-white/25 shadow-2xl relative bg-black">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-[#A1A1AA] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-secondary px-4 py-2 text-sm font-medium focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-danger px-4 py-2 text-sm font-semibold flex items-center gap-2 focus:outline-none disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
