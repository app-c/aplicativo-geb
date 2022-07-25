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
import { IUserDto } from '../../dtos';
import { ModalB2b } from '../../components/ModalB2b';
import { MessageComponent } from '../../components/MessageComponent';
import { colecao } from '../../collection';
import { Classificacao } from '../Classificacao';
import { CartaMessagem } from '../../components/CartaMessagem';
import { ModalIndication } from '../../components/ModalIndication';
import { update } from '../../utils/updates';

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
   nome: string;
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
   const { user, expoToken, order, orders } = useAuth();
   const navigate = useNavigation();

   const [showModalSucess, setShowModalSucess] = React.useState(false);
   const [showModalIndication, setModalIndication] = React.useState(false);
   const [shwModalB2b, setModalB2b] = React.useState(false);
   const [showModalTransaction, setModalTransaction] = React.useState(false);
   const [showModalUpdates, setModalUpdates] = React.useState(false);

   const [totalCompras, setTotalCompras] = useState(0);
   const [ptB2b, setPtB2b] = useState(0);
   const [ptInd, setPtInd] = useState(0);
   const [ptPrs, setPtPrs] = useState(0);
   const [ptPad, setPtPad] = useState(0);
   const [ptVen, setPtVen] = useState(0);
   const [ptCom, setPtCom] = useState(0);

   const [sucess, setSucess] = useState<Propssuce[]>([]);
   const [price, setPrice] = useState<PriceProps>({});
   const [montante, setMontante] = useState('');
   const [montanteP, setMontanteP] = useState('');
   const [orderB2b, setOrderB2b] = useState<PropsB2b[]>([]);
   const [orderTransaction, setOrderTransaction] = useState<ProsTransaction[]>(
      [],
   );
   const [orderIndication, setOrderIndication] = useState<IOrder_Indication[]>(
      [],
   );
   const [modalHandShak, setModalHandShak] = React.useState(false);
   const [select, setSelect] = React.useState('');
   const [idIndication, setIdIndication] = React.useState('');
   const [quemIndicou, setQuemIndicou] = React.useState('');

   // * token ................................................................
   useFocusEffect(
      useCallback(() => {
         Fire().collection(colecao.users).doc(user.id).update({
            token: expoToken,
         });
      }, [expoToken, user.id]),
   );

   //* UPDATES ................................................................
   const ChecUpdadeDevice = React.useCallback(async () => {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
         setModalUpdates(true);
      }
   }, []);

   useFocusEffect(
      useCallback(() => {
         ChecUpdadeDevice();
      }, [ChecUpdadeDevice]),
   );

   const ReloadDevice = React.useCallback(async () => {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
   }, []);
   //* FINISH CICLO *  ....................................................................... */

   //* INDICATION...............................................................

   useEffect(() => {
      const load = Fire()
         .collection(colecao.orderIndication)
         .onSnapshot(h => {
            const order = h.docs.map(p => {
               return {
                  id: p.id,
                  ...p.data(),
               } as IOrder_Indication;
            });

            setOrderIndication(order.filter(h => h.userId === user.id));
         });

      return () => load();
   }, [user.id]);

   useEffect(() => {
      const load = Fire()
         .collection('sucess_indication')
         .onSnapshot(suce => {
            const res = suce.docs.map(p => {
               return {
                  id: p.id,
                  ...p.data(),
               } as Propssuce;
            });
            const fil = res.filter(h => h.quemIndicou === user.id);
            setSucess(fil);
         });

      return () => load();
   }, [user.id]);

   const handleSucess = useCallback(async (id: string) => {
      Fire().collection('sucess_indication').doc(id).delete();
      setShowModalSucess(false);
   }, []);

   const HandShak = useCallback((quemIndicou: string, id: string) => {
      setModalHandShak(true);
      setIdIndication(id);
      setQuemIndicou(quemIndicou);
      setModalIndication(false);
   }, []);

   const handleSelect = React.useCallback((type: string) => {
      setSelect(type);
   }, []);

   const HandFailIndication = useCallback(async () => {
      Fire().collection(colecao.orderIndication).doc(idIndication).delete();
      setModalHandShak(false);

      Fire()
         .collection('sucess_indication')
         .add({
            createdAt: format(new Date(Date.now()), 'dd/MM - HH:mm'),
            nome: user.nome,
            quemIndicou,
         });

      Fire()
         .collection(colecao.users)
         .doc(quemIndicou)
         .get()
         .then(h => {
            let { indicacao } = h.data() as IUserDto;
            Fire()
               .collection(colecao.users)
               .doc(quemIndicou)
               .update({
                  indicacao: (indicacao += 1),
               });
         })
         .catch(() =>
            Alert.alert('Algo deu errado', 'dados do usuário nao recuperado'),
         );

      setModalIndication(false);
   }, [idIndication, quemIndicou, user.nome]);

   const handleHandShack = React.useCallback(() => {
      if (select === 'fail') {
         HandFailIndication();
      }

      if (select === 'hand') {
         navigate.navigate('indication', { quemIndicou, id: idIndication });
      }

      if (select === 'handing') {
         setModalHandShak(false);
      }
   }, [HandFailIndication, idIndication, navigate, quemIndicou, select]);

   //* FINISH CICLO *  ....................................................................... */

   // TODO B2B *.................................................................. */

   console.log(colecao.orderB2b);

   useEffect(() => {
      const load = Fire()
         .collection(colecao.orderB2b)
         .onSnapshot(h => {
            const res = h.docs.map(p => {
               return {
                  id: p.id,
                  ...p.data(),
               } as PropsB2b;
            });
            setOrderB2b(res.filter(h => h.prestador_id === user.id));
         });

      return () => load();
   }, [user.id]);

   const handleSucessB2b = useCallback(
      (id: string, user_id: string, prestador_id: string) => {
         const data = format(new Date(Date.now()), 'dd-MM-yy-HH-mm');
         Fire()
            .collection('b2b')
            .add({
               id,
               user_id,
               prestador_id,
               data,
            })
            .then(() => {
               Fire().collection(colecao.orderB2b).doc(id).delete();
               Alert.alert('B2B realizado com sucesso!');
            });
      },
      [],
   );

   const handleFailB2b = useCallback((id: string) => {
      Fire().collection(colecao.orderB2b).doc(id).delete();
      setModalB2b(false);
   }, []);

   // TODO FINISH CICLO *  .................................................... */

   //* * TRANSACTIN ........................................................... */

   useEffect(() => {
      const load = Fire()
         .collection(colecao.orderTransaction)
         .onSnapshot(h => {
            const res = h.docs
               .map(p => {
                  return {
                     id: p.id,
                     ...p.data(),
                  } as ProsTransaction;
               })
               .filter(h => h.prestador_id === user.id);

            setOrderTransaction(res);
         });
      return () => load();
   }, [user.id]);

   // todo TRANSAÇÃO.......................................................................
   const handleValidateTransaction = useCallback(
      async (
         prestador_id: string,
         consumidor: string,
         descricao: string,
         id: string,
         valor: string,
      ) => {
         Fire()
            .collection(colecao.transaction)
            .add({
               prestador_id,
               descricao,
               type: 'entrada',
               createdAt: format(new Date(Date.now()), 'dd-MM-yyy-HH-mm'),
               valor,
            });
         Fire()
            .collection(colecao.transaction)
            .add({
               consumidor,
               descricao,
               type: 'saida',
               createdAt: format(new Date(Date.now()), 'dd-MM-yyy-HH-mm'),
               valor,
            });
         Fire()
            .collection('order_transaction')
            .doc(id)
            .delete()
            .then(() => Alert.alert('Transação confirmada'))
            .catch(err => console.log(err));
      },
      [],
   );

   const DeleteOrderTransaction = useCallback(async (id: string) => {
      Fire()
         .collection(colecao.orderTransaction)
         .doc(id)
         .delete()
         .then(() => Alert.alert('Transação deletada'));
   }, []);

   // todo .......................................................................

   //* *....................................................................... */
   const load = useCallback(() => {
      Fire()
         .collection('transaction')
         .onSnapshot(h => {
            const rs = h.docs
               .map(p => p.data())
               .filter(l => l.prestador_id === user.id);

            const somoa = rs.reduce((ac, it) => {
               return ac + it.valor;
            }, 0);
            setTotalCompras(somoa);
         });

      Fire()
         .collection('b2b')
         .onSnapshot(b2b => {
            const res = b2b.docs
               .map(h => h.data())
               .filter(h => h.user_id === user.id);
            setPtB2b(res.length * 20);
         });

      Fire()
         .collection(colecao.presenca)
         .onSnapshot(b2b => {
            const res = b2b.docs
               .map(h => h.data())
               .filter(h => h.user_id === user.id && h.presenca === true);
            setPtPrs(res.length * 10);
         });

      Fire()
         .collection(colecao.users)
         .onSnapshot(b2b => {
            const res = b2b.docs
               .map(h => h.data())
               .filter(h => h.id === user.id)
               .reduce((ac, it) => {
                  return ac + it.indicacao;
               }, 0);
            setPtInd(res * 15);
         });

      Fire()
         .collection(colecao.users)
         .onSnapshot(b2b => {
            const res = b2b.docs
               .map(h => h.data())
               .filter(h => h.id === user.id)
               .reduce((ac, it) => {
                  return ac + it.padrinhQuantity;
               }, 0);
            setPtPad(res * 35);
         });

      Fire()
         .collection(colecao.transaction)
         .onSnapshot(b2b => {
            const res = b2b.docs.map(h => h.data());

            const filCompras = res.filter(h => h.prestador_id === user.id);
            const filVendas = res.filter(h => h.consumidor === user.id);

            setPtCom(filCompras.length * 10);
            setPtVen(filVendas.length * 10);
         });
   }, [user.id]);
   //* *....................................................................... */

   useEffect(() => {
      const load = Fire()
         .collection(colecao.transaction)
         .onSnapshot(h => {
            const res = h.docs.map(p => p.data());
            const data = res.filter(h => {
               if (h.prestador_id === user.id && h.type === 'entrada') {
                  return h;
               }
            });

            const MontatePass = res
               .filter(h => {
                  const data = h.createdAt ? h.createdAt : '00-00-00-00-00';
                  const [dia, mes, ano, hora, min] = data
                     .split('-')
                     .map(Number);
                  const DateN = new Date(Date.now()).getFullYear() - 1;
                  if (h.type === 'entrada' && ano === DateN) {
                     return h;
                  }
               })
               .reduce((acc, item) => {
                  return acc + Number(item.valor);
               }, 0);

            const MontateAtual = res
               .filter(h => {
                  const data = h.createdAt ? h.createdAt : '00-00-00-00-00';

                  const [dia, mes, ano, hora, min] = data
                     .split('-')
                     .map(Number);
                  const DateN = new Date(Date.now()).getFullYear();
                  if (h.type === 'entrada' && ano === DateN) {
                     return h;
                  }
               })
               .reduce((acc, item) => {
                  return acc + Number(item.valor);
               }, 0);

            const mp = 3242222780 / 1000 + MontateAtual;

            setMontanteP(
               MontatePass.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
               }),
            );

            setMontante(
               mp.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
               }),
            );

            const total = data.reduce((acc, item) => {
               return acc + Number(item.valor);
            }, 0);

            const price = total.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL',
            });

            const pts = data.length * 10;

            const pricePts = {
               price,
               pts,
            };

            setPrice(pricePts);
         });

      return () => load();
   }, [user.id]);

   useFocusEffect(
      useCallback(() => {
         load();
         // token();
      }, [load]),
   );

   useFocusEffect(
      useCallback(() => {
         orderIndication.length > 0
            ? setModalIndication(true)
            : setModalIndication(false);

         sucess.length > 0
            ? setShowModalSucess(true)
            : setShowModalSucess(false);

         orderB2b.length > 0 ? setModalB2b(true) : setModalB2b(false);

         orderTransaction.length > 0
            ? setModalTransaction(true)
            : setModalTransaction(false);
      }, [
         orderB2b.length,
         orderIndication.length,
         orderTransaction.length,
         sucess.length,
      ]),
   );

   return (
      <Container>
         <Modal visible={showModalUpdates}>
            <Center p="5" bg={theme.colors.primary}>
               <Box>
                  <Text fontFamily={theme.fonts.blac} fontSize="16">
                     UMA NOVA ATUALIZAÇÃO ESTA DISPONÍVEL
                  </Text>
                  {update.map(h => (
                     <Text>{h.title}</Text>
                  ))}
                  <Text>vesion: 2.3.0</Text>
               </Box>
               <ButomBase onPress={ReloadDevice} mt="10">
                  ATUALIZAR
               </ButomBase>
            </Center>
         </Modal>

         <Modal transparent animationType="slide" visible={showModalSucess}>
            <Center bg="dark.600" mt={wt}>
               <TouchableOpacity
                  onPress={() => setShowModalSucess(false)}
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
         </Modal>

         <Modal transparent animationType="slide" visible={showModalIndication}>
            <Center mt={wt} bg="dark.600">
               <TouchableOpacity
                  onPress={() => setModalIndication(false)}
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
                           description={h.descricao}
                           clientName={h.nomeCliente}
                           telefone={h.telefoneCliente}
                           handShak={() => {
                              HandShak(h.quemIndicou, h.id);
                           }}
                           failTransaction={() => setModalIndication(false)}
                           quemIndicouName={h.quemIndicouName}
                           quemIndicouWorkName={h.quemIndicouWorkName}
                        />
                     </View>
                  ))}
               </ScrollView>
            </Center>
         </Modal>

         <Modal transparent visible={modalHandShak}>
            <Center mt={wt}>
               <ModalIndication
                  pres={handleHandShack}
                  closedModal={() => setModalHandShak(false)}
                  presHand={() => handleSelect('hand')}
                  presHanding={() => handleSelect('handing')}
                  fails={() => handleSelect('fail')}
                  selectHand={select === 'hand'}
                  selectHanding={select === 'handing'}
                  selectFail={select === 'fail'}
               />
            </Center>
         </Modal>

         <Modal transparent visible={shwModalB2b}>
            <Center mt={wt} bg="dark.600">
               <TouchableOpacity
                  onPress={() => setModalB2b(false)}
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
               {orderB2b.map(h => (
                  <View key={h.data.nanoseconds}>
                     <ModalB2b
                        clientName={h.nome}
                        handShak={() => {
                           handleSucessB2b(h.id, h.user_id, h.prestador_id);
                        }}
                        failTransaction={() => handleFailB2b(h.id)}
                     />
                  </View>
               ))}
            </Center>
         </Modal>

         <Modal
            visible={showModalTransaction}
            transparent
            animationType="slide"
            // onClose={() => setModalTransaction(false)}
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
                           handleValidateTransaction(
                              h.prestador_id,
                              h.consumidor,
                              h.description,
                              h.id,
                              h.valor,
                           );
                        }}
                        nome={h.nome}
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

         {user.avatarUrl ? (
            <Avatar source={{ uri: user.avatarUrl }} />
         ) : (
            <BoxIco>
               <Feather name="user" size={100} />
            </BoxIco>
         )}

         <TitleName> {user.nome} </TitleName>

         <View style={{ alignItems: 'center' }}>
            <ComprasText>Vendas</ComprasText>

            <BoxPrice>
               <TitlePrice>{price.price}</TitlePrice>
               <TitleP>
                  {ptB2b + ptCom + ptInd + ptPad + ptVen + ptPrs} pts
               </TitleP>
            </BoxPrice>
         </View>

         <View style={{ alignSelf: 'center' }}>
            <Text style={{ marginLeft: 16 }}>Vendas do G.E.B {montante}</Text>
         </View>

         <Line />

         <Classificacao />
      </Container>
   );
}
