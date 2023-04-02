/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
   DrawerActions,
   useFocusEffect,
   useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import {
   ActivityIndicator,
   Dimensions,
   FlatList,
   Modal,
   TouchableOpacity,
   View,
   Alert,
   Platform,
} from 'react-native';

// import * as Updates from 'expo-updates';
import { Box, Center, HStack, ScrollView, Text } from 'native-base';
import * as Notifications from 'expo-notifications';
import { CartaMessagem } from '../../components/CartaMessagem';
import { MessageComponent } from '../../components/MessageComponent';
import { ModalB2b } from '../../components/ModalB2b';
import { ModalIndication } from '../../components/ModalIndication';
import { ModalOrderIndication } from '../../components/ModalOrderIndication';
import {
   IB2b,
   IIndicationDto,
   IOrderTransaction,
   ITransaction,
} from '../../dtos';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';
import { api } from '../../services/api';
import { Classificacao } from '../Classificacao';
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
import { StarModal } from '../../components/StarModal';

interface PriceProps {
   price: string;
   pts: number;
}

interface PropResponse {
   compras: Tips[];
   vendas: Tips[];
   presenca: Tips[];
   indication: Tips[];
   b2b: Tips[];
}

interface IPersonnalPropsRank {
   compras: Tips;
   vendas: Tips;
   presenca: Tips;
   indication: Tips;
   b2b: Tips;
   padrinho: Tips;
}

interface Tips {
   id: string;
   nome: string;
   pontos: number;
   rank: number;
   valor?: number;
}

interface PropsValorTotal {
   priceUser: string;
   priceGeb: string;
}

interface IModalProps {
   id: string;
   modal: boolean;
   nome?: string;
}

const wt = Dimensions.get('window').width;

