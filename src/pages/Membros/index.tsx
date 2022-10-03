/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
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
import { IProfileDto, IUserDto, IUserDtos } from '../../dtos';
import { Box } from '../FindMembro/styles';
import { InputCasdastro } from '../../components/InputsCadastro';
import { colecao } from '../../collection';
import { Loading } from '../../components/Loading';
import { api } from '../../services/api';

interface PropsUser {
   user: IUserDtos;
   profile: IProfileDto;
}

export function Membros() {
   const { navigate } = useNavigation();
   const { user } = useAuth();

   const [membros, setMembros] = useState<IUserDtos[]>([]);
   const [load, setLoad] = useState(true);
   const [search, setSearch] = React.useState('');

   const hanldeTransaction = useCallback(
      (
         prestador_id: string,
         avatar_url: string,
         logoUrl: string,
         prestador_name: string,
         consumidor_name: string,
         workName: string,
         token: string,
      ) => {
         navigate('Transaction', {
            prestador_id,
            avatar_url,
            logoUrl,
            prestador_name,
            consumidor_name,
            workName,
            token,
         });
      },
      [navigate],
   );

   const Users = React.useCallback(async () => {
      api.get('/user/list-all-user')
         .then(h => {
            const us = h.data as IUserDtos[];
            const fil = us.filter(p => p.id !== user.id);
            console.log(us);
            setMembros(fil);
         })
         .catch(h => console.log('list membros', h))
         .finally(() => setLoad(false));
   }, [user]);

   useFocusEffect(
      useCallback(() => {
         Users();
         setLoad(false);
      }, [Users]),
   );

   const users =
      search.length > 0
         ? membros.filter(h => {
              const up = h.nome.toLocaleUpperCase();
              return up.includes(search);
           })
         : membros;

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
                        onChangeText={setSearch}
                     />
                  </Box>
               </Form>

               <View>
                  <FlatList
                     contentContainerStyle={{ paddingBottom: 570 }}
                     data={users}
                     keyExtractor={h => h.id}
                     renderItem={({ item: h }) => (
                        <>
                           <MembrosComponents
                              icon="necociar"
                              pres={() =>
                                 hanldeTransaction(
                                    h.id,
                                    h.profile.avatar,
                                    h.profile.logo,
                                    h.nome,
                                    user.nome,
                                    h.profile.workName,
                                    h.token,
                                 )
                              }
                              userName={h.nome}
                              user_avatar={h.profile.avatar}
                              oficio={h.profile.workName}
                              imageOfice={h.profile.logo}
                              // inativoPres={h..inativo}
                              // inativo={h.inativo}
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
