/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { AntDesign } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { FlatList } from 'react-native';
import fire from '@react-native-firebase/firestore';
import { ButonPost, Container, Flat } from './styles';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { ListPost } from '../../components/ListPost';
import theme from '../../global/styles/theme';
import { Loading } from '../../components/Loading';
import { colecao } from '../../collection';

export interface Res {
   id: string;
   descricao: string;
   post: string;
   like: number;
   nome: string;
   avater: string;
   data: number;
}
export function Home() {
   const navigation = useNavigation();

   const [post, setPost] = useState<Res[]>([]);
   const [state, setState] = useState(false);
   const [load, setLoad] = useState(true);

   const navigateToPost = useCallback(() => {
      navigation.navigate('Post');
   }, [navigation]);

   useEffect(() => {
      const asy = fire()
         .collection(colecao.post)
         .onSnapshot(h => {
            const post = h.docs
               .map(p => {
                  return {
                     id: p.id,
                     ...p.data(),
                  } as Res;
               })
               .sort((a, b) => {
                  return b.data - a.data;
               });

            setPost(post);
            setLoad(false);
         });

      return () => asy();
   }, []);

   const handleLike = useCallback(async (id: string) => {
      fire()
         .collection(colecao.post)
         .doc(id)
         .get()
         .then(h => {
            const { like } = h.data();
            fire()
               .collection(colecao.post)
               .doc(id)
               .update({
                  like: like + 1,
               });
         });
   }, []);

   return (
      <Container>
         <HeaderContaponent type="tipo1" title="POSTS" />

         {load ? (
            <Loading />
         ) : (
            <>
               <FlatList
                  data={post}
                  keyExtractor={h => h.id}
                  renderItem={({ item: h }) => (
                     <ListPost
                        state={state}
                        presLike={() => handleLike(h.id)}
                        avater={h.avater}
                        user_name={h.nome}
                        image={h.post}
                        descriçao={h.descricao}
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
