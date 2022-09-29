/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
   Alert,
   Dimensions,
   FlatList,
   Modal,
   Platform,
   TouchableOpacity,
   View,
} from 'react-native';
import {
   DrawerActions,
   useFocusEffect,
   useNavigation,
} from '@react-navigation/native';

import { format } from 'date-fns';
import Fire from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';
import {
   Box,
   Center,
   HStack,
   Button as ButomBase,
   VStack,
   ScrollView,
   Text,
} from 'native-base';
import { convertAbsoluteToRem } from 'native-base/lib/typescript/theme/v33x-theme/tools';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';
import {
   Avatar,
   BoxIco,
   BoxPrice,
   ComprasText,
   Container,
   Line,
   TitleName,
   TitleP,
   TitlePrice,
} from './styles';
import { ModalOrderIndication } from '../../components/ModalOrderIndication';
import { IB2b, IIndicationDto, IOrderTransaction, IUserDto } from '../../dtos';
import { ModalB2b } from '../../components/ModalB2b';
import { MessageComponent } from '../../components/MessageComponent';
import { colecao } from '../../collection';
import { Classificacao } from '../Classificacao';
import { CartaMessagem } from '../../components/CartaMessagem';
import { ModalIndication } from '../../components/ModalIndication';
import { update, version } from '../../utils/updates';
import { api } from '../../services/api';

interface IOrder_Indication {
   id: string;
   createdAt: string;
   descricao: string;
   quemIndicou: string;
   userId: string;
   quemIndicouName: string;
   quemIndicouWorkName: string;
   nomeCliente: string;
   telefoneCliente: string;
}

interface Propssuce {
   id: string;
   data: string;
   nome: string;
   quemIndicou: string;
}

interface PropsB2b {
   id: string;
   data: { nanoseconds: number; seconds: number };
   description: string;
   nome: string;
   user_id: string;
   prestador_id: string;
}

interface ProsTransaction {
   id: string;
   data: {};
   consumidor_name: string;
   prestador_name: string;
   prestador_id: string;
   valor: string;
   description: string;
   consumidor: string;
}

interface PriceProps {
   price: string;
   pts: number;
}

const wt = Dimensions.get('window').width;

