import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import { format } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';
import fire from '@react-native-firebase/firestore';
import { HeaderContaponent } from '../../components/HeaderComponent';
import {
   Box,
   BoxInput,
   BoxTextInput,
   Buton,
   Container,
   Input,
   TextBoton,
   Title,
} from './styles';
import { useAuth } from '../../hooks/AuthContext';
import { InputText } from '../Transaction/styles';
import { OrderNavigationIndication } from '../../@types/navigation';
import { IUserDto } from '../../dtos';
import { colecao } from '../../collection';

export function Indication() {
   const { user } = useAuth();
   const { quemIndicou, id } = useRoute().params as OrderNavigationIndication;
   const { reset } = useNavigation();

   const [description, setDescription] = useState('');
   const [valor, setValor] = useState('');
   const moneyRef = useRef(null);
   const [mon, setMon] = useState(0);

   const handleFecharNegocio = useCallback(() => {
      if (!description) {
         return Alert.alert('Transação', 'Falta a descrição');
      }

      if (!valor || valor === '0.00') {
         return Alert.alert('Transação', 'Falta o valor');
      }

      fire()
         .collection(colecao.transaction)
         .add({
            prestador_id: user.id,
            descricao: description,
            type: 'entrada',
            valor: String(mon),
            createdAt: format(new Date(Date.now()), 'dd-MM-yyy-HH-mm'),
         })
         .then(() => {
            fire().collection(colecao.orderIndication).doc(id).delete();

            fire()
               .collection(colecao.users)
               .doc(quemIndicou)
               .get()
               .then(h => {
                  let { indicacao } = h.data() as IUserDto;

                  fire()
                     .collection(colecao.users)
                     .doc(quemIndicou)
                     .update({
                        indicacao: (indicacao += 1),
                     });
               })
               .catch(err =>
                  Alert.alert(
                     'Algo deu errado',
                     'dados do usuário nao recuperado',
                  ),
               );
            Alert.alert('Transação', 'Transação realizada com sucesso!');
         })
         .catch(err =>
            Alert.alert('Algo deu errado!', 'transação nao concluida'),
         );

      fire()
         .collection('sucess_indication')
         .add({
            createdAt: format(new Date(Date.now()), 'dd/MM - HH:mm'),
            nome: user.nome,
            quemIndicou,
         });

      reset({
         routes: [{ name: 'INÍCIO' }],
      });
   }, [description, id, mon, quemIndicou, reset, user.id, user.nome, valor]);

   useEffect(() => {
      const mo = moneyRef.current?.getRawValue();
      setMon(mo);
   }, [valor]);

   return (
      <Container>
         <HeaderContaponent title="Fechar negocio da indicação" type="tipo1" />

         <Box>
            <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
               }}
            >
               <Title>Descrição</Title>
               <Title>{description.length}/14</Title>
            </View>
            <BoxTextInput>
               <Input
                  onChangeText={setDescription}
                  value={description}
                  maxLength={14}
               />
            </BoxTextInput>

            <Title style={{ marginTop: 10, marginLeft: 10 }}>Valor</Title>
            <BoxInput>
               <InputText
                  type="money"
                  options={{
                     precision: 2,
                     separator: '.',
                     delimiter: ',',
                     unit: '',
                  }}
                  keyboardType="numeric"
                  onChangeText={setValor}
                  multiline
                  value={valor}
                  placeholder="Valor consumido R$"
               />
            </BoxInput>

            <Buton onPress={handleFecharNegocio}>
               <TextBoton>ENVIAR</TextBoton>
            </Buton>
         </Box>
      </Container>
   );
}
