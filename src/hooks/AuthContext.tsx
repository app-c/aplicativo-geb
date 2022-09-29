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
import { IProfileDto, IUserDtos } from '../dtos';
import { api } from '../services/api';

export interface User {
   user: IUserDtos;
   profile: IProfileDto;
}

type AuthState = {
   token: string;
   user: User;
};

interface SignInCred {
   membro: string;
   senha: string;
}

interface AuthContexData {
   user: User | null;
   expoToken: string;
   loading: boolean;
   signIn(credential: SignInCred): Promise<void>;
   signOut(): void;
   updateUser(user: IUserDtos): Promise<void>;
}

const keyUser = '@appGeb:user';
const keyToken = '@appGeb:token';
const User_Collection = '@Geb:user';

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState<AuthState>({} as AuthState);

   const [expoToken, setExpotoken] = React.useState('');

   const LoadingUser = useCallback(async () => {
      setLoading(true);

      const [token, user] = await AsyncStorage.multiGet([keyToken, keyUser]);

      if (token && user) {
         setData({ token: token[1], user: JSON.parse(user[1]) });
      }
      setLoading(false);
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

            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            await api.get('/user/list-all-user').then(p => {
               const rs = p.data;
               const res = rs.find(t => t.user.id === user.id);

               const us = {
                  user,
                  profile: res.profile,
               };

               setData({ token, user: us });
            });
         })
         .catch(h => console.log('erro', h.response.data.message));
   }, []);

   useEffect(() => {
      setLoading(true);
   }, []);

   const signOut = useCallback(async () => {
      await AsyncStorage.multiRemove([keyToken, keyUser]);
      await AsyncStorage.removeItem(User_Collection);

      setData({} as AuthState);
   }, []);

   const updateUser = useCallback(async (user: IUserDtos) => {
      await AsyncStorage.setItem(keyUser, JSON.stringify(user));

      // setData(user);
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
            user: data.user,
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
