import React from 'react';

type BottomSheetModalProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
  asForm?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  disableBackdropClose?: boolean;
};

export function BottomSheetModal({
  isOpen,
  title,
  onClose,
  children,
  footer,
  maxWidthClassName = 'max-w-[480px]',
  asForm = false,
  onSubmit,
  disableBackdropClose = false,
}: BottomSheetModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!disableBackdropClose) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-30 bg-black/50 flex items-end"
      onClick={handleBackdropClick}
    >
      {asForm ? (
        <form
          onSubmit={onSubmit}
          className={`w-full ${maxWidthClassName} mx-auto bg-white rounded-t-3xl p-4 transform transition-all duration-200 ease-out`}
          onClick={handleContentClick}
        >
          {title && (
            <div className="font-semibold mb-3">{title}</div>
          )}

          { children }
          { footer }
        </form>
      ) : (
        <div
          className={`w-full ${maxWidthClassName} mx-auto bg-white rounded-t-3xl p-4 transform transition-all duration-200 ease-out`}
          onClick={handleContentClick}
        >
          {title && (
            <div className="font-semibold mb-3">{title}</div>
          )}

          { children }
          { footer }
        </div>
      )}
    </div>
  );
}