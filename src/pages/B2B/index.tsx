/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import fire from '@react-native-firebase/firestore';
import { Form } from '@unform/mobile';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { Container } from './styles';
import { MembrosComponents } from '../../components/MembrosCompornents';
import { useAuth } from '../../hooks/AuthContext';
import { IProfileDto, IUserDtos } from '../../dtos';
import { Box } from '../FindMembro/styles';
import { InputCasdastro } from '../../components/InputsCadastro';
import { colecao } from '../../collection';
import { Loading } from '../../components/Loading';
import { api } from '../../services/api';

type UserProps = {
   user: IUserDtos;
   profile: IProfileDto;
};

export function B2B() {
   const { navigate } = useNavigation();
   const { user } = useAuth();

   const [value, setValue] = useState('');
   const [lista, setLista] = useState<UserProps[]>([]);
   const [allUser, setAllUser] = useState<UserProps[]>([]);
   const [load, setLoad] = useState(false);

   const hanldeTransaction = useCallback(
      (
         prestador_id: string,
         avatar_url: string,
         logoUrl: string,
         nome: string,
         workName: string,
      ) => {
         navigate('orderB2b', {
            prestador_id,
            avatar_url,
            logoUrl,
            nome,
            workName,
         });
      },
      [navigate],
   );

   const Users = React.useCallback(async () => {
      await api
         .get('/user/list-all-user')
         .then(h => {
            setAllUser(h.data);
         })
         .finally(() => setLoad(true))
         .catch(err => {
            console.log(err.response.data);
         });
   }, []);

   useFocusEffect(
      useCallback(() => {
         Users();
      }, [Users]),
   );

   useEffect(() => {
      if (value === '') {
         setLista(allUser);
      } else {
         setLista(
            lista.filter(h => {
               return h.user.nome.indexOf(value) > -1;
            }),
         );
      }
   }, [allUser, lista, value]);

   return (
      <>
         {load ? (
            <Loading />
         ) : (
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
                     data={lista}
                     keyExtractor={h => h.id}
                     renderItem={({ item: h }) => (
                        <>
                           <MembrosComponents
                              icon="b2b"
                              pres={() =>
                                 hanldeTransaction(
                                    h.user.id,
                                    h.profile.avatar,
                                    h.profile.logo,
                                    h.user.nome,
                                    h.profile.workName,
                                 )
                              }
                              userName={h.user.nome}
                              user_avatar={h.profile.avatar}
                              oficio={h.profile.workName}
                              imageOfice={h.profile.logo}
                              inativoPres={h.profile.inativo}
                              inativo={h.profile.inativo}
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
