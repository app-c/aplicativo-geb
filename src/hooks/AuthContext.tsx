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
   IUserDto,
} from '../dtos';
import { colecao } from '../collection';

export interface User {
   id: string;
   nome: string;
   adm: boolean;
   padrinhQuantity: number;
}

interface SignInCred {
   email: string;
   senha: string;
}

interface AuthContexData {
   user: IUserDto | null;
   expoToken: string;
   loading: boolean;
   signIn(credential: SignInCred): Promise<void>;
   transactionAdd: (valor: ITransaction) => void;

   orderB2b: (valor: IOrderB2b) => void;
   orderIndicacao: (valor: IOrderIndication) => void;
   orderTransaction: (valor: IOrderTransaction) => void;
   signOut(): void;
   updateUser(user: IUserDto): Promise<void>;
   listUser: IUserDto[] | null;
}

const User_Collection = '@Geb:user';

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<IUserDto | null>(null);

   const [listUser, setListUser] = useState<IUserDto[]>([]);
   const [expoToken, setExpotoken] = React.useState('');

   const LoadingUser = useCallback(async () => {
      setLoading(true);

      const storeUser = await AsyncStorage.getItem(User_Collection);

      if (storeUser) {
         const userData = JSON.parse(storeUser) as IUserDto;
         setUser(userData);
      }

      setLoading(false);
   }, []);

   useEffect(() => {
      LoadingUser();
   }, [LoadingUser]);

   const signIn = useCallback(async ({ email, senha }) => {
      await Auth()
         .signInWithEmailAndPassword(email, senha)
         .then(au => {
            Firestore()
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
                  } = profile.data() as IUserDto;

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
                     };
                     await AsyncStorage.setItem(
                        User_Collection,
                        JSON.stringify(userData),
                     );
                     setUser(userData);
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

   //* ORDERS.................................................................

   const orderB2b = useCallback(
      async ({ prestador_id, user_id, description, nome }) => {
         if (!description) {
            Alert.alert('Transação', 'informe uma descrição ');
            return;
         }

         Firestore()
            .collection(colecao.orderB2b)
            .add({
               prestador_id,
               user_id,
               description,
               nome,
               data: new Date(Date.now()),
            })
            .catch(err => console.log(err));
      },
      [],
   );

   const orderTransaction = useCallback(
      async ({ prestador_id, consumidor, valor, description, nome, data }) => {
         Firestore().collection(colecao.orderTransaction).add({
            prestador_id,
            consumidor /** user_id */,
            valor,
            description,
            nome /** user.nome */,
            data,
         });
      },
      [],
   );

   const orderIndicacao = useCallback(
      ({
         userId,
         quemIndicou,
         quemIndicouName,
         quemIndicouWorkName,
         nomeCliente,
         telefoneCliente,
         descricao,
      }) => {
         Firestore()
            .collection(colecao.orderIndication)
            .add({
               userId,
               quemIndicou /** user_id */,
               quemIndicouName,
               quemIndicouWorkName,
               nomeCliente,
               telefoneCliente,
               descricao,
               createdAt: format(new Date(Date.now()), 'dd-MM-yy-HH-mm'),
            });
      },
      [],
   );

   //* .......................................................................

   const transactionAdd = useCallback(
      ({ prestador_id, descricao, type, valor, createdAt }) => {
         Firestore()
            .collection(colecao.transaction)
            .add({ prestador_id, descricao, type, valor, createdAt });
      },
      [],
   );

   useEffect(() => {
      if (!user) {
         return;
      }
      const ld = Firestore()
         .collection(colecao.users)
         .onSnapshot(h => {
            const data = h.docs.map(p => p.data() as IUserDto);

            const us = data
               .sort((a, b) => {
                  if (a.nome < b.nome) {
                     return -1;
                  }
               })
               .filter(h => h.inativo === false);
            setListUser(us);
         });
      return () => ld();
   }, [user]);

   useEffect(() => {
      setLoading(true);
   }, []);

   const signOut = useCallback(async () => {
      await AsyncStorage.removeItem(User_Collection);

      setUser(null);
   }, []);

   const updateUser = useCallback(async (user: IUserDto) => {
      await AsyncStorage.setItem(User_Collection, JSON.stringify(user));

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
            listUser,
            transactionAdd,
            orderB2b,
            orderIndicacao,
            orderTransaction,
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
