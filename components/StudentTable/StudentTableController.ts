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

export const sortStudentsByParentEmail = (studentData: Student[], order: Order) => {
  if (order === 'asc') {
    return [...studentData].sort((a, b) => a.parentEmail.localeCompare(b.parentEmail));
  }
  if (order === 'desc') {
    return [...studentData].sort((a, b) => b.parentEmail.localeCompare(a.parentEmail));
  }

  return [...studentData];
};

export const sortStudentsByParentPhone = (studentData: Student[], order: Order) => {
  if (order === 'asc') {
    return [...studentData].sort((a, b) => {
      const aPhoneNumber = Number(a.parentPhone.replace(/\D/g, ''));
      const bPhoneNumber = Number(b.parentPhone.replace(/\D/g, ''));

      return aPhoneNumber - bPhoneNumber;
    });
  }

  if (order === 'desc') {
    return [...studentData].sort((a, b) => {
      const aPhoneNumber = Number(a.parentPhone.replace(/\D/g, ''));
      const bPhoneNumber = Number(b.parentPhone.replace(/\D/g, ''));

      return bPhoneNumber - aPhoneNumber;
    });
  }

  return [...studentData];
};

export const sortStudentsByLessonAmount = (studentData: Student[], order: Order) => {
  if (order === 'asc') {
    return [...studentData].sort((a, b) => a.lessonAmount - b.lessonAmount);
  }

  if (order === 'desc') {
    return [...studentData].sort((a, b) => b.lessonAmount - a.lessonAmount);
  }

  return [...studentData];
};
