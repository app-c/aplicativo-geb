/* eslint-disable camelcase */
import React, { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { useQuery } from 'react-query';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { Container } from './styles';
import { MembrosComponents } from '../../components/MembrosCompornents';
import { useAuth } from '../../hooks/AuthContext';
import { IStars, IUserDtos } from '../../dtos';
import { Box } from '../FindMembro/styles';
import { InputCasdastro } from '../../components/InputsCadastro';
import { Loading } from '../../components/Loading';
import { api } from '../../services/api';

export function B2B() {
   const { navigate } = useNavigation();
   const { user } = useAuth();

   const [value, setValue] = useState('');

   const { data, isLoading, isError } = useQuery('users', async () => {
      const data = await api.get('user/list-all-user');
      return data.data;
   });

   const hanldeTransaction = useCallback(
      (prestador: IUserDtos) => {
         navigate('orderB2b', { prestador });
      },
      [navigate],
   );

   const users =
      value.length > 0
         ? data.filter(h => {
              const up = h.nome.toLocaleUpperCase();
              return up.includes(value.toLocaleUpperCase());
           })
         : data;

   const list = React.useMemo(() => {
      const us = [];
      users?.forEach((user: IUserDtos) => {
         const i = 0;
         const total = user.Stars.length === 0 ? 1 : user.Stars.length;
         let star = 0;
         const st = [];

         user.Stars.forEach((h: IStars) => {
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
   }, [user, users]);

   if (isLoading) {
      <Loading />;
   }

   return (
      <Container>
         <HeaderContaponent type="tipo1" title="B2B" />

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

         <View style={{ paddingBottom: 350 }}>
            <FlatList
               data={list}
               keyExtractor={h => h.id}
               renderItem={({ item: h }) => (
                  <>
                     <MembrosComponents
                        star={h.media}
                        icon="b2b"
                        pres={() => hanldeTransaction(h)}
                        userName={h.nome}
                        user_avatar={h.profile.avatar}
                        oficio={h.profile.workName}
                        imageOfice={h.profile.logo}
                        // inativoPres={h.profile.inativo}
                        // inativo={h.profile.inativo}
                     />
                  </>
               )}
            />
         </View>
      </Container>
   );
}
