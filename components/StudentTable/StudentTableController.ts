// Types
import { Student, Order } from '../../types/customTypes';

export const sortStudentsByName = (studentData: Student[], order: Order) => {
  if (order === 'asc') {
    return [...studentData].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (order === 'desc') {
    return [...studentData].sort((a, b) => b.name.localeCompare(a.name));
  }

  return [...studentData];
};

export const sortStudentsByParentName = (studentData: Student[], order: Order) => {
  if (order === 'asc') {
    return [...studentData].sort((a, b) => a.parentName.localeCompare(b.parentName));
  }
  if (order === 'desc') {
    return [...studentData].sort((a, b) => b.parentName.localeCompare(a.parentName));
  }

  return [...studentData];
};
