import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import fire from "@react-native-firebase/firestore";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import { ListMembro } from "../../../components/ListMembro";

import { Container, Title } from "./styles";
import { colecao } from "../../../collection";

interface PropsResponse {
  id: string;
  nome: string;
  avatarUrl: string;
}

export function DeletUser() {
  const [respnse, setResponse] = useState<PropsResponse[]>([]);
  const { goBack } = useNavigation();

  useEffect(() => {
    const load = fire()
      .collection(colecao.users)
      .onSnapshot(h => {
        const res = h.docs.map(p => p.data());
        setResponse(
          res.map(h => {
            return {
              id: h.id,
              nome: h.nome,
              avatarUrl: h.avatarUrl,
            };
          }),
        );
      });
    return () => load();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert("Aviso", "você está preste a excluir um membro", [
      {
        text: "Ok",
        onPress: () => {
          fire().collection("users").doc(id).delete();
        },
      },

      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  }, []);

  return (
    <Container>
      <HeaderContaponent
        title="Excluir um membro"
        onMessage="of"
        type="tipo1"
      />
      <View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={respnse}
          keyExtractor={h => h.id}
          renderItem={({ item: h }) => (
            <ListMembro
              confirmar="Excluir"
              avatar={h.avatarUrl}
              nome={h.nome}
              pres={() => {
                handleDelete(h.id);
              }}
              descartar={() => {
                goBack();
              }}
            />
          )}
        />
      </View>
    </Container>
  );
}
