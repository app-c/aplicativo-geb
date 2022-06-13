/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';

import { format } from 'date-fns';
import Firestore from '@react-native-firebase/firestore';
import { MessageComponent } from '../MessageComponent';
import { Bot, Container, Flat, Text } from './styles';
import { useAuth } from '../../hooks/AuthContext';

interface Props {
   closeModal: () => void;
}

export interface ResTransaction {
   id: string;
   prestador_id: string;
   consumidor: string;
   valor: string;
   description: string;
   nome: string;
}

export function Menssage({ closeModal }: Props) {
   const [trans, setTrans] = useState<ResTransaction[]>([]);
   const { user } = useAuth();

   useEffect(() => {
      const clear = Firestore()
         .collection('order_b2b')
         .onSnapshot(h => {
            const trans = h.docs.map(p => {
               return {
                  id: p.id,
                  ...p.data(),
               } as ResTransaction;
            });
            const res = trans.filter(h => h.prestador_id === user.id);

            setTrans(res);
         });

      return () => clear();
   }, [user.id]);

   const Confirmation = useCallback(
      async (prestador_id: string, descricao: string, id: string) => {
         Firestore()
            .collection('b2b')
            .add({
               prestador_id,
               descricao,
               createdAt: format(new Date(Date.now()), 'dd-MM-yyy-HH-mm'),
            });

         Firestore()
            .collection('order_transaction')
            .doc(id)
            .delete()
            .then(() => Alert.alert('Transação confirmada'));
      },
      [],
   );

   const DeleteTransaction = useCallback(async (id: string) => {
      Firestore()
         .collection('order_b2b')
         .doc(id)
         .delete()
         .then(() => Alert.alert('Transação deletada'));
   }, []);

   return (
      <Container>
         <Text>HELLO</Text>

         <FlatList
            data={trans}
            keyExtractor={h => h.id}
            renderItem={({ item: h }) => (
               <MessageComponent
                  confirmar={() => {
                     Confirmation(h.prestador_id, h.description, h.id);
                  }}
                  rejeitar={() => DeleteTransaction(h.id)}
                  nome={h.nome}
                  valor={h.valor}
               />
            )}
         />

         <Bot onPress={closeModal}>
            <Text>FECHAR</Text>
         </Bot>
      </Container>
   );
}