export function Inicio() {
   const { user, expoToken, signOut } = useAuth();
   const navigate = useNavigation();

   const [modalStar, setModalStar] = React.useState<IModalProps>({
      id: '',
      modal: false,
      nome: '',
   });
   const [star, setStar] = React.useState(5);

   const [whoIndication, setWhoIndication] = React.useState('');
   const [idIndication, setIdIndication] = React.useState('');

   const [globalPont, setGlobalPont] = React.useState<PropResponse>();

   const [orderTransaction, setOrderTransaction] = React.useState<
      IOrderTransaction[]
   >([]);
   const [valorGeb, setValorGeb] = React.useState<PropsValorTotal>();

   const [individualRak, setIndividualRank] =
      React.useState<IPersonnalPropsRank>();

   // * token ................................................................

   const loadOrders = React.useCallback(async () => {
      try {
         await api.get('/b2b/list-by-recevid').then(h => {
            const rs = h.data as IB2b[];

            const re = rs.filter(p => p.validate === false);
            setOrderB2b(re);
         });

         await api.get('/consumo/find-order-prestador').then(h => {
            const rs = h.data as IOrderTransaction[];
            setOrderTransaction(rs);
         });

         await api.get('/indication/list-by-indication').then(h => {
            const rs = h.data as IIndicationDto[];
            const fil = rs.filter(h => h.validate === false);
            setOrderIndication(fil);
         });

         await api.get('/user/global-rank').then(h => {
            setGlobalPont(h.data);
         });

         await api.get('/user/global-rank-ind').then(h => {
            setIndividualRank(h.data);
         });

         await api.get('/transaction/list-all-transaction').then(h => {
            const res = h.data as ITransaction[];

            const valor = res.reduce((ac, i) => {
               return ac + i.valor;
            }, 0);

            const userTrans = res.filter(p => {
               return p.prestador_id === user.id;
            });

            const valorTotalUser = userTrans.reduce((ac, i) => {
               const v = i.valor;
               return ac + Number(v);
            }, 0);

            const vlorUser = valorTotalUser;

            const priceUser = vlorUser.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL',
            });

            const t = valor + 7782628;

            const price = t.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL',
            });

            const dados = {
               priceUser: priceUser || '0',
               priceGeb: price || '0',
            };

            setValorGeb(dados);
         });
      } catch (h) {
         const { message } = h.response.data;
         if (
            message === 'falta o token' ||
            message === 'token expirou' ||
            message === 'token invalido'
         ) {
            Alert.alert('Erro', 'Seu tokem expirou');
            signOut();
         }
         Alert.alert('Erro ao carregar listas', message);
      }
   }, [signOut, user]);

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
               Alert.alert('Ocorreu um erro', message);
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
   }, [idIndication, loadOrders, navigate, select, whoIndication]);

   // !! B2B *.................................................................. */
   const [orderB2b, setOrderB2b] = React.useState<IB2b[]>([]);
   const [modalB2b, setModalB2b] = React.useState(false);

   const handleSucessB2b = useCallback(async (data: IB2b) => {
      const dados = {
         id: data.id,
      };
      await api
         .put('/b2b/validate-b2b', dados)
         .then(h => {
            Alert.alert('Sucesso!', 'Validação realizada.');
            setModalStar({
               id: data.send_id,
               modal: true,
               nome: data.send_name,
            });
            loadOrders();
            if (orderB2b.length === 0) {
               setModalB2b(false);
            }
         })
         .catch(h => {
            console.log('erro ao validar order b2b na tela inicial', h);
            Alert.alert('Erro', 'message');
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
            if (orderB2b.length === 0) {
               setModalB2b(false);
            }
         })
         .catch(h => {
            console.log('erro ao deletar orderb2b na tela inicial', h);
            Alert.alert('Erro', message);
         });
   }, []);

   //! ! TRANSACTIN ........................................................... */
   const [modalTransaction, setModalTransaction] = React.useState(false);

   const validateTransaction = useCallback(
      async (data: IOrderTransaction) => {
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
                  'Obrigado por incentivar um membro do grupo G.E.B networking por consumir seu produto',
               );

               loadOrders();
               if (orderTransaction.length === 0) {
                  setModalTransaction(false);
               }
            })
            .catch(h => {
               const { message } = h.response.data;
               console.log('erro create transaction na tela de inicio', h);
               Alert.alert('Erro ao validar sua transação', message);
            });
      },
      [loadOrders, orderTransaction],
   );

   const DeleteOrderTransaction = useCallback(
      async (id: string) => {
         await api.delete(`/consumo/delete-order/${id}`).then(h => {
            const rs = h.data;
            setOrderTransaction(orderTransaction.filter(h => h !== rs));

            if (orderTransaction.length === 0) {
               setModalTransaction(false);
            }
         });
         loadOrders();
      },
      [loadOrders],
   );

   //* * UPDATE APLICATION ....................................................
   // const [showModalUpdate, setModalUpdates] = React.useState(false);

   // const [modalNew, setModaNew] = React.useState(false);

   // const appState = useRef(AppState.currentState);
   // const [appVisible, setAppVisible] = React.useState(appState.current);

   // const ChecUpdadeDevice = React.useCallback(async () => {
   //    const { isAvailable } = await Updates.checkForUpdateAsync();
   //    if (isAvailable) {
   //       // setModalUpdates(true);
   //       setModaNew(true);
   //    }
   // }, []);

   const ReloadDevice = React.useCallback(async () => {
      // await Updates.fetchUpdateAsync();
      // await Updates.reloadAsync();
   }, []);

   // React.useEffect(() => {
   //    const event = AppState.addEventListener('change', h => {
   //       if (h === 'active') {
   //          ChecUpdadeDevice();
   //       }
   //    });

   //    return () => {
   //       event.remove();
   //    };
   // }, [ChecUpdadeDevice]);

   //* * .......................................................................

   const openModals = React.useCallback(() => {
      if (orderTransaction.length > 0) {
         setModalTransaction(true);
      }

      if (orderIndication.length > 0) {
         setModalIndication(true);
      }

      if (orderB2b.length > 0) {
         setModalB2b(true);
      }
   }, [orderB2b.length, orderIndication.length, orderTransaction.length]);

   // UPDADE TOKEN
   const UpdateToken = React.useCallback(async () => {
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

      await api.post('user/update-membro', {
         membro: user.membro,
         nome: user.nome,
         id: user.id,
         adm: user.adm,
         token,
      });
   }, [user]);

   useFocusEffect(
      useCallback(() => {
         loadOrders();
         openModals();
         UpdateToken();
      }, [UpdateToken, loadOrders, openModals]),
   );

   const top = individualRak
      ? individualRak.compras.pontos +
        individualRak.vendas.pontos +
        individualRak.b2b.pontos +
        individualRak.indication.pontos +
        individualRak.padrinho.pontos +
        individualRak.presenca.pontos
      : 0;

   const handleStar = React.useCallback(async () => {
      await api
         .post('/star/assest', {
            star,
            fk_id_user: modalStar.id,
         })
         .then(() => {
            setModalStar({ id: '', modal: false });
         });
   }, [modalStar.id, star]);

   return (
      <Container>
         {/* MODAL order INDICATION */}
         <Modal transparent animationType="slide" visible={modalIndication}>
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

         <Modal
            transparent
            animationType="slide"
            visible={modaIndicationSelect}
         >
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
         <Modal transparent animationType="slide" visible={modalB2b}>
            <Center bg="dark.600">
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
                     <Center w={wt * 0.7}>
                        <ModalB2b
                           clientName={h.send_name}
                           handShak={() => {
                              handleSucessB2b(h);
                           }}
                           failTransaction={() => deleteB2b(h.id)}
                        />
                     </Center>
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
               <FlatList
                  data={orderTransaction}
                  keyExtractor={h => h.id}
                  renderItem={({ item: h }) => (
                     <MessageComponent
                        confirmar={() => {
                           validateTransaction(h);
                        }}
                        nome={h.consumidor_name}
                        rejeitar={() => {
                           DeleteOrderTransaction(h.id);
                        }}
                        valor={h.valor / 100}
                     />
                  )}
               />
            </Box>
         </Modal>

         <Modal visible={modalStar.modal} animationType="fade" transparent>
            <StarModal
               setStars={h => setStar(h)}
               star={star}
               submit={handleStar}
               prestador={modalStar.nome}
            />
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

         {user.profile !== null ? (
            <Avatar source={{ uri: user.profile.avatar }} />
         ) : (
            <BoxIco>
               <Feather name="user" size={100} />
            </BoxIco>
         )}
         <TitleName> {user.nome} </TitleName>
         <View style={{ alignItems: 'center' }}>
            <ComprasText>Minhas Vendas</ComprasText>

            <BoxPrice>
               {valorGeb ? (
                  <TitlePrice>{valorGeb.priceUser}</TitlePrice>
               ) : (
                  <ActivityIndicator />
               )}
               <TitleP>{top} pts</TitleP>
            </BoxPrice>
         </View>
         <View style={{ alignSelf: 'center' }}>
            {valorGeb ? (
               <Text style={{ marginLeft: 16 }}>
                  Vendas do G.E.B {valorGeb.priceGeb}
               </Text>
            ) : (
               <Text style={{ marginLeft: 16 }}>
                  Vendas do G.E.B <ActivityIndicator />
               </Text>
            )}
         </View>
         <Line />
         {individualRak ? (
            <Classificacao
               ptCon={individualRak.compras.pontos}
               rkCon={individualRak.compras.rank}
               ptVen={individualRak.vendas.pontos}
               rkVen={individualRak.vendas.rank}
               ptInd={individualRak.indication.pontos}
               rkInd={individualRak.indication.ranck}
               ptPres={individualRak.presenca.pontos}
               rkPres={individualRak.presenca.rank}
               ptPad={individualRak.padrinho.pontos}
               rkPad={individualRak.padrinho.rank}
               ptB2b={individualRak.b2b.pontos}
               rkB2b={individualRak.b2b.rank}
            />
         ) : (
            <ActivityIndicator />
         )}
      </Container>
   );
}
