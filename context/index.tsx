// React
import React, { FC, SetStateAction, useState } from 'react';

// Types
import { Student } from '../types/customTypes';

interface InitialBlockContext {
  students: Student[];
  setStudents: React.Dispatch<SetStateAction<Student[]>>;
}

const defaultContext = {
  students: [], // need to fix
  setStudents: () => {},
};

export const AppContext = React.createContext<InitialBlockContext>(defaultContext);

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(defaultContext.students);

  return (
    <AppContext.Provider
      value={{
        students,
        setStudents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
