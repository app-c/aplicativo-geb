/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { useQuery } from 'react-query';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { Container } from './styles';
import { MembrosComponents } from '../../components/MembrosCompornents';
import { useAuth } from '../../hooks/AuthContext';
import { IProfileDto, IStars, IUserDtos } from '../../dtos';
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

   const { data, isLoading, isError, refetch } = useQuery('users', async () => {
      const data = await api.get('user/list-all-user');
      return data.data;
   });

   const hanldeTransaction = useCallback(
      (user: IUserDtos) => {
         navigate('Transaction', { prestador: user });
      },
      [navigate],
   );

   useFocusEffect(
      useCallback(() => {
         refetch();
      }, [refetch]),
   );

   const users =
      search.length > 0
         ? data.filter(h => {
              const up = h.nome.toLocaleUpperCase();
              return up.includes(search.toLocaleUpperCase());
           })
         : data;

   const list = React.useMemo(() => {
      const us: IUserDtos[] = [];
      users?.forEach((user: IUserDtos) => {
         let total = 1;
         if (user?.Stars) {
            total = user?.Stars?.length === 0 ? 1 : user?.Stars?.length;
         } else {
            total = 1;
         }
         let star = 0;

         user.Stars?.forEach((h: IStars) => {
            star += h.star;
         });
         const md = star / total;
         const value = Number(md.toFixed(0)) === 0 ? 5 : Number(md.toFixed(0));

         const data = {
            ...user,
            media: value,
         };

         us.push(data);
      });

      const rs = us
         .filter(h => h.id !== user.id)
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
            return 1;
         });

      return rs;
   }, [users]);

   if (isLoading) {
      return <Loading />;
   }

   return (
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
               data={list}
               keyExtractor={h => h.id}
               renderItem={({ item: h }) => (
                  <>
                     <MembrosComponents
                        star={h.media}
                        icon="necociar"
                        pres={() => hanldeTransaction(h)}
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
   );
}
