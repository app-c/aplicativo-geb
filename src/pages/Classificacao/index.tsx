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

interface PropsEntrada {
   createdAt: string;
   descricao: string;
   prestador_id: string;
   type: string;
   valor: string;
   pontosEntrada: number;
}

interface PropsSaida {
   createdAt: string;
   descricao: string;
   consumidor: string;
   type: string;
   valor: string;
   pontosSaida: number;
}

interface IQnt {
   qntPadrinho: number;
   qntPresenca: number;
   qntIndicacao: number;
   user_id: string;
   pontosPresença: number;
   pontosPadrinho: number;
   pontosIndicaçao: number;
}

export function Classificacao() {
   const { user } = useAuth();

   const [FindAllUser, setFindAllUsers] = useState<IUserDto[]>([]);
   const [findEntrada, setFindEntrada] = useState<PropsEntrada[]>([]);
   const [findSaida, setFindSaida] = useState<PropsSaida[]>([]);
   const [presenca, setPresenca] = useState<[]>([]);
   const [b2b, setB2b] = useState<[]>([]);

   const [load, setLoad] = useState(true);

   useEffect(() => {
      fire()
         .collection(colecao.users)
         .onSnapshot(h => {
            const res = h.docs.map(p => {
               return p.data() as IUserDto;
            });
            setFindAllUsers(res);
         });

      fire()
         .collection(colecao.transaction)
         .onSnapshot(h => {
            const trans = h.docs
               .map(p => p.data() as PropsEntrada)
               .filter(h => h.type === 'saida')
               .map(h => {
                  return {
                     ...h,
                     pontosSaida: 10,
                  };
               });

            setFindSaida(trans);
         });

      fire()
         .collection(colecao.presenca)
         .onSnapshot(res => {
            const re = res.docs.map(h => h.data());
            setPresenca(re);
         });

      fire()
         .collection('b2b')
         .onSnapshot(res => {
            const r = res.docs.map(h => h.data());
            setB2b(r);
         });
   }, [user.id]);

   const PresencaRanking = useMemo(() => {
      const data = FindAllUser.map(users => {
         const filtroPresença = presenca.filter(
            h => h.user_id === users.id && h.presenca === true,
         );
         const qntPresenca = filtroPresença.length;
         const pontos = filtroPresença.length * 10;
         return {
            user_id: users.id,
            qntPresenca,
            pontos,
         };
      })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         })
         .find(h => h.user_id === user.id);

      return data;
   }, [FindAllUser, presenca, user.id]);

   const Padrinho = useMemo(() => {
      const data = FindAllUser.map((users, index) => {
         const qntPadrinho = users.padrinhQuantity;
         const pontos = users.padrinhQuantity * 35;
         return {
            user_id: users.id,
            qntPadrinho,
            pontos,
         };
      })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         })
         .find(h => h.user_id === user.id);

      return data;
   }, [FindAllUser, user.id]);

   const Indicacao = useMemo(() => {
      const data = FindAllUser.map((users, index) => {
         const qntPadrinho = users.indicacao;
         const pontos = users.indicacao * 15;
         return {
            user_id: users.id,
            qntPadrinho,
            pontos,
         };
      })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         })
         .find(h => h.user_id === user.id);

      return data;
   }, [FindAllUser, user.id]);

   useEffect(() => {
      fire()
         .collection(colecao.transaction)
         .get()
         .then(h => {
            const trans = h.docs.map(p => {
               return p.data();
            });

            const fil = trans
               .filter(h => h.type === 'entrada')
               .map(h => {
                  return {
                     ...h,
                     pontosEntrada: 10,
                  };
               });
            setFindEntrada(fil);
         });
   }, []);

   const Entrada = useMemo(() => {
      const data = FindAllUser.map((user, i) => {
         const filtroConsumo = findEntrada.filter(h => {
            if (h.prestador_id === user.id) {
               return h;
            }
         });

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.pontosEntrada);
         }, 0);

         const total = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
         });

         return {
            id: user.id,
            nome: user.nome,
            valor,
            total,
            pontos: filtroConsumo.length * 10,
            totalPontos: pontos,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.totalPontos) - Number(a.totalPontos));

      const po = data
         .map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         })
         .find(h => h.id === user.id);

      // setLoad(false);

      return po;
   }, [FindAllUser, findEntrada, user.id]);

   const Saida = useMemo(() => {
      const data = FindAllUser.map((users, i) => {
         const filtroConsumo = findSaida.filter(h => {
            if (h.consumidor === users.id) {
               return h;
            }
         });

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.pontosSaida);
         }, 0);

         const total = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
         });

         return {
            id: users.id,
            nome: users.nome,
            valor,
            total,
            pontos: filtroConsumo.length * 10,
            totalPontos: pontos,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      const po = data
         .map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         })
         .find(h => h.id === user.id);

      return po;
   }, [FindAllUser, findSaida, user.id]);

   const B2b = useMemo(() => {
      const data = FindAllUser.map(users => {
         const b2bFiltro = b2b.filter(h => h.user_id === users.id);
         const qntB2b = b2bFiltro.length;
         const pontos = b2bFiltro.length * 20;
         return {
            user_id: users.id,
            qntB2b,
            pontos,
         };
      })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         })
         .find(h => h.user_id === user.id);

      return data;
   }, [FindAllUser, b2b, user.id]);

   useEffect(() => {
      setTimeout(() => {
         if (
            Entrada &&
            Saida &&
            PresencaRanking &&
            Padrinho &&
            Indicacao &&
            b2b
         ) {
            setLoad(false);
         }
      }, 1000);
   }, [Entrada, Saida, PresencaRanking, Padrinho, Indicacao, b2b]);

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
