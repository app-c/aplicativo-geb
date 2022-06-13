/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import fire from '@react-native-firebase/firestore';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { Container } from './styles';
import { MembrosComponents } from '../../components/MembrosCompornents';
import { useAuth } from '../../hooks/AuthContext';
import { IUserDto } from '../../dtos';
import { Box } from '../FindMembro/styles';
import { InputCasdastro } from '../../components/InputsCadastro';
import { colecao } from '../../collection';
import { Loading } from '../../components/Loading';

export function Membros() {
   const { navigate } = useNavigation();
   const { user, listUser } = useAuth();

   const [membros, setMembros] = useState<IUserDto[]>([]);
   const [value, setValue] = useState('');
   const [lista, setLista] = useState<IUserDto[]>([]);
   const [load, setLoad] = useState(true);

   const hanldeTransaction = useCallback(
      (
         prestador_id: string,
         avatar_url: string,
         logoUrl: string,
         nome: string,
         workName: string,
         token: string,
      ) => {
         navigate('Transaction', {
            prestador_id,
            avatar_url,
            logoUrl,
            nome,
            workName,
            token,
         });
      },
      [navigate],
   );

   useFocusEffect(
      useCallback(() => {
         const us = listUser.sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         });
         setMembros(us);
         setLoad(false);
      }, []),
   );

   useEffect(() => {
      if (value === '') {
         setLista(membros);
      } else {
         setLista(
            membros.filter(h => {
               return h.nome.indexOf(value) > -1;
            }),
         );
      }
   }, [membros, value]);

   return (
      <>
         {load ? (
            <Loading />
         ) : (
            <Container>
               <HeaderContaponent type="tipo1" title="MEMBROS" />

               <Form>
                  <Box>
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

               <View>
                  <FlatList
                     contentContainerStyle={{ paddingBottom: 570 }}
                     data={lista}
                     keyExtractor={h => h.id}
                     renderItem={({ item: h }) => (
                        <>
                           <MembrosComponents
                              icon="necociar"
                              pres={() =>
                                 hanldeTransaction(
                                    h.id,
                                    h.avatarUrl,
                                    h.logoUrl,
                                    h.nome,
                                    h.workName,
                                    h.token,
                                 )
                              }
                              userName={h.nome}
                              user_avatar={h.avatarUrl}
                              oficio={h.workName}
                              imageOfice={h.logoUrl}
                              inativoPres={h.inativo}
                              inativo={h.inativo}
                           />
                        </>
                     )}
                  />
               </View>
            </Container>
         )}
      </>
   );
}
