import classNames from 'classnames/bind';
import { SLOT_LABELS, SLOT_ICONS, SLOT_DESCRIPTIONS } from '../constants/slots';
import type { SlotType } from '../types/inventory';
import { Box, Flex, Panel, Text } from './primitives';
import styles from './EmptySlotDetails.module.css';

const cx = classNames.bind(styles);

interface EmptySlotDetailsProps {
  slotId: SlotType;
}

export default function EmptySlotDetails({ slotId }: EmptySlotDetailsProps): React.JSX.Element {
  return (
    <Panel
      border="top"
      className={cx('details-panel')}
      contentClassName={cx('details-content', 'empty-slot')}
      contentJustify="center"
      contentAlign="center"
      contentGap="12"
    >
      <Box className={cx('item-preview')}>
        <Flex justify="center" align="center" className={cx('preview-frame', 'empty')}>
          <Text className={cx('preview-icon')}>{SLOT_ICONS[slotId]}</Text>
        </Flex>
      </Box>
      <Box className={cx('item-info')}>
        <Text as="h2" className={cx('item-name')}>
          {SLOT_LABELS[slotId]}
        </Text>
        <Text as="p" className={cx('item-type')}>
          EMPTY SLOT
        </Text>
        <Text as="p" className={cx('item-description')}>
          {SLOT_DESCRIPTIONS[slotId]}
        </Text>
      </Box>
      <Box className={cx('details-hint')}>
        <Text>Equip an item to fill this slot</Text>
      </Box>
    </Panel>
  );
}
