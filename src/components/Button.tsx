import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { ButtonVariant } from '../types/ui';
import styles from './Button.module.css';

const cx = classNames.bind(styles);

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  children?: ReactNode;
  variant?: ButtonVariant | undefined;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const buttonClass = cx('button', `button--${variant}`);
    const fullClassName = className !== undefined ? `${buttonClass} ${className}` : buttonClass;

    return (
      <button ref={ref} className={fullClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
