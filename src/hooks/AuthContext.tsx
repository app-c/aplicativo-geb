/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';

import { format } from 'date-fns';
import { boolean } from 'yup';
import * as Notifications from 'expo-notifications';
import {
   IOrderB2b,
   IOrderIndication,
   IOrderTransaction,
   ITransaction,
   IUserDtos,
} from '../dtos';
import { colecao } from '../collection';
import { api } from '../services/api';

export interface User {
   id: string;
   nome: string;
   adm: boolean;
   padrinhQuantity: number;
}

type AuthState = {
   token: string;
   user: IUserDtos;
};

interface SignInCred {
   membro: string;
   senha: string;
}

interface AuthContexData {
   user: IUserDtos | null;
   expoToken: string;
   loading: boolean;
   signIn(credential: SignInCred): Promise<void>;
   signOut(): void;
   updateUser(user: IUserDto): Promise<void>;
}

const keyUser = '@appGeb:user';
const keyToken = '@appGeb:token';

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<AuthState | null>(() => {});

   const [token, setToekn] = React.useState(null);

   const [expoToken, setExpotoken] = React.useState('');

   const LoadingUser = useCallback(async () => {
      setLoading(true);

      const [token, user] = await AsyncStorage.multiGet([keyToken, keyUser]);

      if (token && user) {
         setUser({ token: token[1], user: JSON.parse(user[1]) });
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      LoadingUser();
   }, [LoadingUser]);

   const signIn = useCallback(async ({ membro, senha }) => {
      await api
         .post('/user/session', {
            membro,
            senha,
         })
         .then(async h => {
            const { user, token } = h.data;

            await AsyncStorage.multiSet([
               [keyToken, token],
               [keyUser, JSON.stringify(user)],
            ]);

            setUser({ token, user });
            console.log(user);
         })
         .catch(h => console.log('erro', h.response.data.message));
   }, []);

   useEffect(() => {
      setLoading(true);
   }, []);

   const signOut = useCallback(async () => {
      await AsyncStorage.multiRemove([keyUser, keyToken]);
      await AsyncStorage.removeItem('@Geb:user');

      setUser(null);
   }, []);

   const updateUser = useCallback(async (user: IUserDtos) => {
      await AsyncStorage.setItem(keyUser, JSON.stringify(user));

      setUser(user);
   }, []);

   const Token = React.useCallback(async () => {
      const { status: existingStatus } =
         await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== 'granted') {
         Alert.alert('Failed to get push token for push notification!');
         return;
      }
      const token = (
         await Notifications.getExpoPushTokenAsync({
            experienceId: '@app-c/aplicativogeb',
         })
      ).data;

      if (Platform.OS === 'android') {
         Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
         });
      }

      setExpotoken(token);
   }, []);

   React.useEffect(() => {
      Token();

      return () => Token();
   }, [Token]);

   return (
      <AuthContext.Provider
         value={{
            user,
            loading,
            signIn,
            signOut,
            updateUser,
            expoToken,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export function useAuth(): AuthContexData {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error('useAuth must be used with ..');
   }

   return context;
}
