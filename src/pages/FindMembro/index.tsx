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
   const query = useQuery('users', async () => {
      const data = await api.get('user/list-all-user');
      return data.data;
   });

   const { data, isLoading } = query;

   console.log(query.isLoading, 'query');

   const { signOut } = useAuth();
   const [listAlluser, setlistAllUser] = useState<IUserDtos[]>([]);

   const [load, setLoad] = useState(true);
   const [search, setSearch] = React.useState('');

   const loadUser = React.useCallback(async () => {
      await api
         .get('user/list-all-user')
         .then(h => {
            const res = h.data as IUserDtos[];

            const us = res.map(user => {
               const { whats } = user.profile;

               // let ma = '';
               // if (h.links.maps) {
               //    const [c, l] = h.links.maps.split('https://').map(String);
               //    ma = l;
               // }
            });

            setlistAllUser(res);
         })
         .catch(h => {
            console.log('erro ao carregar user na lela localize os membros', h);

            const { message } = h.response.data;
            if (message === 'falta o token' || message === 'token expirou') {
               Alert.alert('Erro', 'Seu tokem expirou');
               signOut();
            }
         })
         .finally(() => setLoad(false));
   }, [signOut]);

   const handlePress = useCallback(async (url: string) => {
      await Linkin.openURL(`https://${url}`);
   }, []);

   const handleNavigateToWatts = useCallback(async (url: string) => {
      await Linkin.openURL(`https://wa.me/55${url}`);
   }, []);

   useFocusEffect(
      useCallback(() => {
         loadUser();
      }, [loadUser]),
   );

   const users =
      search.length > 0
         ? listAlluser.filter(h => {
              const up = h.nome.toLocaleUpperCase();
              return up.includes(search);
           })
         : listAlluser;

   const list = React.useMemo(() => {
      const us = [];
      const media = users.forEach(user => {
         let i = 0;
         const total = user.Stars.length === 0 ? 1 : user.Stars.length;
         let star = 0;
         const st = [];

         user.Stars.forEach((h: IStars) => {
            star += h.star;
         });
         const md = star / total;
         const value = Number(md.toFixed(0)) === 0 ? 1 : Number(md.toFixed(0));
         console.log(user.Stars);

         while (i < value) {
            i += 1;
            st.push(i);
         }

         const data = {
            ...user,
            media: value,
         };

         us.push(data);
      });

      return us;
   }, [users]);

   if (!listAlluser[0]) {
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
