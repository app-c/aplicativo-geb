import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, View } from 'react-native';
import { Form } from '@unform/mobile';
import * as Linkin from 'expo-linking';
import fire from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { FindMembroComponent } from '../../components/FindMembro';
import { IProfileDto, IStars, IUserDtos } from '../../dtos';
import { Box, Container, Flat, Title } from './styles';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { InputCasdastro } from '../../components/InputsCadastro';
import { colecao } from '../../collection';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/AuthContext';
import { api } from '../../services/api';

export function FindUser() {
   const { user } = useAuth();
   const query = useQuery('users', async () => {
      const data = await api.get('user/list-all-user');
      return data.data;
   });

   const { data, isLoading, refetch } = query;

   const [search, setSearch] = React.useState('');

   const handlePress = useCallback(async (url: string) => {
      await Linkin.openURL(`https://${url}`);
   }, []);

   const handleNavigateToWatts = useCallback(async (url: string) => {
      await Linkin.openURL(`https://wa.me/55${url}`);
   }, []);

   useFocusEffect(
      useCallback(() => {
         refetch();
      }, [refetch]),
   );

   const users =
      search.length > 0
         ? data?.filter(h => {
              const up = h.nome.toLocaleUpperCase();
              return up.includes(search.toLocaleUpperCase());
           })
         : data;

   const list = React.useMemo(() => {
      const us = [];
      users?.forEach((user: IUserDtos) => {
         let total = 1;
         if (user?.Stars) {
            total = user?.Stars?.length === 0 ? 1 : user?.Stars?.length;
         } else {
            total = 1;
         }
         let star = 0;

         user?.Stars?.forEach((h: IStars) => {
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
   }, [user.id, users]);

   if (isLoading) {
      return <Loading />;
   }

   return (
      <Container>
         <HeaderContaponent title="Localizar membros" type="tipo1" />

         <Form>
            <Box>
               <InputCasdastro
                  name="find"
                  icon="search"
                  type="custom"
                  autoCapitalize="characters"
                  options={{ mask: '****************************' }}
                  onChangeText={setSearch}
               />
            </Box>
         </Form>

         <FlatList
            // contentContainerStyle={{ paddingBottom: 150 }}
            data={list}
            keyExtractor={h => h.id}
            renderItem={({ item: h }) => (
               <View>
                  <FindMembroComponent
                     star={h.media}
                     avatar={h?.profile?.avatar}
                     name={h.nome}
                     workName={h.profile.workName}
                     whats={() => {
                        handleNavigateToWatts(h.profile.whats);
                     }}
                     face={() => {}}
                     insta={() => {}}
                     maps={() => {}}
                  />
               </View>
            )}
         />
      </Container>
   );
}
