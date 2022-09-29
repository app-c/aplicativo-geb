import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, View } from 'react-native';
import { Form } from '@unform/mobile';
import * as Linkin from 'expo-linking';
import fire from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { FindMembroComponent } from '../../components/FindMembro';
import { IProfileDto, IUserDto, IUserDtos } from '../../dtos';
import { Box, Container, Flat, Title } from './styles';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { InputCasdastro } from '../../components/InputsCadastro';
import { colecao } from '../../collection';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/AuthContext';
import { api } from '../../services/api';

interface IUser {
   user: IUserDtos;
   profile: IProfileDto;
}

export function FindUser() {
   const [listAlluser, setlistAllUser] = useState<IUser[]>([]);
   const [membro, setMembro] = useState<IUserDto[]>([]);
   const [value, setValue] = useState('');
   const [lista, setLista] = useState<IUserDto[]>([]);
   const [load, setLoad] = useState(true);
   const [search, setSearch] = React.useState('');

   const loadUser = React.useCallback(async () => {
      await api
         .get('user/list-all-user')
         .then(h => {
            const res = h.data as IUser[];

            const us = res.map(h => {
               const wa = h.profile.whats
                  ? `https://wa.me/55${h.profile.whats.slice(
                       1,
                       3,
                    )}${h.profile.whats.slice(5, -5)}${h.profile.whats.slice(
                       -4,
                    )}`
                  : 'wahts';

               return {
                  user: {
                     ...h.user,
                  },
                  profile: {
                     ...h.profile,
                     whats: wa,
                  },
               };
               // let ma = '';
               // if (h.links.maps) {
               //    const [c, l] = h.links.maps.split('https://').map(String);
               //    ma = l;
               // }
            });
            console.log(us);

            setlistAllUser(us);
         })
         .catch(h => {
            console.log(h);
            // if (message === 'falta o token' || message === 'token expirou') {
            //    return Alert.alert('Erro', 'sem token');
            // }
         })
         .finally(() => setLoad(false));
   }, [setlistAllUser]);

   useEffect(() => {
      loadUser();
      //    let ma = '';
      //    if (h.links.maps) {
      //       const [c, l] = h.links.maps.split('https://').map(String);
      //       ma = l;
      //    }
   }, [loadUser]);

   const handlePress = useCallback(async (url: string) => {
      await Linkin.openURL(`https://${url}`);
   }, []);

   const handleNavigateToWatts = useCallback(async (url: string) => {
      await Linkin.openURL(url);
   }, []);

   useFocusEffect(
      useCallback(() => {
         loadUser();
      }, [loadUser]),
   );

   const users =
      search.length > 0
         ? listAlluser.filter(h => {
              const up = h.user.nome.toLocaleUpperCase();
              return up.includes(search);
           })
         : listAlluser;

   console.log(users);

   return (
      <>
         {load ? (
            <Loading />
         ) : (
            <Container>
               <HeaderContaponent title="Localizar membros" type="tipo1" />

               <Form>
                  <Box>
                     <InputCasdastro
                        name="find"
                        icon="search"
                        type="custom"
                        options={{ mask: '****************************' }}
                        onChangeText={setSearch}
                        value={value}
                     />
                  </Box>
               </Form>

               <FlatList
                  // contentContainerStyle={{ paddingBottom: 150 }}
                  data={users}
                  keyExtractor={h => h.user.id}
                  renderItem={({ item: h }) => (
                     <View>
                        <FindMembroComponent
                           avatar={h.profile.avatar}
                           name={h.user.nome}
                           workName={h.profile.workName}
                           whats={() => {}}
                           face={() => {}}
                           insta={() => {}}
                           maps={() => {}}
                        />
                     </View>
                  )}
               />
            </Container>
         )}
      </>
   );
}
