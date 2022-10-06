/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
import React from 'react';
import { Box, Center, Input, Text, VStack } from 'native-base';
import { Alert, TouchableOpacity } from 'react-native';
import fire from '@react-native-firebase/firestore';
import axios from 'axios';
import { number } from 'yup';
import Async from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { useNavigation } from '@react-navigation/native';
import theme from '../../global/styles/theme';
import { colecao } from '../../collection';

import {
   IOrderB2b,
   IOrderIndication,
   IOrderTransaction,
   ITransaction,
   IUserDto,
} from '../../dtos';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import { Loading } from '../Loading';

type PropsPresensa = {
   user_id: string;
   presenca: boolean;
   createdAt: number;
   nome: string;
   avatar: string;
};

export interface IPost {
   id: string;
   descricao: string;
   post: string;
   like: number;
   nome: string;
   avater: string;
   data: number;
}

export interface OldUserProps {
   CNPJ: string;
   CPF: string;
   adm: boolean;
   apadrinhado: boolean;
   avatarUrl: string;
   email: string;
   enquadramento: string;
   id: string;
   inative: boolean;
   inativo: boolean;
   indicacao: number;
   links: {
      face: string;
      insta: string;
      maps: string;
      site: string;
   };
   logoUrl: string;
   nome: string;
   padrinhQuantity: number;
   ramo: string;
   token: string;
   whats: string;
   workName: string;
}

