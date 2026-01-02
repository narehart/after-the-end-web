import classNames from 'classnames/bind';
import { SLOT_LABELS } from '../stores/inventoryStore';
import Panel from './Panel';
import styles from './DetailsPanel.module.css';

const cx = classNames.bind(styles);

const SLOT_ICONS = {
  helmet: '⛑',
  eyes: '👓',
  face: '😷',
  neck: '🧣',
  backpack: '🎒',
  coat: '🧥',
  vest: '🦺',
  shirt: '👕',
  rightShoulder: '⬛',
  leftShoulder: '⬛',
  rightGlove: '🧤',
  leftGlove: '🧤',
  rightRing: '💍',
  leftRing: '💍',
  rightHolding: '✋',
  leftHolding: '✋',
  pouch: '👝',
  pants: '👖',
  rightShoe: '👟',
  leftShoe: '👟',
};

const SLOT_DESCRIPTIONS = {
  helmet: 'Protects your head from impacts and environmental hazards.',
  eyes: 'Shields your eyes from debris, bright light, or harmful particles.',
  face: 'Covers your face for protection or filtering air.',
  neck: 'Provides warmth or protection for your neck area.',
  backpack: 'Your main storage for carrying items and supplies.',
  coat: 'Outer layer providing warmth and weather protection.',
  vest: 'Tactical or protective vest worn over clothing.',
  shirt: 'Base layer clothing for your torso.',
  rightShoulder: 'Attachment point for shoulder-mounted gear.',
  leftShoulder: 'Attachment point for shoulder-mounted gear.',
  rightGlove: 'Protects your right hand and improves grip.',
  leftGlove: 'Protects your left hand and improves grip.',
  rightRing: 'Accessory slot for your right hand.',
  leftRing: 'Accessory slot for your left hand.',
  rightHolding: 'What you hold in your right hand.',
  leftHolding: 'What you hold in your left hand.',
  pouch: 'Small container for quick-access items.',
  pants: 'Lower body clothing with potential pocket storage.',
  rightShoe: 'Footwear for your right foot.',
  leftShoe: 'Footwear for your left foot.',
};

export default function EmptySlotDetails({ slotId }) {
  return (
    <Panel border="top" className={cx('details-panel')} contentClassName={cx('details-content', 'empty-slot')}>
      <div className={cx('item-preview')}>
        <div className={cx('preview-frame', 'empty')}>
          <span className={cx('preview-icon')}>{SLOT_ICONS[slotId] || '◻'}</span>
        </div>
      </div>
      <div className={cx('item-info')}>
        <h2 className={cx('item-name')}>{SLOT_LABELS[slotId]}</h2>
        <p className={cx('item-type')}>EMPTY SLOT</p>
        <p className={cx('item-description')}>{SLOT_DESCRIPTIONS[slotId]}</p>
      </div>
      <div className={cx('details-hint')}>
        <span>Equip an item to fill this slot</span>
      </div>
    </Panel>
  );
}
