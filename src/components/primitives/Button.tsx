import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));

Button.displayName = 'Button';

export default Button;