export function New() {
   const { user, oldUser } = useAuth();

   const [membro, setMembro] = React.useState('');
   const [senha, setSenha] = React.useState('');
   const [userProfile, setUserProfile] = React.useState<OldUserProps>([]);

   const [b2b, setB2b] = React.useState<IOrderB2b[]>([]);
   const [orderB2b, setOrderB2b] = React.useState<IOrderB2b[]>([]);
   const [orderIndica, setOrderIndica] = React.useState<IOrderIndication[]>([]);
   const [orderTra, setOrderTra] = React.useState<IOrderTransaction[]>([]);
   const [transaction, setTransaction] = React.useState<ITransaction[]>([]);
   const [presenca, setPresenca] = React.useState<PropsPresensa[]>([]);
   const [post, setPost] = React.useState<IPost[]>([]);
   const [users, setUsers] = React.useState<IUserDto[]>([]);

   React.useEffect(() => {
      console.log(oldUser);
      // fire()
      //    .collection('users')
      //    .doc('Z5GuNwY6CmVDYFDkiFHDkk6Ll722')
      //    .get()
      //    .then(h => {
      //       setUserProfile(h.data() as OldUserProps);
      //    });

      setUserProfile(oldUser);
   }, [oldUser]);

   // React.useEffect(() => {
   //    fire()
   //       .collection(colecao.users)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as IUserDto);

   //          setUsers(res);
   //       });

   //    fire()
   //       .collection(colecao.orderB2b)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as IOrderB2b);

   //          setOrderB2b(res);
   //       });

   //    fire()
   //       .collection('b2b')
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as IOrderB2b);

   //          setB2b(res);
   //       });

   //    fire()
   //       .collection(colecao.orderIndication)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as IOrderIndication);

   //          setOrderIndica(res);
   //       });

   //    fire()
   //       .collection(colecao.orderTransaction)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as IOrderTransaction);

   //          setOrderTra(res);
   //       });

   //    fire()
   //       .collection(colecao.transaction)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as ITransaction);

   //          setTransaction(res);
   //       });

   //    fire()
   //       .collection(colecao.presenca)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as PropsPresensa);
   //          setPresenca(res);
   //       });

   //    fire()
   //       .collection(colecao.post)
   //       .get()
   //       .then(h => {
   //          const res = h.docs.map(h => h.data() as IPost);
   //          setPost(res);
   //       });
   // }, []);

   const submitOrderB2b = React.useCallback(
      async (token: string) => {
         const rs = orderB2b.map(h => {
            const us = users.find(p => p.id === h.user_id);
            const pres = users.find(p => p.id === h.prestador_id);

            if (us && pres) {
               return {
                  send_id: us.id,
                  send_name: us.nome,
                  recevid_id: h.prestador_id,
                  recevid_name: pres.nome,
                  assunto: h.description,
                  validate: false,
               };
            }
         });

         // eslint-disable-next-line dot-notation
         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

         for (let i = 0; i < rs.length; i += 1) {
            if (rs[i]) {
               const data = rs[i];
               await api
                  .post('/b2b/create-b2b', data)
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }
      },
      [orderB2b, users],
   );

   const submitB2b = React.useCallback(
      async (token: string) => {
         const B2b = b2b.map(h => {
            const us = users.find(p => p.id === h.user_id);
            const pres = users.find(p => p.id === h.prestador_id);
            const as = orderB2b.find(p => p.user_id === h.user_id);

            if (us && pres && as) {
               return {
                  send_id: us.id,
                  send_name: us.nome,
                  recevid_id: h.prestador_id,
                  recevid_name: pres.nome,
                  appointment: h.data,
                  assunto: as.description,
                  validate: true,
               };
            }
         });

         api.defaults.headers.common.Authorization = `Bearer ${token}`;

         for (let i = 0; i < B2b.length; i += 1) {
            if (B2b[i]) {
               const data = B2b[i];
               await api
                  .post('/b2b/create-b2b', data)
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }
      },
      [b2b, orderB2b, users],
   );

   const submitOrderIndica = React.useCallback(
      async (token: string) => {
         const rs = orderIndica.map(h => {
            const pres = users.find(p => p.id === h.userId);

            if (user && pres) {
               return {
                  indicado_id: h.userId,
                  indicado_name: pres.nome,
                  quemIndicou_id: h.quemIndicou,
                  quemIndicou_name: h.quemIndicouName,
                  client_name: h.nomeCliente,
                  description: h.descricao,
                  phone_number_client: Number(h.telefoneCliente) || 0,
               };
            }
         });

         // // eslint-disable-next-line dot-notation
         api.defaults.headers.common.Authorization = `Bearer ${token}`;

         for (let i = 0; i < rs.length; i += 1) {
            if (rs[i]) {
               const data = rs[i];
               await api
                  .post('/indication/create-indication', data)
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }
      },
      [orderIndica, user, users],
   );

   const submitOrderTra = React.useCallback(
      async (token: string) => {
         const rs = orderTra.map(h => {
            const user = users.find(p => p.id === h.consumidor);
            const pres = users.find(p => p.id === h.prestador_id);
            if (user && pres) {
               const [i, d] = h.valor.split('.').map(Number);
               return {
                  descricao: h.description,
                  consumidor_id: h.consumidor,
                  consumidor_name: user.nome,
                  prestador_name: pres.nome,
                  prestador_id: h.prestador_id,
                  valor: i,
               };
            }
         });

         // // eslint-disable-next-line dot-notation
         api.defaults.headers.common.Authorization = `Bearer ${token}`;

         for (let i = 0; i < rs.length; i += 1) {
            if (rs[i]) {
               const data = rs[i];

               await api
                  .post('/consumo/order-transaction', data)
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }
      },
      [orderTra, users],
   );

   const submitTra = React.useCallback(
      async (token: string) => {
         const rs = transaction
            .filter(h => {
               return h.type === 'entrada';
            })
            .map(h => {
               const user = users.find(p => p.id === h.prestador_id);
               const [i, d] = String(h.valor).split('.').map(Number);
               if (user) {
                  return {
                     descricao: h.descricao || '',
                     prestador_name: user.nome,
                     prestador_id: h.prestador_id,
                     valor: i,
                  };
               }
            });

         const rsU = transaction
            .filter(h => {
               return h.type === 'saida';
            })
            .map(h => {
               const user = users.find(p => p.id === h.consumidor);
               const [i, d] = String(h.valor).split('.').map(Number);
               if (user) {
                  return {
                     descricao: h.descricao || '',
                     consumidor_name: user.nome,
                     consumidor_id: h.consumidor,
                     valor: i,
                  };
               }
            });

         // // eslint-disable-next-line dot-notation
         api.defaults.headers.common.Authorization = `Bearer ${token}`;

         for (let i = 0; i < rs.length; i += 1) {
            if (rs[i]) {
               await api
                  .post('/transaction/create-transaction', rs[i])
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }

         for (let i = 0; i < rsU.length; i += 1) {
            if (rsU[i]) {
               await api
                  .post('/transaction/create-transaction', rsU[i])
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }
      },
      [transaction, users],
   );

   const submitPresenca = React.useCallback(
      async (token: string) => {
         const rs = presenca
            .filter(h => {
               if (h.presenca === true) {
                  return h;
               }
            })
            .map(h => {
               const us = users.find(p => p.id === h.user_id);

               if (us) {
                  return {
                     nome: us.nome,
                     user_id: us.id,
                  };
               }
            });

         // // eslint-disable-next-line dot-notation
         api.defaults.headers.common.Authorization = `Bearer ${token}`;

         for (let i = 0; i < rs.length; i += 1) {
            if (rs[i]) {
               await api
                  .post('/presenca/create-presenca', rs[i])
                  .then(h => console.log('ok'))
                  .catch(h => console.log('erro', h.response.data));
            }
         }
      },
      [presenca, users],
   );

   const submitPost = React.useCallback(
      async token => {
         const res = post.map(h => {
            const us = users.find(p => {
               if (p.nome.includes(h.nome)) {
                  return p;
               }
            });
            if (us) {
               return {
                  image: h.post,
                  fk_id_user: us.id,
                  description: h.descricao,
                  like: h.like,
               };
            }
         });

         for (let i = 0; i < res.length; i += 1) {
            await api
               .post('post/', res[i])
               .then(h => console.log('ok', h.data))
               .catch(h => console.log('erro'));
         }
      },
      [post, users],
   );

   const submitProfile = React.useCallback(
      async tk => {
         const {
            CNPJ,
            CPF,
            avatarUrl,
            email,
            enquadramento,
            links,
            logoUrl,
            ramo,
            whats,
            workName,
            id,
         } = userProfile;

         api.defaults.headers.common.Authorization = `Bearer ${tk}`;

         const data = [
            { nome: 'faceBook', link: links.face, user_id: id },
            { nome: 'web', link: links.site, user_id: id },
            { nome: 'instagram', link: links.insta, user_id: id },
            { nome: 'maps', link: links.maps, user_id: id },
         ];

         for (let i = 0; i < data.length; i += 1) {
            await api
               .post('user/link/create', data[i])
               .then(h => console.log('link'))
               .catch(h => console.log('erro no link', h));
         }
         await api
            .post('user/create-profile', {
               whats,
               workName,
               CNPJ,
               CPF,
               email,
               enquadramento,
               ramo,
               user_id: id,
               logo: logoUrl,
               avatar: avatarUrl,
            })
            .then(async h => {
               console.log('ok profile');
               const firstLogin = false;
               await Async.setItem('first-login', JSON.stringify(firstLogin));
            })
            .catch(h => console.log('erro profile', h));
      },
      [userProfile],
   );

   const handleSubmit = React.useCallback(async () => {
      const dados = {
         id: userProfile.id,
         nome: userProfile.nome,
         membro,
         senha,
         adm: userProfile.adm,
         firstLogin: false,
         inativo: userProfile.inativo,
         apadrinhado: userProfile.apadrinhado,
         qntIndication: userProfile.indicacao,
         qntPadrinho: userProfile.padrinhQuantity,
      };
      console.log('submitted');
      await api
         .post('/user/create-user', dados)
         .then(async () => {
            await api
               .post('/user/session', {
                  membro,
                  senha,
               })
               .then(async h => {
                  const { token } = h.data;

                  // submitOrderB2b(token);
                  // submitB2b(token);
                  // submitOrderIndica(token);
                  // submitOrderTra(token);
                  // submitTra(token);
                  // submitPresenca(token);
                  // submitPost(token);
                  submitProfile(token);
                  const first = false;

                  await Async.setItem('first-login', JSON.stringify(first));
               })
               .catch(h =>
                  console.log('login da tela new', h.response.data.message),
               )
               .finally(async () => {
                  console.log('atualizado');
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
               });
         })
         .catch(async h => {
            console.log('erro no cadastro', h);
            if (h.response.data.message === 'Esse membro já está cadastrado') {
               Alert.alert(h.response.data.message);
               const first = false;

               await Async.setItem('first-login', JSON.stringify(first));
               await Updates.fetchUpdateAsync();
               await Updates.reloadAsync();
            }
         });
   }, [userProfile, membro, senha, submitProfile]);

   console.log('save');

   if (!oldUser) {
      return <Loading />;
   }

   return (
      <Center p="5" flex="1">
         <Text fontFamily={theme.fonts.tenor} fontSize="18">
            ANTES DE ATUALIZAR, IREMOS CADASTRAR ALGUNS DADOS
         </Text>

         <Center
            borderRadius={10}
            mt="10"
            p="10"
            bg={theme.colors.focus_light_3}
         >
            <Text fontFamily={theme.fonts.blac} fontSize="16">
               NA PRÓXIMA VEZ QUE ACESSAR SUA CONTA, VOCÊ DEVERÁ ENTRAR COM{' '}
               <Text color="dark.900">"MEMBRO E SENHA" </Text> EM QUE VOCÊ IRA
               CADASTRAR LOGO ABAIXO.{'\n'}
               <Text fontFamily={theme.fonts.tenor} color={theme.colors.focus}>
                  ESSE NOME "MEMBRO" NÃO IRÁ SER MOSTRADO PARA OS OUTROS
                  USUÁRIOS.
               </Text>
            </Text>
         </Center>

         <VStack mb="10" space={5} w="100%" mt="10">
            <Input
               fontFamily={theme.fonts.blac}
               fontSize={14}
               placeholder='digite seu nome como "membro '
               onChangeText={setMembro}
            />
            <Input
               fontFamily={theme.fonts.blac}
               fontSize={14}
               placeholder="digite sua nova senha"
               onChangeText={setSenha}
            />
         </VStack>

         <TouchableOpacity onPress={handleSubmit}>
            <Box borderRadius={5} px="20" py="3" bg={theme.colors.focus_light}>
               <Text
                  fontFamily={theme.fonts.blac}
                  color={theme.colors.text_secundary}
                  fontSize="18"
               >
                  CADASTRAR
               </Text>
            </Box>
         </TouchableOpacity>
      </Center>
   );
}
