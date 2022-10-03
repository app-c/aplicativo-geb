import React, { useCallback } from 'react';
import { NativeBaseProvider, Text, Box, Center } from 'native-base';
import { Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/AuthContext';
import { HeaderContaponent } from '../../components/HeaderComponent';
import theme from '../../global/styles/theme';

export function Padrinho() {
   const { user } = useAuth();
   const { navigate } = useNavigation();

   const handleApadrinhar = useCallback(
      (id: string) => {
         // fire()
         //    .collection(colecao.users)
         //    .doc(user.id)
         //    .get()
         //    .then(h => {
         //       const { padrinhQuantity } = h.data();
         //       fire()
         //          .collection(colecao.users)
         //          .doc(user.id)
         //          .update({
         //             padrinhQuantity: padrinhQuantity + 1,
         //          });
         //       fire().collection(colecao.users).doc(id).update({
         //          apadrinhado: true,
         //       });
         //    });
         // Alert.alert('APADRINHAMENTO', 'membro foi apadrinhado com sucesso!');
         // navigate('INÍCIO');
      },
      [navigate, user.id],
   );

   return (
      <NativeBaseProvider>
         <HeaderContaponent type="tipo1" title="APDRINHAMENTO" />
         <Center mt="100">
            <Text fontFamily={theme.fonts.blac}>EM MANUTENÇAO</Text>
         </Center>

         {/* <FlatList
            data={users}
            keyExtractor={h => h.id}
            renderItem={({ item: h }) => (
               <MembrosApadrinhado
                  imageOfice={h.logoUrl}
                  oficio={h.workName}
                  userName={h.nome}
                  user_avatar={h.avatarUrl}
                  pres={() => handleApadrinhar(h.id)}
                  inativoPres={h.apadrinhado}
                  inativo={h.apadrinhado}
               />
            )}
         /> */}
      </NativeBaseProvider>
   );
}
