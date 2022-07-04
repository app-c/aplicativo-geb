/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import fire from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderContaponent } from '../../../components/HeaderComponent';
import { MembrosComponents } from '../../../components/MembrosCompornents';
import { Container, Title, Touch } from './styles';
import { colecao } from '../../../collection';
import { IUserDto } from '../../../dtos';

export function Inativo() {
   const [users, setUsers] = useState<IUserDto[]>([]);

   const handleInativar = useCallback((id: string, inativo: boolean) => {
      fire().collection(colecao.users).doc(id).update({
         inativo: !inativo,
      });
   }, []);

   useEffect(() => {
      const load = fire()
         .collection('users')
         .onSnapshot(dados => {
            const us = dados.docs
               .map(h => h.data() as IUserDto)
               .sort((a, b) => {
                  if (a.nome < b.nome) {
                     return -1;
                  }
               });
            setUsers(us);
         });
      return () => load();
   }, []);

   // React.useEffect(() => {
   //    for (let i = 0; i < users.length; i += 1) {
   //       const { id } = users[i];
   //       fire().collection('users').doc(id).update({
   //          padrinhQuantity: 0,
   //       });
   //    }
   // }, [users]);

   return (
      <Container>
         <HeaderContaponent title="Inativar um membro" type="tipo1" />

         <FlatList
            data={users}
            keyExtractor={h => h.id}
            renderItem={({ item: h }) => (
               <MembrosComponents
                  userName={h.nome}
                  user_avatar={h.avatarUrl}
                  oficio={h.workName}
                  imageOfice={h.logoUrl}
                  pres={() => {
                     handleInativar(h.id, h.inativo);
                  }}
                  inativo={h.inativo}
               />
            )}
         />
      </Container>
   );
}
