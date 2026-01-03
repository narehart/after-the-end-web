 
import { forwardRef, type ComponentPropsWithRef } from 'react';

type InputProps = ComponentPropsWithRef<'input'>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

Input.displayName = 'Input';

export default Input;
