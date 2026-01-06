import { useEffect, useRef, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import { NOT_FOUND_INDEX } from '../constants/primitives';
import styles from './Modal.module.css';
import { Box } from './index';

const cx = classNames.bind(styles);

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  visible,
  onClose,
  children,
  className,
}: ModalProps): React.JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) {
    return null;
  }

  const modalClass = cx('modal');
  const fullClassName = className !== undefined ? `${modalClass} ${className}` : modalClass;

  return (
    <>
      <Box
        className={cx('modal-overlay')}
        onClick={onClose}
        role="button"
        tabIndex={NOT_FOUND_INDEX}
        aria-label="Close modal"
      />
      <Box ref={modalRef} className={fullClassName} tabIndex={NOT_FOUND_INDEX}>
        {children}
      </Box>
    </>
  );
}
