/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/AuthContext';
import {
   BoxContainer,
   BoxEventos,
   BoxPosition,
   Container,
   Title,
} from './styles';
import { api } from '../../services/api';

interface Props {
   compras: Tips;
   vendas: Tips;
   presenca: Tips;
   indication: Tips;
   b2b: Tips;
}

interface Tips {
   id: string;
   nome: string;
   pontos: number;
   rank: number;
}

interface IProps {
   ptCon: number;
   rkCon: number;
   ptVen: number;
   rkVen: number;
   ptInd: number;
   rkInd: number;
   ptPres: number;
   rkPres: number;
   ptPad: number;
   rkPad: number;
   ptB2b: number;
   rkB2b: number;
}

export function Classificacao({
   ptCon,
   rkCon,
   ptVen,
   rkVen,
   ptInd,
   rkInd,
   ptPres,
   rkPres,
   ptPad,
   rkPad,
   ptB2b,
   rkB2b,
}: IProps) {
   const { user, signOut } = useAuth();

   const [ponts, setPonts] = React.useState<Props>();

   const [load, setLoad] = useState(true);

   const dados = React.useCallback(async () => {
      // !! TRANSACTION
      await api
         .get('user/global-rank-ind')
         .then(h => {
            const rs = h.data as Props;

            setPonts(rs);
         })
         .catch(h => {
            const { message } = h.response.data;
            if (message === 'falta o token' || message === 'token expirou') {
               Alert.alert('Erro', 'Seu tokem expirou');
               signOut();
            }
         });
   }, [signOut]);

   React.useEffect(() => {
      if (ponts) {
         setLoad(false);
      }
   }, [ponts]);

   useFocusEffect(
      useCallback(() => {
         dados();
      }, [dados]),
   );

   if (!ponts) {
      return <ActivityIndicator />;
   }

   return (
      <Container>
         {load ? (
            <ActivityIndicator size="large" />
         ) : (
            <>
               <BoxEventos>
                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                     }}
                  >
                     <BoxContainer>
                        <Title>COMPRAS</Title>
                        <Title>{ptCon} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{rkCon}</Title>
                     </BoxPosition>
                  </View>

                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                     }}
                  >
                     <BoxContainer>
                        <Title>VENDAS</Title>
                        <Title>{ptVen} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{rkVen}</Title>
                     </BoxPosition>
                  </View>

                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                     }}
                  >
                     <BoxContainer>
                        <Title>Indicações</Title>
                        <Title>{ptInd} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{rkInd}</Title>
                     </BoxPosition>
                  </View>

                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                     }}
                  >
                     <BoxContainer>
                        <Title>Presença</Title>
                        <Title>{ptPres} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{rkPres}</Title>
                     </BoxPosition>
                  </View>

                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                     }}
                  >
                     <BoxContainer>
                        <Title>Padrinho</Title>
                        <Title>{ptPad}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{rkPad}</Title>
                     </BoxPosition>
                  </View>

                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                     }}
                  >
                     <BoxContainer>
                        <Title>B2B</Title>
                        <Title>{ptB2b}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{rkB2b}</Title>
                     </BoxPosition>
                  </View>
               </BoxEventos>
            </>
         )}
      </Container>
   );
}
