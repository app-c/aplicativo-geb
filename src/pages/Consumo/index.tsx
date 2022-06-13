/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, TextInput, View } from "react-native";
import { format, getMonth, getYear } from "date-fns";

import { useFocusEffect } from "@react-navigation/native";

import fire from "@react-native-firebase/firestore";
import {
  BoxFiltros,
  BoxFiltroTouch,
  BoxTotal,
  BoxTypeTransaction,
  BoxTypeTransactionTouch,
  Container,
  Flat,
  Text,
  TextFiltro,
  TextTypeTransaction,
} from "./styles";
import { ListConsumo } from "../../components/ListConsumo";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { useAuth } from "../../hooks/AuthContext";
import { locale } from "../../utils/LocalStrigMoney";
import { IUserDto } from "../../dtos";
import theme from "../../global/styles/theme";
import { colecao } from "../../collection";

export interface PropTransactions {
  id: string;
  prestador_id: string;
  consumidor: string;
  descricao: string;
  type: "entrada" | "saida";
  valor: string;
  createdAt: string;
}

interface IQntGeral {
  qntPadrinho: number;
  qntPresenca: number;
  qntIndicacao: number;
  user_id: string;
}

interface IIndication {
  id: string;
  posicao: string;
  qntPosicao: number;
}

type Presença = {
  nome: string;
  data: string;
  status: string;
};

