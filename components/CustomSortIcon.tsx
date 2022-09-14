// React
import { FC } from 'react';

// MUI
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

// Types
import { Order, TableHeaderId } from '../types/customTypes';

interface IProps {
  columnHeaderId: TableHeaderId;
  columnName: string;
  order: Order;
  orderBy: string;
}

const TableHeaderSortIcon: FC<IProps> = ({ columnHeaderId, columnName, order, orderBy }) => {
  return (
    <TableSortLabel active={orderBy === columnHeaderId && order !== undefined} direction={order}>
      {columnName}
      {orderBy === 'name' ? (
        <Box component="span" sx={visuallyHidden}>
          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
        </Box>
      ) : null}
    </TableSortLabel>
  );
};

export default TableHeaderSortIcon;
