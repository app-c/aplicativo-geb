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

import * as Notifications from 'expo-notifications';
import auth from '@react-native-firebase/auth';
import fire from '@react-native-firebase/firestore';
import { api } from '../services/api';
import { IUserDtos } from '../dtos';
import { colecao } from '../collection';
import { OldUserProps } from '../components/new';

type AuthState = {
   token: string;
   user: IUserDtos;
};

interface SignInCred {
   membro: string;
   senha: string;
}

interface SignInCredOld {
   email: string;
   senha: string;
}

interface AuthContexData {
   user: IUserDtos | null;
   oldUser: OldUserProps;
   firstLogin: boolean;
   expoToken: string;
   loading: boolean;
   oldSignIn: (data: SignInCredOld) => Promise<void>;
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
   const [oldUser, setOldUser] = React.useState<OldUserProps>();
   const [firstLogin, setFirstLogin] = React.useState(true);

   const [expoToken, setExpotoken] = React.useState('');

   const LoadingUser = useCallback(async () => {
      setLoading(true);
      // await AsyncStorage.removeItem('first-login');

      const dat = await AsyncStorage.getItem('old_user');
      const first = await AsyncStorage.getItem('first-login');

      const ft = first ? JSON.parse(first) : true;
      setFirstLogin(ft);
      if (dat) {
         setOldUser(JSON.parse(dat));
      }

      const [token, user] = await AsyncStorage.multiGet([
         keyToken,
         keyUser,
         'old_user',
      ]);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      if (token && user)
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
            console.log('erro', h.response.data.message);
            Alert.alert('Erro ao entrar na sua conta', h.response.message);
         });
   }, []);

   const oldSignIn = useCallback(async ({ email, senha }) => {
      await auth()
         .signInWithEmailAndPassword(email, senha)
         .then(au => {
            fire()
               .collection(colecao.users)
               .doc(au.user.uid)
               .get()
               .then(async profile => {
                  const {
                     nome,
                     adm,
                     padrinhQuantity,
                     whats,
                     workName,
                     CNPJ,
                     ramo,
                     enquadramento,
                     links,
                     CPF,
                     avatarUrl,
                     logoUrl,
                     indicacao,
                     presenca,
                     inativo,
                     token,
                     apadrinhado,
                  } = profile.data();

                  if (profile.exists) {
                     const userData = {
                        email: au.user.email,
                        id: au.user.uid,
                        nome,
                        adm,
                        whats,
                        workName,
                        CNPJ,
                        CPF,
                        ramo,
                        enquadramento,
                        links,
                        padrinhQuantity,
                        avatarUrl,
                        logoUrl,
                        indicacao,
                        presenca,
                        inativo,
                        token,
                        apadrinhado,
                     };

                     await AsyncStorage.setItem(
                        'old_user',
                        JSON.stringify(userData),
                     );

                     const firt = true;

                     await AsyncStorage.setItem(
                        'first-login',
                        JSON.stringify(firt),
                     );
                     setFirstLogin(firt);
                     setOldUser(userData);
                  }
               })
               .catch(err => {
                  const { code } = err;
                  Alert.alert(
                     'Login',
                     'Não foi possível carregar os dados do usuário',
                  );
               });
         });
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
            oldSignIn,
            oldUser,
            firstLogin,
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
