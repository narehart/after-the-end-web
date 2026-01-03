import classNames from 'classnames/bind';
import type { IconSize } from '../../types/ui';
import styles from './Icon.module.css';
import Image from './Image';

const cx = classNames.bind(styles);

interface IconProps {
  src: string;
  alt?: string | undefined;
  size?: IconSize | undefined;
  className?: string | undefined;
}

export default function Icon({
  src,
  alt = '',
  size = 'md',
  className,
}: IconProps): React.JSX.Element {
  const sizeClass = typeof size === 'number' ? undefined : `icon--${size}`;
  const customStyle = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      className={
        className !== undefined ? `${cx('icon', sizeClass)} ${className}` : cx('icon', sizeClass)
      }
      style={customStyle}
    />
  );
}
