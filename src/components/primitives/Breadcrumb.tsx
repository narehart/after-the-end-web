import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../../types/inventory';
import type { LinkWithIcon } from '../../types/ui';
import { FIRST_INDEX } from '../../constants/numbers';
import { buildSegments } from '../../utils/breadcrumb';
import styles from './Breadcrumb.module.css';
import { Button, Flex, Image, Text } from './index';

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
  if (links.length === FIRST_INDEX) return null;

  const firstLink: LinkWithIcon | undefined = links[FIRST_INDEX];
  const displayIcon = firstLink?.icon ?? icon;
  const segments = buildSegments(links);

  return (
    <Flex
      align="center"
      gap="4"
      className={clipLinks === true ? cx('breadcrumb--clip') : undefined}
    >
      {displayIcon !== undefined ? (
        <Image src={displayIcon} alt="" className={cx('breadcrumb-icon')} />
      ) : null}
      {segments.map((seg) => (
        <Flex key={seg.key} align="center">
          <Button
            className={cx('breadcrumb-link', { current: seg.isCurrent === true })}
            onClick={seg.onClick}
            disabled={seg.isCurrent === true || seg.onClick === undefined}
          >
            {seg.label}
          </Button>
          {seg.showSeparator === true ? (
            <Text className={cx('breadcrumb-separator')}>›</Text>
          ) : null}
        </Flex>
      ))}
    </Flex>
  );
}
