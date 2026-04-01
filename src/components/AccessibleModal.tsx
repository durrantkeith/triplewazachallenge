/**
 * Accessible Modal Component
 *
 * Reusable modal with proper focus management and keyboard handling.
 * Use this for upload forms, confirmation dialogs, etc.
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createFocusTrap, isEscapeKey } from '../utils/keyboardHelpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlayClick = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Set up focus trap
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const cleanup = createFocusTrap(modalElement);

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (isEscapeKey(e)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      cleanup();
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';

      // Restore focus to previous element
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 id="modal-title" className="text-2xl font-bold text-slate-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * Usage example:
 *
 * const [isModalOpen, setIsModalOpen] = useState(false);
 *
 * <AccessibleModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Upload Educational Video"
 * >
 *   <form>
 *     ...form fields...
 *   </form>
 * </AccessibleModal>
 */
