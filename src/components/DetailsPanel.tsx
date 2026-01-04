import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import { buildStatsLine } from '../utils/buildStatsLine';
import { getItemIcon } from '../utils/getItemIcon';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import { getMainImage } from '../utils/getMainImage';
import EmptySlotDetails from './EmptySlotDetails';
import { Box, Flex, Text, Panel, Icon } from './primitives';
import styles from './DetailsPanel.module.css';

const cx = classNames.bind(styles);

export default function DetailsPanel(): React.JSX.Element {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusedEmptySlot = useInventoryStore((state) => state.focusedEmptySlot);
  const items = useInventoryStore((state) => state.items);

  const item = selectedItemId !== null ? (items[selectedItemId] ?? null) : null;

  if (item === null && focusedEmptySlot !== null) {
    return <EmptySlotDetails slotId={focusedEmptySlot} />;
  }

  return (
    <Panel
      border="top"
      className={cx('details-panel')}
      contentClassName={cx('details-content')}
      contentAlign="start"
      contentGap="12"
      emptyMessage="Select an item to view details"
    >
      {item !== null ? (
        <>
          <Box className={cx('item-preview')}>
            <Flex justify="center" align="center" className={cx('preview-frame')}>
              {getMainImage({ allImages: item.allImages }) !== '' ? (
                <Icon
                  src={getItemImageUrl({ allImages: item.allImages })}
                  alt={item.name}
                  size="fill"
                  pixelated
                  className={cx('preview-image')}
                />
              ) : (
                <Text size="lg">{getItemIcon({ type: item.type })}</Text>
              )}
            </Flex>
          </Box>

          <Box className={cx('item-info')}>
            <Text as="h2" size="base" strong ellipsis className={cx('item-name')}>
              {item.description}
            </Text>
            <Text as="p" type="secondary" code ellipsis size="sm" className={cx('item-stats-line')}>
              {buildStatsLine({ item })}
            </Text>
            <Text as="p" type="muted" size="base" className={cx('item-flavor-text')}>
              {item.flavorText ?? `A scavenged ${item.type} from the Florida wasteland.`}
            </Text>
          </Box>
        </>
      ) : null}
    </Panel>
  );
}
