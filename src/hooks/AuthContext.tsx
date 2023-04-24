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

import { IUserDtos } from '../dtos';
import { api } from '../services/api';

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
      await AsyncStorage.removeItem('first');

      const [token, user] = await AsyncStorage.multiGet([keyToken, keyUser]);
      api.defaults.headers.common.Authorization = `Bearer ${token[1]}`;

      if (token[1] && user[1])
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
            const { token } = h.data;
            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            await api
               .get('/user/find-user-by-id')
               .then(async h => {
                  const user = h.data;
                  console.log(user, 'ld ok ko');
                  setData({ token, user });

                  await AsyncStorage.multiSet([
                     [keyToken, token],
                     [keyUser, JSON.stringify(user)],
                  ]);
               })
               .catch(h =>
                  console.log('err ao encontrar usuario no hook de signIn', h),
               );
         })
         .catch(h => {
            console.log('erro', h);
            Alert.alert('Erro ao entrar na sua conta', h.response.data.message);
         });
   }, []);

   const signOut = useCallback(async () => {
      await AsyncStorage.multiRemove([keyToken, keyUser]);
      await AsyncStorage.removeItem(User_Collection);

      setData({} as AuthState);
   }, []);

   const updateUser = useCallback(
      async (user: IUserDtos) => {
         await AsyncStorage.setItem(keyUser, JSON.stringify(user));

         const dados = {
            token: data.token,
            user,
         };

         setData(dados);
      },
      [data.token],
   );

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
