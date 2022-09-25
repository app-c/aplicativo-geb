/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import fire from '@react-native-firebase/firestore';
import { View } from 'react-native';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { IUserDto } from '../../dtos';
import { useAuth } from '../../hooks/AuthContext';
import {
   BoxAvatar,
   BoxContainer,
   BoxEventos,
   BoxPosition,
   Container,
   Title,
} from './styles';
import { colecao } from '../../collection';
import { Loading } from '../../components/Loading';
import { B2B } from '../B2B';

type PropsTransaction = {
   compras: {
      nome: string;
      pontos: number;
      rank: number;
   }[];
   vendas: {
      nome: string;
      pontos: number;
      rank: number;
   }[];
};

export function Classificacao() {
   const { user } = useAuth();

   const [transaction, setTransaction] = useState<PropsTransaction[]>([]);

   const [load, setLoad] = useState(true);

   return (
      <Container>
         {load ? (
            <Loading />
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
                        <Title>{Saida.totalPontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{Saida.posicao}</Title>
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
                        <Title>{Entrada.totalPontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{Entrada.posicao}</Title>
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
                        <Title>{Indicacao.pontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{Indicacao.position}</Title>
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
                        <Title>{PresencaRanking.pontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{PresencaRanking.position}</Title>
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
                        <Title>{Padrinho.pontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{Padrinho.position}</Title>
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
                        <Title>{B2b.pontos}pts</Title>
                     </BoxContainer>

                     <BoxPosition>
                        <Title>{B2b.position}</Title>
                     </BoxPosition>
                  </View>
               </BoxEventos>
            </>
         )}
      </Container>
   );
}
