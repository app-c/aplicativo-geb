/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
   Alert,
   FlatList,
   KeyboardAvoidingView,
   Modal,
   ScrollView,
   TouchableOpacity,
   View,
} from 'react-native';

import { Modalize } from 'react-native-modalize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { Box, Text, TextArea } from 'native-base';
import { HeaderContaponent } from '../../components/HeaderComponent';
import {
   BoxButton,
   BoxInput,
   BoxModal,
   Container,
   Input,
   TextButon,
   Title,
} from './styles';

import { IUserDto } from '../../dtos';
import { MembrosComponents } from '../../components/MembrosCompornents';
import { useAuth } from '../../hooks/AuthContext';
import { InputCasdastro } from '../../components/InputsCadastro';
import theme from '../../global/styles/theme';

export function Indicacoes() {
   const { user, orderIndicacao, listUser } = useAuth();
   const { navigate } = useNavigation();
   const [modal, setModal] = useState(false);

   // const [users, setUsers] = useState<IUserDto[]>([]);
   const [descricao, setDescricao] = useState('');
   const [userId, setUserId] = useState('');
   const [work, setWork] = useState('');
   const [nomeCliente, setNomeCliente] = useState('');
   const [telefoneCliente, setTelefoneCliente] = useState('');
   const [value, setValue] = useState('');
   const [lista, setLista] = useState<IUserDto[]>(
      listUser.filter(h => h.id !== user.id),
   );
   const [expoToken, setExpoToken] = React.useState('');

   const sendPushNotification = useCallback(async () => {
      const message = {
         to: expoToken,
         sound: 'default',
         title: 'VOCE FOI INDICADO',
         body: `Membro do geb ${user.nome} está indicando você para prestar um serviço`,
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(message),
      });
   }, [expoToken, user.nome]);

   const OpenModal = useCallback(
      (user_id: string, workName: string, token: string) => {
         setUserId(user_id);
         setWork(workName);
         setExpoToken(token);
         setModal(true);
      },
      [],
   );

   const handleOrderIndicaçao = useCallback(() => {
      setModal(false);

      orderIndicacao({
         userId,
         quemIndicou: user.id,
         quemIndicouName: user.nome,
         quemIndicouWorkName: user.workName,
         nomeCliente,
         telefoneCliente,
         descricao,
      });

      Alert.alert('Indicação', `Aguarde a validação da ${work}`, [
         {
            text: 'Ok',
            onPress: () => {
               sendPushNotification();
               navigate('INÍCIO');
            },
         },
      ]);
   }, [
      descricao,
      navigate,
      nomeCliente,
      orderIndicacao,
      sendPushNotification,
      telefoneCliente,
      user.id,
      user.nome,
      user.workName,
      userId,
      work,
   ]);

   useEffect(() => {
      const users = listUser.filter(h => h.id !== user.id);
      if (value === '') {
         setLista(users);
      } else {
         setLista(
            users.filter(h => {
               return h.nome.indexOf(value) > -1;
            }),
         );
      }
   }, [listUser, user.id, value]);

   return (
      <Container>
         <HeaderContaponent title="Indicar um membro" type="tipo1" />

         <Form>
            <Box mt="5">
               <InputCasdastro
                  name="find"
                  icon="search"
                  type="custom"
                  options={{ mask: '****************************' }}
                  onChangeText={text => setValue(text)}
                  value={value}
               />
            </Box>
         </Form>

         <FlatList
            data={lista}
            keyExtractor={h => h.id}
            renderItem={({ item: h }) => (
               <MembrosComponents
                  imageOfice={h.logoUrl}
                  oficio={h.workName}
                  user_avatar={h.avatarUrl}
                  icon="indicar"
                  userName={h.nome}
                  pres={() => OpenModal(h.id, h.workName, h.token)}
                  inativoPres={h.inativo}
                  inativo={h.inativo}
               />
            )}
         />

         <Modal
            onRequestClose={() => setModal(false)}
            visible={modal}
            animationType="slide"
            // transparent
         >
            <BoxModal>
               <ScrollView>
                  <Box>
                     <TouchableOpacity
                        onPress={() => setModal(false)}
                        style={{
                           backgroundColor: theme.colors.focus_second,
                           borderRadius: 10,
                           padding: 10,
                           width: 100,
                        }}
                     >
                        <Text>FECHAR</Text>
                     </TouchableOpacity>
                  </Box>
                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                     }}
                  >
                     <Title>Descriçao</Title>
                     <Title>{descricao.length}/100</Title>
                  </View>
                  <TextArea
                     borderRadius={10}
                     maxLength={100}
                     value={descricao}
                     onChangeText={h => setDescricao(h)}
                     fontFamily={theme.fonts.regular}
                     fontSize={14}
                  />

                  <BoxInput>
                     <Input
                        placeholder="Nome do cliente"
                        onChangeText={setNomeCliente}
                        value={nomeCliente}
                     />
                  </BoxInput>

                  <BoxInput>
                     <Input
                        placeholder="telefone do cliente"
                        onChangeText={setTelefoneCliente}
                        value={telefoneCliente}
                     />
                  </BoxInput>

                  <BoxButton onPress={handleOrderIndicaçao}>
                     <TextButon>enviar</TextButon>
                  </BoxButton>
               </ScrollView>
            </BoxModal>
         </Modal>
      </Container>
   );
}
