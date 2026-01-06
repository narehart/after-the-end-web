/* eslint-disable local/types-in-types-directory -- Component-specific prop types */
import classNames from 'classnames/bind';
import styles from './Icon.module.css';
import Image from './Image';

type IconSize = 'sm' | 'md' | 'lg' | 'fill' | number;

const cx = classNames.bind(styles);

interface IconProps {
  src: string;
  alt?: string | undefined;
  size?: IconSize | undefined;
  pixelated?: boolean | undefined;
  className?: string | undefined;
}

export default function Icon({
  src,
  alt = '',
  size = 'md',
  pixelated,
  className,
}: IconProps): React.JSX.Element {
  const sizeClass = typeof size === 'number' ? undefined : `icon--${size}`;
  const customStyle = typeof size === 'number' ? { width: size, height: size } : undefined;

  const iconClass = cx('icon', sizeClass, { 'icon--pixelated': pixelated === true });
  const fullClassName = className !== undefined ? `${iconClass} ${className}` : iconClass;

  return <Image src={src} alt={alt} className={fullClassName} style={customStyle} />;
}
