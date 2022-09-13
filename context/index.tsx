// React
import React, { FC, SetStateAction, useState } from 'react';

// Types
import { Student, UserInfo } from '../types/customTypes';

interface InitialBlockContext {
  students: Student[];
  setStudents: React.Dispatch<SetStateAction<Student[]>>;
  hasFetchedStudents: boolean;
  setHasFetchedStudents: React.Dispatch<SetStateAction<boolean>>;
  loadingText: string;
  setLoadingText: React.Dispatch<SetStateAction<string>>;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<SetStateAction<UserInfo>>;
  hasFetchedUserInfo: boolean;
  setHasFetchedUserInfo: React.Dispatch<SetStateAction<boolean>>;
}

const defaultContext = {
  students: [], // need to fix
  setStudents: () => {},
  hasFetchedStudents: false,
  setHasFetchedStudents: () => {},
  loadingText: '',
  setLoadingText: () => {},
  userInfo: { name: '', venmoUsername: '', paypalUsername: '', zelle: '' },
  setUserInfo: () => {},
  hasFetchedUserInfo: false,
  setHasFetchedUserInfo: () => {},
};

export const AppContext = React.createContext<InitialBlockContext>(defaultContext);

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(defaultContext.students);
  const [hasFetchedStudents, setHasFetchedStudents] = useState(defaultContext.hasFetchedStudents);
  const [loadingText, setLoadingText] = useState(defaultContext.loadingText);
  const [userInfo, setUserInfo] = useState(defaultContext.userInfo);
  const [hasFetchedUserInfo, setHasFetchedUserInfo] = useState(defaultContext.hasFetchedUserInfo);

  return (
    <AppContext.Provider
      value={{
        students,
        setStudents,
        hasFetchedStudents,
        setHasFetchedStudents,
        loadingText,
        setLoadingText,
        userInfo,
        setUserInfo,
        hasFetchedUserInfo,
        setHasFetchedUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
