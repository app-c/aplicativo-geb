/* eslint-disable camelcase */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { add, format, isAfter, max } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import Firestore from '@react-native-firebase/firestore';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/AuthContext';
import {
   Box,
   ButtonValidar,
   Container,
   TextButtonValidar,
   Title,
} from './styles';

type Props = {
   user_id: string;
   presenca: boolean;
   createdAt: number;
   nome: string;
   avatar: string;
};

export function Valide() {
   const { user } = useAuth();
   const { navigate } = useNavigation();
   const [data, setData] = useState(
      format(new Date(Date.now()), 'dd/MM/yyyy - HH:mm'),
   );
   const [load, setLoad] = useState(false);
   const [presenca, setPresenca] = useState<Props[]>([]);

   const hanldeValidar = useCallback(async () => {
      const hour = new Date(2022, 6, 17, 6, 0, 0).getHours();
      const math = hour >= 6;

      if (presenca) {
         return Alert.alert(
            'Vocẽ não pode marcar presença mais de uma vez no mesmo horário',
         );
      }

      if (math === false) {
         return Alert.alert(
            'Você só pode marcar presença das 6:00 às 23:59 horas',
         );
      }

      Firestore()
         .collection('presença')
         .add({
            user_id: user.id,
            presenca: false,
            createdAt: new Date(Date.now()).getTime(),
            nome: user.nome,
            avatar: user.avatarUrl,
         })
         .finally(() => setLoad(false))
         .catch(err => console.log(err));
      setLoad(false);
      navigate('INÍCIO');
   }, [navigate, presenca, user.avatarUrl, user.id, user.nome]);

   useEffect(() => {
      const load = Firestore()
         .collection('presença')
         .onSnapshot(h => {
            const response = h.docs
               .map(h => h.data() as Props)
               .find(h => {
                  const hora = new Date(Date.now()).getHours();
                  const horaPresença = new Date(h.createdAt).getHours();

                  if (
                     h.user_id === user.id &&
                     h.presenca === false &&
                     hora === horaPresença
                  ) {
                     return h;
                  }
               });

            setPresenca(response);
         });

      return () => load();
   }, [user.id]);

   return (
      <Container>
         <HeaderContaponent title="Valide sua presença" type="tipo1" />

         <Box>
            <Title>{data} </Title>
         </Box>

         <ButtonValidar onPress={hanldeValidar}>
            {load ? (
               <Loading />
            ) : (
               <TextButtonValidar>validar</TextButtonValidar>
            )}
         </ButtonValidar>
      </Container>
   );
}
