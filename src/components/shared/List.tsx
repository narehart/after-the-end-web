import type { ReactNode } from 'react';
import getListItemKey from '../../utils/getListItemKey';
import { Box } from './index';

interface ListProps<TItem> {
  dataSource: TItem[];
  renderItem: (item: TItem, index: number) => ReactNode;
  rowKey?: keyof TItem | ((item: TItem) => string);
  role?: 'list' | 'listbox' | 'menu';
  className?: string;
}

export default function List<TItem>({
  dataSource,
  renderItem,
  rowKey,
  role = 'list',
  className,
}: ListProps<TItem>): React.JSX.Element {
  return (
    <Box role={role} className={className}>
      {dataSource.map((item, index) => (
        <Box key={getListItemKey(item, index, rowKey)}>{renderItem(item, index)}</Box>
      ))}
    </Box>
  );
}
