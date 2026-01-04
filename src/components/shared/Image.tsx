import { forwardRef, type ComponentPropsWithRef } from 'react';

interface ImageProps extends ComponentPropsWithRef<'img'> {
  alt: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(({ alt, ...props }, ref) => (
  <img ref={ref} alt={alt} {...props} />
));

Image.displayName = 'Image';

export default Image;
