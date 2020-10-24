import React, {memo, useCallback, useContext, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Web3 from 'web3';

const AuthContext = React.createContext({
  userData: null as null | UserData,
  setUserData: (() => {}) as (firstName: string, lastName: string) => void,
});

interface Props {
  children: React.ReactNode;
  userData?: UserData;
}

interface UserData {
  firstName?: string;
  lastName?: string;
}

const USER_KEY_PATH = 'user';

function AuthProvider({children, userData}: Props) {
  const [userDataState, setUserDataState] = useState(userData);

  const setUserData = useCallback((firstName: string, lastName: string) => {
    setUserDataState({
      firstName,
      lastName,
    });
  }, []);

  const value = {
    userData: userDataState,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default memo(AuthProvider);

export const usePersistedUserData = () => {
  const [userData, setUserData] = useState<UserData>();
  const [loaded, setLoaded] = useState(false);
  AsyncStorage.getItem(USER_KEY_PATH).then(userDataJson => {
    if (userDataJson) {
      setUserData(JSON.parse(userDataJson));
    }

    setLoaded(true);
  });

  return [loaded, userData] as const;
};
