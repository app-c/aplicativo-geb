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

interface PropResponse {
   compras: Tips[];
   vendas: Tips[];
   presenca: Tips[];
   indication: Tips[];
   b2b: Tips[];
}

interface Tips {
   id: string;
   nome: string;
   pontos: number;
   rank: number;
}

export function Classificacao() {
   const { user, signOut } = useAuth();

   const [ponts, setPonts] = React.useState<Props>();

   const [load, setLoad] = useState(true);

   const dados = React.useCallback(async () => {
      // !! TRANSACTION
      await api
         .get('user/global-rank')
         .then(h => {
            const rs = h.data as PropResponse;
            console.log(rs);
            const compras = rs.compras.find(h => h.id === user.id);
            const vendas = rs.compras.find(h => h.id === user.id);
            const presenca = rs.compras.find(h => h.id === user.id);
            const indication = rs.compras.find(h => h.id === user.id);
            const b2b = rs.b2b.find(h => h.id === user.id);

            const dados = {
               compras,
               vendas,
               presenca,
               indication,
               b2b,
            };

            setPonts(dados);
         })
         .catch(h => {
            console.log(h);
            const { message } = h.response.data;
            if (message === 'falta o token' || message === 'token expirou') {
               Alert.alert('Erro', 'Seu tokem expirou');
               signOut();
            }
         });
   }, [signOut, user]);

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
                        <Title>{ponts.compras.pontos} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{ponts.compras.rank}</Title>
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
                        <Title>{ponts.vendas.pontos} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{ponts.vendas.rank}</Title>
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
                        <Title>{}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{}</Title>
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
                        <Title>{ponts.presenca.pontos} pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{ponts.presenca.rank}</Title>
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
                        <Title>{}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{}</Title>
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
                        <Title>{ponts.b2b.pontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{ponts.b2b.rank}</Title>
                     </BoxPosition>
                  </View>
               </BoxEventos>
            </>
         )}
      </Container>
   );
}