export function Consumo() {
  const [response, setResponse] = useState<PropTransactions[]>([]);
  const [type, setType] = useState("entrada");
  const [filtro, setFiltro] = useState("mes");
  const [presenca, setPresenca] = useState<Presença[]>([]);
  const [indicacao, setIndicacao] = useState<IIndication>();
  const [qntGeral, setQntGeral] = useState<IQntGeral[]>([]);
  const [qntB2b, setQntB2b] = useState<[]>([]);

  const { user } = useAuth();

  //* *..........................................................................

  useEffect(() => {
    const load = fire()
      .collection(colecao.transaction)
      .onSnapshot(p => {
        const cons = p.docs.map(h => {
          return {
            id: h.id,
            ...h.data(),
          } as PropTransactions;
        });
        setResponse(cons);
      });

    const b2b = fire()
      .collection("b2b")
      .onSnapshot(res => {
        const r = res.docs
          .map(h => h.data())
          .filter(h => h.user_id === user.id);
        setQntB2b(r);
      });

    return () => {
      load();
      b2b();
    };
  }, []);
  //* *..........................................................................

  // todo VENDA ................................................................
  const venda = useMemo(() => {
    return response.filter(h => {
      return h.prestador_id === user.id;
    });
  }, [response, user.id]);

  const formatedVenda = useMemo(() => {
    const res = venda.filter(h => {
      const [dia, mes, ano, hora, menutos] = h.createdAt.split("-").map(Number);

      const month = new Date(Date.now()).getMonth() + 1;
      const year = new Date(Date.now()).getFullYear();
      const day = new Date(Date.now()).getDate();
      if (filtro === "mes" && month === mes) {
        return {
          ...h,
        };
      }

      if (filtro === "ano" && ano === year) {
        return {
          ...h,
        };
      }

      if (filtro === "todos") {
        return {
          ...h,
        };
      }
    });
    return res.map(h => {
      const [dia, mes, ano, hora, menutos] = h.createdAt.split("-").map(Number);
      const total = Number(h.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return {
        ...h,
        total,
        data: `${dia}/${mes}/${ano}`,
      };
    });
  }, [venda, filtro]);

  // todo ......................................................................

  const Consumidor = useMemo(() => {
    return response.filter(h => {
      return h.consumidor === user.id;
    });
  }, [response, user.id]);

  const formatedConsumidor = useMemo(() => {
    const res = Consumidor.filter(h => {
      const [dia, mes, ano, hora, menutos] = h.createdAt.split("-").map(Number);

      const month = new Date(Date.now()).getMonth() + 1;
      const year = new Date(Date.now()).getFullYear();
      const day = new Date(Date.now()).getDate();

      if (filtro === "mes" && month === mes) {
        return {
          ...h,
        };
      }

      if (filtro === "ano" && ano === year) {
        return {
          ...h,
        };
      }

      if (filtro === "todos") {
        return {
          ...h,
        };
      }
    });

    return res.map(h => {
      const [dia, mes, ano, hora, menutos] = h.createdAt.split("-").map(Number);
      const total = Number(h.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return {
        ...h,
        total,
        data: `${dia}/${mes}/${ano}`,
      };
    });
  }, [Consumidor, filtro]);

  const handleTotalPrestador = useMemo(() => {
    const tota = formatedVenda.reduce((acc, ind) => {
      return acc + Number(ind.valor);
    }, 0);
    const no = Number(tota).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return no;
  }, [formatedVenda]);

  const handleTotalConsumidor = useMemo(() => {
    const tota = formatedConsumidor.reduce((acc, ind) => {
      return acc + Number(ind.valor);
    }, 0);

    return locale(String(tota));
  }, [formatedConsumidor]);

  const QntGeral = useCallback(async () => {
    fire()
      .collection(colecao.users)
      .get()
      .then(res => {
        const users = res.docs.map(h => {
          return h.data() as IUserDto;
        });

        fire()
          .collection(colecao.presenca)
          .get()
          .then(res => {
            const data = res.docs
              .map(h => h.data())
              .filter(p => p.user_id === user.id && p.presenca === true);

            const resP = res.docs
              .map(h => h.data())
              .filter(p => p.user_id === user.id);

            setPresenca(
              resP.map(h => {
                return {
                  nome: h.nome,
                  data: format(new Date(h.createdAt), "dd/MM/yyyy - HH:mm"),
                  status: h.presenca ? "validado" : "pendente",
                };
              }),
            );

            const filter = users.map(h => {
              const p = data.length + 2;
              return {
                qntPadrinho: h.padrinhQuantity,
                qntPresenca: p,
                qntIndicacao: h.indicacao,
                user_id: h.id,
              };
            });

            setQntGeral(filter);
          });
      });
  }, [user.id]);

  useEffect(() => {
    fire()
      .collection(colecao.users)
      .get()
      .then(h => {
        const res = h.docs.map(p => p.data() as IUserDto);

        const formatedUser = res.map((h, i) => {
          return {
            id: h.id,
            posicao: `${i + 1}º`,
            qntPosicao: h.indicacao,
          };
        });

        const indication = formatedUser.find(h => h.id === user.id);
        setIndicacao(indication);
      });
  }, [user.id]);

  const ranking = useMemo(() => {
    const qnt = qntGeral.find(h => h.user_id === user.id);

    return qnt;
  }, [qntGeral, user.id]);

  useFocusEffect(
    useCallback(() => {
      QntGeral();
    }, [QntGeral]),
  );

  return (
    <Container>
      <HeaderContaponent type="tipo1" title="Extrato" />

      <View style={{ height: 70 }}>
        <ScrollView
          horizontal
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            height: 70,
          }}
        >
          <BoxTypeTransaction>
            <BoxTypeTransactionTouch
              type={type === "entrada"}
              onPress={() => setType("entrada")}
            >
              <TextTypeTransaction type={type === "entrada"}>
                Entrada
              </TextTypeTransaction>
            </BoxTypeTransactionTouch>

            <BoxTypeTransactionTouch
              type={type === "saida"}
              onPress={() => setType("saida")}
            >
              <TextTypeTransaction type={type === "saida"}>
                Saida
              </TextTypeTransaction>
            </BoxTypeTransactionTouch>

            <BoxTypeTransactionTouch
              type={type === "indicaçao"}
              onPress={() => setType("indicaçao")}
            >
              <TextTypeTransaction type={type === "indicaçao"}>
                Indicações
              </TextTypeTransaction>
            </BoxTypeTransactionTouch>

            <BoxTypeTransactionTouch
              type={type === "presença"}
              onPress={() => setType("presença")}
            >
              <TextTypeTransaction type={type === "presença"}>
                Presença
              </TextTypeTransaction>
            </BoxTypeTransactionTouch>

            <BoxTypeTransactionTouch
              type={type === "padrinho"}
              onPress={() => setType("padrinho")}
            >
              <TextTypeTransaction type={type === "padrinho"}>
                Padrinho
              </TextTypeTransaction>
            </BoxTypeTransactionTouch>

            <BoxTypeTransactionTouch
              type={type === "b2b"}
              onPress={() => setType("b2b")}
            >
              <TextTypeTransaction type={type === "b2b"}>
                B2B
              </TextTypeTransaction>
            </BoxTypeTransactionTouch>
          </BoxTypeTransaction>
        </ScrollView>
      </View>

      {type === "entrada" && (
        <BoxFiltros>
          <BoxFiltroTouch
            filtro={filtro === "mes"}
            onPress={() => setFiltro("mes")}
          >
            <TextFiltro filtro={filtro === "mes"}>Mes</TextFiltro>
          </BoxFiltroTouch>

          <BoxFiltroTouch
            filtro={filtro === "ano"}
            onPress={() => setFiltro("ano")}
          >
            <TextFiltro filtro={filtro === "ano"}>Ano</TextFiltro>
          </BoxFiltroTouch>

          <BoxFiltroTouch
            filtro={filtro === "todos"}
            onPress={() => setFiltro("todos")}
          >
            <TextFiltro filtro={filtro === "todos"}>Todos</TextFiltro>
          </BoxFiltroTouch>
        </BoxFiltros>
      )}

      {type === "saida" && (
        <BoxFiltros>
          <BoxFiltroTouch
            filtro={filtro === "mes"}
            onPress={() => setFiltro("mes")}
          >
            <TextFiltro filtro={filtro === "mes"}>Mes</TextFiltro>
          </BoxFiltroTouch>

          <BoxFiltroTouch
            filtro={filtro === "ano"}
            onPress={() => setFiltro("ano")}
          >
            <TextFiltro filtro={filtro === "ano"}>Ano</TextFiltro>
          </BoxFiltroTouch>

          <BoxFiltroTouch
            filtro={filtro === "todos"}
            onPress={() => setFiltro("todos")}
          >
            <TextFiltro filtro={filtro === "todos"}>Todos</TextFiltro>
          </BoxFiltroTouch>
        </BoxFiltros>
      )}

      <BoxTotal>
        <Text>Total</Text>
        {type === "entrada" && <Text>{handleTotalPrestador}</Text>}
        {type === "saida" && <Text>{handleTotalConsumidor}</Text>}
        {type === "indicaçao" && <Text>{ranking.qntIndicacao}</Text>}
        {type === "presença" && <Text>{ranking.qntPresenca}</Text>}
        {type === "padrinho" && <Text>{ranking.qntPadrinho}</Text>}
        {type === "b2b" && <Text>{qntB2b.length}</Text>}
      </BoxTotal>

      {type === "entrada" && (
        <Flat
          data={formatedVenda}
          keyExtractor={h => h.id}
          renderItem={({ item: h }) => (
            <View>
              <ListConsumo
                descricao={h.descricao}
                valor={h.total}
                data={h.data}
              />
            </View>
          )}
        />
      )}

      {type === "saida" && (
        <Flat
          data={formatedConsumidor}
          keyExtractor={h => h.id}
          renderItem={({ item: h }) => (
            <View>
              <ListConsumo
                descricao={h.descricao}
                valor={h.total}
                data={h.data}
              />
            </View>
          )}
        />
      )}

      {type === "presença" && (
        <View style={{ marginTop: 24, flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            data={presenca}
            keyExtractor={h => h.data}
            renderItem={({ item: h }) => (
              <View
                style={{
                  backgroundColor: theme.colors.focus_light,
                  marginTop: 16,
                  padding: 20,
                }}
              >
                <Text style={{ fontSize: 16 }}>{h.nome}</Text>
                <Text style={{ fontSize: 16 }}>{h.data}</Text>
                <Text style={{ fontSize: 16 }}>{h.status}</Text>
              </View>
            )}
          />
        </View>
      )}
    </Container>
  );
}
