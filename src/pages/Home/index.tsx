/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { AntDesign } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Alert, FlatList } from 'react-native';
import fire from '@react-native-firebase/firestore';
import { ButonPost, Container, Flat } from './styles';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { ListPost } from '../../components/ListPost';
import theme from '../../global/styles/theme';
import { Loading } from '../../components/Loading';
import { colecao } from '../../collection';
import { IProfileDto, IUserDtos } from '../../dtos';
import { api } from '../../services/api';

export interface Res {
   id: string;
   descricao: string;
   post: string;
   like: number;
   nome: string;
   avater: string;
   data: number;
}
interface IPosts {
   id: string;
   image: string;
   like: number;
   description: string;
   user_id: string;
   created_at: Date;
   nome: string;
   avatar: string;
}

export function Home() {
   const navigation = useNavigation();

   const [post, setPost] = useState<IPosts[]>([]);
   const [state, setState] = useState(false);
   const [load, setLoad] = useState(true);

   const navigateToPost = useCallback(() => {
      navigation.navigate('Post');
   }, [navigation]);

   const posts = React.useCallback(async () => {
      await api
         .get('/post/')
         .then(h => {
            const rs = h.data;
            const fil = rs.filter(p => p !== null);
            setPost(fil);
         })
         .catch(h => {
            console.log('erro ao carregar post na lela home', h);
            Alert.alert('Erro', h.response.message);
         })
         .finally(() => setLoad(false));
   }, []);

   useFocusEffect(
      useCallback(() => {
         posts();
      }, []),
   );

   const handleLike = useCallback(async (id: string) => {}, []);

   const postUsers = post
      ? post.map(pst => pst)
      : [
           {
              id: '1',
              image: '',
              like: 0,
              description: '',
              user_id: '',
              created_at: new Date(),
              nome: '',
              avatar: '',
           },
        ];

   console.log(post);

   return (
      <Container>
         <HeaderContaponent type="tipo1" title="POSTS" />

         {load ? (
            <Loading />
         ) : (
            <>
               <FlatList
                  data={postUsers}
                  keyExtractor={p => p.id}
                  renderItem={({ item: h }) => (
                     <ListPost
                        state={state}
                        presLike={() => handleLike(h.id)}
                        avater={h.avatar}
                        user_name={h.nome}
                        image={h.image}
                        descriçao={h.description}
                        like={h.like}
                     />
                  )}
               />
               <ButonPost onPress={navigateToPost}>
                  <AntDesign
                     name="plus"
                     size={35}
                     color={theme.colors.primary}
                  />
               </ButonPost>
            </>
         )}
      </Container>
   );
}
