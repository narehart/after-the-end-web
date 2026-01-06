import { useRef } from 'react';
import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../types/inventory';
import type { LinkWithIcon } from '../types/ui';
import { FIRST_INDEX } from '../constants/array';
import useBreadcrumbWidth from '../hooks/useBreadcrumbWidth';
import { buildSegments } from '../utils/breadcrumb';
import styles from './Breadcrumb.module.css';
import { Button, Flex, Icon, Text } from './index';

;

const cx = classNames.bind(styles);

interface BreadcrumbProps {
  links: BreadcrumbLink[];
  icon?: string | undefined;
  clipLinks?: boolean | undefined;
}

export default function Breadcrumb({
  links,
  icon,
  clipLinks,
}: BreadcrumbProps): React.JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);

  const firstLink: LinkWithIcon | undefined = links[FIRST_INDEX];
  const displayIcon = firstLink?.icon ?? icon;
  const segments = buildSegments(links);

  useBreadcrumbWidth(containerRef);

  if (links.length === FIRST_INDEX) return null;

  return (
    <Flex
      ref={containerRef}
      align="center"
      gap="4"
      className={clipLinks === true ? cx('breadcrumb--clip') : undefined}
    >
      {displayIcon !== undefined ? <Icon src={displayIcon} size="md" /> : null}
      {segments.map((seg) => (
        <Flex key={seg.key} align="center">
          <Button
            variant="text"
            className={cx('breadcrumb-link')}
            onClick={seg.onClick}
            disabled={seg.isCurrent === true || seg.onClick === undefined}
          >
            <Text size="base" ellipsis>
              {seg.label}
            </Text>
          </Button>
          {seg.showSeparator === true ? (
            <Text size="base" className={cx('breadcrumb-separator')}>
              ›
            </Text>
          ) : null}
        </Flex>
      ))}
    </Flex>
  );
}