export function Inicio() {
   const { user, expoToken } = useAuth();
   const navigate = useNavigation();

   const [whoIndication, setWhoIndication] = React.useState('');
   const [idIndication, setIdIndication] = React.useState('');

   const [orderTransaction, setOrderTransaction] = React.useState<
      IOrderTransaction[]
   >([]);

   // * token ................................................................

   const loadOrders = React.useCallback(async () => {
      await api
         .get('/b2b/list-by-recevid')
         .then(h => {
            const rs = h.data as IB2b[];

            const re = rs.filter(p => p.validate === false);
            setOrderB2b(re);
         })
         .catch(h => {
            console.log('orderTransaction da tela inicio', h);
            Alert.alert('Erro', h.response.data.message);
         });

      await api
         .get('/consumo/find-order-prestador')
         .then(h => {
            const rs = h.data as IOrderTransaction[];
            setOrderTransaction(rs);
         })
         .catch(h => {
            Alert.alert('Erro', h.response.data.message);
         });

      await api
         .get('/indication/list-by-indication')
         .then(h => {
            const rs = h.data as IIndicationDto[];
            const fil = rs.filter(h => h.validate === false);
            setOrderIndication(fil);
         })
         .catch(h => {
            Alert.alert('Erro', h.response.data.message);
         });
   }, []);

   // !! INDICATION

   const [orderIndication, setOrderIndication] = React.useState<
      IIndicationDto[]
   >([]);
   const [modalIndication, setModalIndication] = React.useState(false);
   const [modaIndicationSelect, setModalIndicationSelect] =
      React.useState(false);

   const [select, setSelect] = React.useState('');

   const HandShakIndication = useCallback((quemIndicou: string, id: string) => {
      setWhoIndication(quemIndicou);
      setIdIndication(id);
      setModalIndication(false);
      setModalIndicationSelect(true);
   }, []);

   const submitHandShackIndication = React.useCallback(async () => {
      if (select === 'fail') {
         await api
            .delete(`/indication/del-indication/${idIndication}`)
            .then(h => {
               Alert.alert(
                  'NÃO DESANIME!!',
                  'Hoje sua indicação não deu certo, mas quem sabe na próxima',
               );
               setModalIndicationSelect(false);
               loadOrders();
            })
            .catch(h => {
               console.log(
                  'erro para deletar order indication na tela inicial',
                  h,
               );
               Alert.alert('Ocorreu um erro', h.response.data.message);
            });
      }

      if (select === 'hand') {
         navigate.navigate('indication', {
            quemIndicou: whoIndication,
            id: idIndication,
         });
      }

      if (select === 'handing') {
         setModalIndicationSelect(false);
      }
   }, [idIndication, navigate, select, whoIndication]);

   // !! B2B *.................................................................. */
   const [orderB2b, setOrderB2b] = React.useState<IB2b[]>([]);
   const [modalB2b, setModalB2b] = React.useState(false);

   const handleSucessB2b = useCallback(async (id: string) => {
      const dados = {
         id,
      };
      await api
         .put('/b2b/validate-b2b', dados)
         .then(h => {
            Alert.alert('Sucesso!', 'Validação realizada.');
            loadOrders();
            if (orderB2b.length === 0) {
               setModalB2b(false);
            }
         })
         .catch(h => {
            console.log('erro ao validar order b2b na tela inicial', h);
            Alert.alert('Erro', h.response.data.message);
         });
   }, []);

   const deleteB2b = useCallback(async (id: string) => {
      await api
         .delete(`/b2b/del-b2b/${id}`)
         .then(h => {
            Alert.alert(
               'Uma pena que não houve B2B',
               'Já reserva sua agenda para um próximo encontro',
            );
            loadOrders();
         })
         .catch(h => {
            console.log('erro ao deletar orderb2b na tela inicial', h);
            Alert.alert('Erro', h.response.data.message);
         });
   }, []);

   //! ! TRANSACTIN ........................................................... */
   const [modalTransaction, setModalTransaction] = React.useState(false);

   const validateTransaction = useCallback(async (data: IOrderTransaction) => {
      const dados = {
         consumidor_id: data.consumidor_id,
         consumidor_name: data.consumidor_name,
         prestador_name: data.prestador_name,
         prestador_id: data.prestador_id,
         valor: data.valor,
         descricao: data.descricao,
         order_id: data.id,
      };
      await api
         .post('/transaction/create-transaction', dados)
         .then(h => {
            Alert.alert(
               'Sucesso!',
               'Obrigado por insentivar um membro do grupo G.E.B training por consumir seu produto',
            );
            loadOrders();
         })
         .catch(h => {
            console.log(h.response.data.message);
         });
   }, []);

   const DeleteOrderTransaction = useCallback(async (id: string) => {}, []);

   // todo .......................................................................

   //* *....................................................................... */

   // useEffect(() => {
   //    const load = Fire()
   //       .collection(colecao.transaction)
   //       .onSnapshot(h => {
   //          const res = h.docs.map(p => p.data());
   //          const data = res.filter(h => {
   //             if (h.prestador_id === user.id && h.type === 'entrada') {
   //                return h;
   //             }
   //          });

   //          const MontatePass = res
   //             .filter(h => {
   //                const data = h.createdAt ? h.createdAt : '00-00-00-00-00';
   //                const [dia, mes, ano, hora, min] = data
   //                   .split('-')
   //                   .map(Number);
   //                const DateN = new Date(Date.now()).getFullYear() - 1;
   //                if (h.type === 'entrada' && ano === DateN) {
   //                   return h;
   //                }
   //             })
   //             .reduce((acc, item) => {
   //                return acc + Number(item.valor);
   //             }, 0);

   //          const MontateAtual = res
   //             .filter(h => {
   //                const data = h.createdAt ? h.createdAt : '00-00-00-00-00';

   //                const [dia, mes, ano, hora, min] = data
   //                   .split('-')
   //                   .map(Number);
   //                const DateN = new Date(Date.now()).getFullYear();
   //                if (h.type === 'entrada' && ano === DateN) {
   //                   return h;
   //                }
   //             })
   //             .reduce((acc, item) => {
   //                return acc + Number(item.valor);
   //             }, 0);

   //          const mp = 3242222780 / 1000 + MontateAtual;

   //          setMontanteP(
   //             MontatePass.toLocaleString('pt-BR', {
   //                style: 'currency',
   //                currency: 'BRL',
   //             }),
   //          );

   //          setMontante(
   //             mp.toLocaleString('pt-BR', {
   //                style: 'currency',
   //                currency: 'BRL',
   //             }),
   //          );

   //          const total = data.reduce((acc, item) => {
   //             return acc + Number(item.valor);
   //          }, 0);

   //          const price = total.toLocaleString('pt-BR', {
   //             style: 'currency',
   //             currency: 'BRL',
   //          });

   //          const pts = data.length * 10;

   //          const pricePts = {
   //             price,
   //             pts,
   //          };

   //          setPrice(pricePts);
   //       });

   //    return () => load();
   // }, [user.id]);

   useFocusEffect(
      useCallback(() => {
         loadOrders();
      }, []),
   );

   return (
      <Container>
         {/* <Modal transparent animationType="slide" visible={false}>
            <Center bg="dark.600" mt={wt}>
               <TouchableOpacity
                  onPress={() => {}}
                  style={{
                     alignSelf: 'flex-end',
                     marginRight: 10,
                     padding: 10,
                  }}
               >
                  <AntDesign
                     name="closecircle"
                     size={30}
                     color={theme.colors.focus}
                  />
               </TouchableOpacity>

               {sucess.map(h => (
                  <View key={h.id} style={{ padding: 20 }}>
                     <Text>
                        Sucesso! {h.nome} esta negociando com o cliente que voce
                        indicou
                     </Text>

                     <TouchableOpacity
                        onPress={() => {
                           handleSucess(h.id);
                        }}
                        style={{
                           width: 80,
                           height: 30,
                           alignSelf: 'center',
                           alignItems: 'center',
                           backgroundColor: theme.colors.focus,
                           justifyContent: 'center',
                           borderRadius: 7,
                        }}
                     >
                        <Text style={{ color: theme.colors.primary }}>OK</Text>
                     </TouchableOpacity>

                     <Line />
                  </View>
               ))}
            </Center>
         </Modal> */}

         {/* MODAL order INDICATION */}
         <Modal transparent animationType="slide" visible={modalIndication}>
            <Center mt={wt} bg="dark.600">
               <TouchableOpacity
                  onPress={() => {}}
                  style={{
                     alignSelf: 'flex-end',
                     marginRight: 10,
                     padding: 10,
                  }}
               >
                  <AntDesign
                     name="closecircle"
                     size={30}
                     color={theme.colors.focus}
                  />
               </TouchableOpacity>
               <ScrollView>
                  {orderIndication.map(h => (
                     <View key={h.id}>
                        <ModalOrderIndication
                           description={h.description}
                           clientName={h.client_name}
                           telefone={h.phone_number_client}
                           handShak={() => {
                              HandShakIndication(h.quemIndicou_name, h.id);
                           }}
                           failTransaction={() => setModalIndication(false)}
                           quemIndicouName={h.quemIndicou_name}
                        />
                     </View>
                  ))}
               </ScrollView>
            </Center>
         </Modal>
         <Modal transparent visible={modaIndicationSelect}>
            <Center mt={wt}>
               <ModalIndication
                  pres={() => submitHandShackIndication()}
                  closedModal={() => setModalIndicationSelect(false)}
                  presHand={() => setSelect('hand')}
                  presHanding={() => setSelect('handing')}
                  fails={() => setSelect('fail')}
                  selectHand={select === 'hand'}
                  selectHanding={select === 'handing'}
                  selectFail={select === 'fail'}
               />
            </Center>
         </Modal>

         {/* MODAL ORDER B2B2 */}
         <Modal transparent visible={modalB2b}>
            <Center mt={wt} bg="dark.600">
               <TouchableOpacity
                  onPress={() => {
                     setModalB2b(false);
                  }}
                  style={{
                     alignSelf: 'flex-end',
                     marginRight: 10,
                     padding: 10,
                  }}
               >
                  <AntDesign
                     name="closecircle"
                     size={30}
                     color={theme.colors.focus}
                  />
               </TouchableOpacity>
               <FlatList
                  contentContainerStyle={{ paddingBottom: 200 }}
                  data={orderB2b}
                  keyExtractor={h => h.id}
                  renderItem={({ item: h }) => (
                     <Box>
                        <ModalB2b
                           clientName={h.send_name}
                           handShak={() => {
                              handleSucessB2b(h.id);
                           }}
                           failTransaction={() => deleteB2b(h.id)}
                        />
                     </Box>
                  )}
               />
            </Center>
         </Modal>

         {/* MODAL ORDER TRANSACTION */}
         <Modal
            visible={modalTransaction}
            transparent
            animationType="slide"
            onClose={() => setModalTransaction(false)}
         >
            <Box pl="5" pr="5" mt={wt} bg="dark.500">
               <TouchableOpacity
                  onPress={() => setModalTransaction(false)}
                  style={{
                     alignSelf: 'flex-end',
                     marginRight: 10,
                     padding: 10,
                  }}
               >
                  <AntDesign
                     name="closecircle"
                     size={30}
                     color={theme.colors.focus}
                  />
               </TouchableOpacity>
               {orderTransaction.map(h => (
                  <View key={h.id}>
                     <MessageComponent
                        confirmar={() => {
                           validateTransaction(h);
                        }}
                        nome={h.consumidor_name}
                        rejeitar={() => {
                           DeleteOrderTransaction(h.id);
                        }}
                        valor={h.valor}
                     />
                  </View>
               ))}
            </Box>
         </Modal>
         <Box w="100%">
            <HStack space="70%">
               <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => navigate.dispatch(DrawerActions.openDrawer())}
               >
                  <MaterialCommunityIcons
                     name="menu"
                     size={40}
                     color={theme.colors.focus}
                  />
               </TouchableOpacity>

               {orderIndication.length > 0 && (
                  <CartaMessagem
                     pres={() => setModalIndication(true)}
                     quantity={orderIndication.length}
                  />
               )}

               {orderB2b.length > 0 && (
                  <CartaMessagem
                     pres={() => setModalB2b(true)}
                     quantity={orderB2b.length}
                  />
               )}

               {orderTransaction.length > 0 && (
                  <CartaMessagem
                     pres={() => setModalTransaction(true)}
                     quantity={orderTransaction.length}
                  />
               )}
            </HStack>
         </Box>
         {user.profile === null ? (
            <Avatar source={{ uri: user.avatar }} />
         ) : (
            <BoxIco>
               <Feather name="user" size={100} />
            </BoxIco>
         )}
         <TitleName> {user.nome} </TitleName>
         <View style={{ alignItems: 'center' }}>
            <ComprasText>Minhas Vendas</ComprasText>

            <BoxPrice>
               <TitlePrice>price</TitlePrice>
               <TitleP>pts</TitleP>
            </BoxPrice>
         </View>
         <View style={{ alignSelf: 'center' }}>
            <Text style={{ marginLeft: 16 }}>Vendas do G.E.B </Text>
         </View>
         <Line />
         <Classificacao />
      </Container>
   );
}
