/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { format } from "date-fns";
import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";
import { FlatList, ScrollView, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import fire from "@react-native-firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import theme from "../../../global/styles/theme";
import { locale } from "../../../utils/LocalStrigMoney";
import {
   Box,
   BoxClassificacao,
   BoxFiltro,
   BoxLista,
   Container,
   TitleFiltro,
   TitleList,
   TitleType,
} from "./styles";
import { IUserDto } from "../../../dtos";
import { Loading } from "../../../components/Loading";
import { ExtratoModal } from "../../../components/ExtratoModal";
import { useAuth } from "../../../hooks/AuthContext";
import { colecao } from "../../../collection";

interface IPropsTransaction {
   createdAt: string;
   descricao: string;
   prestador_id?: string;
   consumidor?: string;
   type: string;
   valor: string;
   ponto: number;
}

interface IQnt {
   qntPadrinho: number;
   qntPresenca: number;
   qntIndicacao: number;
   user_id: string;
   nome: string;
   workName: string;
}

interface PropsB2b {
   data: string;
   id: string;
   prestador_id: string;
   user_id: string;
   pontos: number;
}

export function Ranking() {
   const modalEntradaSaida = useRef<Modalize>(null);
   const [type, setType] = useState("entrada");
   const [filtro, setFiltro] = useState("mes");
   const [Users, setUsers] = useState<IUserDto[]>([]);
   const [responsePresenca, setResponsePresenca] = useState<[]>([]);
   const [findSaida, setFindSaida] = useState<IPropsTransaction[]>([]);
   const [findEntrada, setFindEntrada] = useState<IPropsTransaction[]>([]);
   const [extrato, setExtrato] = useState<IPropsTransaction[]>([]);
   const [extratoUser, setExtratoUser] = useState<IPropsTransaction[]>([]);
   const [b2b, setB2b] = useState<PropsB2b[]>([]);

   const [qntGeral, setQntGeral] = useState<IQnt[]>([]);
   const [load, setLoad] = useState(true);

   // todo entrada ...................
   useEffect(() => {
      const us = fire()
         .collection(colecao.users)
         .onSnapshot((h) => {
            const res = h.docs.map((p) => {
               return p.data() as IUserDto;
            });
            setUsers(res);
         });

      const trans = fire()
         .collection(colecao.transaction)
         .onSnapshot((h) => {
            const trans = h.docs
               .map((p) => p.data() as IPropsTransaction)
               .filter((h) => h.type === "entrada")
               .map((h) => {
                  return {
                     ...h,
                     ponto: 10,
                  };
               });

            setFindEntrada(trans);
         });

      return () => {
         us();
         trans();
      };
   }, []);

   const Entrada = useMemo(() => {
      const dataNowMes = new Date(Date.now()).getMonth() + 1;
      const dataNowAno = new Date(Date.now()).getFullYear();

      const filterMes = findEntrada.filter((p) => {
         const [dia, mes, ano] = p.createdAt.split("-").map(Number);
         if (mes === dataNowMes) {
            return p;
         }
      });

      const filterAno = findEntrada.filter((p) => {
         const [dia, mes, ano] = p.createdAt.split("-").map(Number);
         if (ano === dataNowAno) {
            return p;
         }
      });

      const dataMes = Users.map((users, i) => {
         const filtroConsumo = filterMes.filter((h) => {
            if (h.prestador_id === users.id) {
               return h;
            }
         });

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.ponto);
         }, 0);

         const total = Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
         });

         return {
            id: users.id,
            nome: users.nome,
            valor,
            total,
            pontos,
            workName: users.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      const dataAno = Users.map((user, i) => {
         const filtroConsumo = filterAno.filter((h) => {
            if (h.prestador_id === user.id) {
               return h;
            }
         });

         const filtroData = filtroConsumo.find(
            (h) => h.prestador_id === user.id
         )!;

         const dataF = filtroData?.createdAt;

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.ponto);
         }, 0);

         const total = Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
         });

         return {
            id: user.id,
            nome: user.nome,
            valor,
            total,
            pontos,
            data: dataF,
            workName: user.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      const dataTodos = Users.map((user, i) => {
         const filtroConsumo = findEntrada.filter((h) => {
            if (h.prestador_id === user.id) {
               return h;
            }
         });

         const filtroData = filtroConsumo.find(
            (h) => h.prestador_id === user.id
         )!;

         const dataF = filtroData?.createdAt;

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.ponto);
         }, 0);

         const total = Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
         });

         return {
            id: user.id,
            nome: user.nome,
            valor,
            total,
            pontos,
            data: dataF,
            workName: user.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      if (filtro === "mes") {
         return dataMes.map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         });
      }

      if (filtro === "ano") {
         return dataAno.map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         });
      }

      if (filtro === "todos") {
         return dataTodos.map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         });
      }
   }, [Users, filtro, findEntrada]);

   // todo Saida ........................
   useEffect(() => {
      const trans = fire()
         .collection(colecao.transaction)
         .onSnapshot((h) => {
            const trans = h.docs
               .map((p) => p.data() as IPropsTransaction)
               .filter((h) => h.type === "saida")
               .map((h) => {
                  return {
                     ...h,
                     ponto: 10,
                  };
               });

            setFindSaida(trans);
         });

      return () => trans();
   }, []);

   const Saida = useMemo(() => {
      const dataNowMes = new Date(Date.now()).getMonth() + 1;
      const dataNowAno = new Date(Date.now()).getFullYear();

      const filterMes = findSaida.filter((p) => {
         const [dia, mes, ano] = p.createdAt.split("-").map(Number);
         if (mes === dataNowMes) {
            return p;
         }
      });

      const filterAno = findSaida.filter((p) => {
         const [dia, mes, ano] = p.createdAt.split("-").map(Number);
         if (ano === dataNowAno) {
            return p;
         }
      });

      const dataMes = Users.map((users, i) => {
         const filtroConsumo = filterMes.filter((h) => {
            if (h.consumidor === users.id) {
               return h;
            }
         });

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.ponto);
         }, 0);

         const total = Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
         });

         return {
            id: users.id,
            nome: users.nome,
            valor,
            total,
            pontos,
            workName: users.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      const dataAno = Users.map((user, i) => {
         const filtroConsumo = filterAno.filter((h) => {
            if (h.consumidor === user.id) {
               return h;
            }
         });

         const filtroData = filtroConsumo.find(
            (h) => h.prestador_id === user.id
         )!;

         const dataF = filtroData?.createdAt;

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.ponto);
         }, 0);

         const total = Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
         });

         return {
            id: user.id,
            nome: user.nome,
            valor,
            total,
            pontos,
            data: dataF,
            workName: user.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      const dataTodos = Users.map((user, i) => {
         const filtroConsumo = filterAno.filter((h) => {
            if (h.consumidor === user.id) {
               return h;
            }
         });

         const filtroData = filtroConsumo.find(
            (h) => h.prestador_id === user.id
         )!;

         const dataF = filtroData?.createdAt;

         const valor = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.valor);
         }, 0);

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.ponto);
         }, 0);

         const total = Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
         });

         return {
            id: user.id,
            nome: user.nome,
            valor,
            total,
            pontos,
            data: dataF,
            workName: user.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      if (filtro === "mes") {
         return dataMes.map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         });
      }

      if (filtro === "ano") {
         return dataAno.map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         });
      }

      if (filtro === "todos") {
         return dataTodos.map((h, i) => {
            const po = i + 1;
            return {
               ...h,
               posicao: `${po}º`,
            };
         });
      }
   }, [Users, filtro, findSaida]);

   // todo extrato entrada e saida ..................
   useEffect(() => {
      fire()
         .collection(colecao.transaction)
         .get()
         .then((h) => {
            const trans = h.docs.map((p) => p.data() as IPropsTransaction);
            setExtrato(trans);
         });
   }, []);

   const Extrato = useCallback(
      (user_id: string) => {
         const re = extrato.filter((h) => {
            if (h.consumidor === user_id || h.prestador_id === user_id) {
               return h;
            }
         });
         setExtratoUser(
            re.map((h) => {
               const [dia, mes, ano, hora, min] = h.createdAt
                  .split("-")
                  .map(Number);
               return {
                  createdAt: `${dia}/${mes}/${ano} - ${hora}:${min}`,
                  type: h.type,
                  descricao: h.descricao,
                  valor: h.valor,
               };
            })
         );
         modalEntradaSaida.current.open();
      },
      [extrato]
   );

   // todo extrato presenca

   // todo ............................

   useEffect(() => {
      const prs = fire()
         .collection(colecao.presenca)
         .onSnapshot((h) => {
            const res = h.docs.map((h) => h.data());
            setResponsePresenca(res);
         });

      return () => prs();
   }, []);

   useEffect(() => {
      const pres = Users.map((h, i) => {
         const presen = responsePresenca.filter((p) => h.id === p.user_id);
         return {
            qntPadrinho: h.padrinhQuantity,
            qntPresenca: presen.length + 2,
            qntIndicacao: h.indicacao,
            user_id: h.id,
            nome: h.nome,
            workName: h.workName,
         };
      });

      setQntGeral(pres);
   }, [Users, responsePresenca]);

   const PresencaRanking = useMemo(() => {
      const data = Users.map((users, index) => {
         const filtroPresença = responsePresenca.filter(
            (h) => h.user_id === users.id && h.presenca === true
         );
         const qntPresenca = filtroPresença.length;
         const pontos = filtroPresença.length * 10;
         return {
            user_id: users.id,
            qntPresenca,
            pontos,
            nome: users.nome,
            workName: users.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         });

      return data;
   }, [Users, responsePresenca]);

   const Padrinho = useMemo(() => {
      const data = Users.map((users, index) => {
         const qntPadrinho = users.padrinhQuantity;
         const pontos = users.padrinhQuantity * 35;
         return {
            user_id: users.id,
            qntPadrinho,
            pontos,
            nome: users.nome,
            workName: users.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         });

      return data;
   }, [Users]);

   const Indicacao = useMemo(() => {
      const data = Users.map((users, index) => {
         const qntPadrinho = users.indicacao;
         const pontos = users.indicacao * 15;
         return {
            user_id: users.id,
            qntPadrinho,
            pontos,
            nome: users.nome,
            workName: users.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => {
            return b.pontos - a.pontos;
         })
         .map((h, i) => {
            return {
               ...h,
               position: `${i + 1}º`,
            };
         });

      return data;
   }, [Users]);

   // todo B2B ..............................................................

   useEffect(() => {
      const b2b = fire()
         .collection("b2b")
         .onSnapshot((h) => {
            const res = h.docs.map((p) => {
               return {
                  pontos: 20,
                  ...p.data(),
               } as PropsB2b;
            });

            setB2b(res);
         });

      return () => b2b();
   }, []);

   const DataB2b = useMemo(() => {
      const dataB2b = Users.map((user, i) => {
         const filtroConsumo = b2b.filter((h) => {
            if (h.prestador_id === user.id) {
               return h;
            }
         });

         const pontos = filtroConsumo.reduce((acc, item) => {
            return acc + Number(item.pontos);
         }, 0);

         return {
            id: user.id,
            nome: user.nome,
            pontos,
            workName: user.workName,
         };
      })
         .sort((a, b) => {
            if (a.nome < b.nome) {
               return -1;
            }
         })
         .sort((a, b) => Number(b.pontos) - Number(a.pontos));

      return dataB2b.map((h, i) => {
         const po = i + 1;
         return {
            ...h,
            posicao: `${po}º`,
         };
      });
   }, [Users, b2b]);

   useEffect(() => {
      setTimeout(() => {
         if (Entrada && Saida) {
            setLoad(false);
         }
      }, 1000);
   }, [Entrada, Saida]);

   return (
      <Container>
         <HeaderContaponent type="tipo1" title="Classificação" />
         {load ? (
            <Loading />
         ) : (
            <>
               <Modalize ref={modalEntradaSaida}>
                  {extratoUser.map((h) => (
                     <View key={h.createdAt}>
                        <ExtratoModal
                           data={h.createdAt}
                           descricao={h.descricao}
                           type={h.type}
                           valor={h.valor}
                        />
                     </View>
                  ))}
               </Modalize>
               <View
                  style={{
                     flexDirection: "row",
                     padding: 25,
                  }}
               >
                  <ScrollView horizontal>
                     <Box
                        type={type === "entrada"}
                        onPress={() => setType("entrada")}
                     >
                        <TitleType type={type === "entrada"}>VENDAS</TitleType>
                     </Box>

                     <Box
                        type={type === "saida"}
                        onPress={() => setType("saida")}
                     >
                        <TitleType type={type === "saida"}>COMPRAS</TitleType>
                     </Box>

                     <Box
                        type={type === "indicaçao"}
                        onPress={() => setType("indicaçao")}
                     >
                        <TitleType type={type === "indicaçao"}>
                           Indicações
                        </TitleType>
                     </Box>

                     <Box
                        type={type === "presença"}
                        onPress={() => setType("presença")}
                     >
                        <TitleType type={type === "presença"}>
                           Presença
                        </TitleType>
                     </Box>

                     <Box
                        type={type === "padrinho"}
                        onPress={() => setType("padrinho")}
                     >
                        <TitleType type={type === "padrinho"}>
                           Padrinho
                        </TitleType>
                     </Box>

                     <Box type={type === "b2b"} onPress={() => setType("b2b")}>
                        <TitleType type={type === "padrinho"}>B2B</TitleType>
                     </Box>
                  </ScrollView>
               </View>

               {type === "entrada" && (
                  <View
                     style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: RFValue(36),
                     }}
                  >
                     <BoxFiltro
                        onPress={() => setFiltro("mes")}
                        filtro={filtro === "mes"}
                     >
                        <TitleFiltro filtro={filtro === "mes"}>MES</TitleFiltro>
                     </BoxFiltro>

                     <BoxFiltro
                        onPress={() => setFiltro("ano")}
                        filtro={filtro === "ano"}
                     >
                        <TitleFiltro filtro={filtro === "ano"}>Ano</TitleFiltro>
                     </BoxFiltro>

                     <BoxFiltro
                        onPress={() => setFiltro("todos")}
                        filtro={filtro === "todos"}
                     >
                        <TitleFiltro filtro={filtro === "todos"}>
                           Todos
                        </TitleFiltro>
                     </BoxFiltro>
                  </View>
               )}

               {type === "saida" && (
                  <View
                     style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: RFValue(36),
                     }}
                  >
                     <BoxFiltro
                        onPress={() => setFiltro("mes")}
                        filtro={filtro === "mes"}
                     >
                        <TitleFiltro filtro={filtro === "mes"}>MES</TitleFiltro>
                     </BoxFiltro>

                     <BoxFiltro
                        onPress={() => setFiltro("ano")}
                        filtro={filtro === "ano"}
                     >
                        <TitleFiltro filtro={filtro === "ano"}>Ano</TitleFiltro>
                     </BoxFiltro>

                     <BoxFiltro
                        onPress={() => setFiltro("todos")}
                        filtro={filtro === "todos"}
                     >
                        <TitleFiltro filtro={filtro === "todos"}>
                           Todos
                        </TitleFiltro>
                     </BoxFiltro>
                  </View>
               )}

               <View style={{ marginTop: RFValue(20), paddingBottom: 200 }}>
                  {type === "entrada" && (
                     <FlatList
                        data={Entrada}
                        keyExtractor={(h) => h.id}
                        renderItem={({ item: h }) => (
                           <TouchableOpacity
                              onPress={() => Extrato(h.id)}
                              style={{
                                 paddingBottom: 20,
                                 marginTop: 10,
                              }}
                           >
                              <BoxLista>
                                 <BoxClassificacao>
                                    <TitleList
                                       style={{
                                          fontSize: 26,
                                          color: theme.colors.text_secundary,
                                       }}
                                    >
                                       {h.posicao}
                                    </TitleList>
                                 </BoxClassificacao>

                                 <View
                                    style={{
                                       flex: 1,
                                       marginLeft: 20,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(20),
                                          fontFamily: theme.fonts.blac,
                                       }}
                                    >
                                       {" "}
                                       {h.nome}{" "}
                                    </TitleList>
                                    <TitleList> {h.workName} </TitleList>
                                 </View>

                                 <View
                                    style={{
                                       alignItems: "center",
                                       flex: 1,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(16),
                                          fontFamily: theme.fonts.blac,
                                          textAlign: "center",
                                       }}
                                    >
                                       Pontuação
                                    </TitleList>
                                    <TitleList>{h.pontos} pts</TitleList>
                                 </View>
                              </BoxLista>
                           </TouchableOpacity>
                        )}
                     />
                  )}

                  {type === "saida" && (
                     <FlatList
                        data={Saida}
                        keyExtractor={(h) => h.id}
                        renderItem={({ item: h }) => (
                           <View
                              style={{
                                 paddingBottom: 20,
                                 marginTop: 10,
                              }}
                           >
                              <BoxLista>
                                 <BoxClassificacao>
                                    <TitleList
                                       style={{
                                          fontSize: 26,
                                          color: theme.colors.text_secundary,
                                       }}
                                    >
                                       {h.posicao}
                                    </TitleList>
                                 </BoxClassificacao>
                                 <View
                                    style={{
                                       flex: 1,
                                       marginLeft: 20,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(20),
                                          fontFamily: theme.fonts.blac,
                                       }}
                                    >
                                       {" "}
                                       {h.nome}{" "}
                                    </TitleList>
                                    <TitleList> {h.workName} </TitleList>
                                 </View>

                                 <View
                                    style={{
                                       alignItems: "center",
                                       flex: 1,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(16),
                                          fontFamily: theme.fonts.blac,
                                          textAlign: "center",
                                       }}
                                    >
                                       Pontuação
                                    </TitleList>
                                    <TitleList>{h.pontos} pts</TitleList>
                                 </View>
                              </BoxLista>
                           </View>
                        )}
                     />
                  )}

                  {type === "indicaçao" && (
                     <FlatList
                        data={Indicacao}
                        keyExtractor={(h) => h.user_id}
                        renderItem={({ item: h }) => (
                           <View
                              style={{
                                 paddingBottom: 20,
                                 marginTop: 10,
                              }}
                           >
                              <BoxLista>
                                 <BoxClassificacao>
                                    <TitleList
                                       style={{
                                          fontSize: 26,
                                          color: theme.colors.text_secundary,
                                       }}
                                    >
                                       {h.position}
                                    </TitleList>
                                 </BoxClassificacao>
                                 <View
                                    style={{
                                       flex: 1,
                                       marginLeft: 20,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(20),
                                          fontFamily: theme.fonts.blac,
                                       }}
                                    >
                                       {" "}
                                       {h.nome}{" "}
                                    </TitleList>
                                    <TitleList> {h.workName} </TitleList>
                                 </View>

                                 <View
                                    style={{
                                       alignItems: "center",
                                       flex: 1,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(16),
                                          fontFamily: theme.fonts.blac,
                                          textAlign: "center",
                                       }}
                                    >
                                       Pontuação
                                    </TitleList>
                                    <TitleList>{h.pontos} pts </TitleList>
                                 </View>
                              </BoxLista>
                           </View>
                        )}
                     />
                  )}

                  {type === "presença" && (
                     <FlatList
                        data={PresencaRanking}
                        keyExtractor={(h) => h.user_id}
                        renderItem={({ item: h }) => (
                           <View
                              style={{
                                 paddingBottom: 20,
                                 marginTop: 10,
                              }}
                           >
                              <BoxLista>
                                 <BoxClassificacao>
                                    <TitleList
                                       style={{
                                          fontSize: 26,
                                          color: theme.colors.text_secundary,
                                       }}
                                    >
                                       {h.position}
                                    </TitleList>
                                 </BoxClassificacao>
                                 <View
                                    style={{
                                       flex: 1,
                                       marginLeft: 20,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(20),
                                          fontFamily: theme.fonts.blac,
                                       }}
                                    >
                                       {" "}
                                       {h.nome}{" "}
                                    </TitleList>
                                    <TitleList> {h.workName} </TitleList>
                                 </View>

                                 <View
                                    style={{
                                       alignItems: "center",
                                       flex: 1,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(16),
                                          fontFamily: theme.fonts.blac,
                                          textAlign: "center",
                                       }}
                                    >
                                       Pontuação
                                    </TitleList>
                                    <TitleList>{h.pontos} pts</TitleList>
                                 </View>
                              </BoxLista>
                           </View>
                        )}
                     />
                  )}

                  {type === "padrinho" && (
                     <FlatList
                        data={Padrinho}
                        keyExtractor={(h) => h.user_id}
                        renderItem={({ item: h }) => (
                           <View
                              style={{
                                 paddingBottom: 20,
                                 marginTop: 10,
                              }}
                           >
                              <BoxLista>
                                 <BoxClassificacao>
                                    <TitleList
                                       style={{
                                          fontSize: 26,
                                          color: theme.colors.text_secundary,
                                       }}
                                    >
                                       {h.position}
                                    </TitleList>
                                 </BoxClassificacao>
                                 <View
                                    style={{
                                       flex: 1,
                                       marginLeft: 20,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(20),
                                          fontFamily: theme.fonts.blac,
                                       }}
                                    >
                                       {" "}
                                       {h.nome}{" "}
                                    </TitleList>
                                    <TitleList> {h.workName} </TitleList>
                                 </View>

                                 <View
                                    style={{
                                       alignItems: "center",
                                       flex: 1,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(16),
                                          fontFamily: theme.fonts.blac,
                                          textAlign: "center",
                                       }}
                                    >
                                       Pontos
                                    </TitleList>
                                    <TitleList>{h.pontos} </TitleList>
                                 </View>
                              </BoxLista>
                           </View>
                        )}
                     />
                  )}

                  {type === "b2b" && (
                     <FlatList
                        data={DataB2b}
                        keyExtractor={(h) => h.id}
                        renderItem={({ item: h }) => (
                           <View
                              style={{
                                 paddingBottom: 20,
                                 marginTop: 10,
                              }}
                           >
                              <BoxLista>
                                 <BoxClassificacao>
                                    <TitleList
                                       style={{
                                          fontSize: 26,
                                          color: theme.colors.text_secundary,
                                       }}
                                    >
                                       {h.posicao}
                                    </TitleList>
                                 </BoxClassificacao>
                                 <View
                                    style={{
                                       flex: 1,
                                       marginLeft: 20,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(20),
                                          fontFamily: theme.fonts.blac,
                                       }}
                                    >
                                       {" "}
                                       {h.nome}{" "}
                                    </TitleList>
                                    <TitleList> {h.workName} </TitleList>
                                 </View>

                                 <View
                                    style={{
                                       alignItems: "center",
                                       flex: 1,
                                    }}
                                 >
                                    <TitleList
                                       style={{
                                          fontSize: RFValue(16),
                                          fontFamily: theme.fonts.blac,
                                          textAlign: "center",
                                       }}
                                    >
                                       Pontos
                                    </TitleList>
                                    <TitleList>{h.pontos} </TitleList>
                                 </View>
                              </BoxLista>
                           </View>
                        )}
                     />
                  )}
               </View>
            </>
         )}
      </Container>
   );
}
