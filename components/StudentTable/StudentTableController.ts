// Types
import { Student, Order, TableHeaderId } from '../../types/customTypes';

export const sortStudents = (studentData: Student[], order: Order, orderBy: TableHeaderId) => {
  if (!order) {
    return [...studentData];
  }

  return [...studentData].sort((a, b) => {
    const value1: string | number = a[orderBy];
    const value2: string | number = b[orderBy];

    if (typeof value1 === 'string' && typeof value2 === 'string') {
      if (order === 'asc') return value1.localeCompare(value2);
      else return value2.localeCompare(value1);
    }

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      if (order === 'asc') return value1 - value2;
      else return value2 - value1;
    }

    return 0;
  });
};
