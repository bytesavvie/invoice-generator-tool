// React
import React, { FC, SetStateAction, useState } from 'react';

// Types
import { Student } from '../types/customTypes';

interface InitialBlockContext {
  students: Student[];
  setStudents: React.Dispatch<SetStateAction<Student[]>>;
  hasFetchedStudents: boolean;
  setHasFetchedStudents: React.Dispatch<SetStateAction<boolean>>;
  loadingText: string;
  setLoadingText: React.Dispatch<SetStateAction<string>>;
}

const defaultContext = {
  students: [], // need to fix
  setStudents: () => {},
  hasFetchedStudents: false,
  setHasFetchedStudents: () => {},
  loadingText: '',
  setLoadingText: () => {},
};

export const AppContext = React.createContext<InitialBlockContext>(defaultContext);

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(defaultContext.students);
  const [hasFetchedStudents, setHasFetchedStudents] = useState(defaultContext.hasFetchedStudents);
  const [loadingText, setLoadingText] = useState(defaultContext.loadingText);

  return (
    <AppContext.Provider
      value={{
        students,
        setStudents,
        hasFetchedStudents,
        setHasFetchedStudents,
        loadingText,
        setLoadingText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
