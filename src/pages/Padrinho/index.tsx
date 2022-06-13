import React, { useCallback } from "react";
import { NativeBaseProvider, Text, Box } from "native-base";
import { Alert, FlatList } from "react-native";
import fire from "@react-native-firebase/firestore";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useAuth } from "../../hooks/AuthContext";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { MembrosComponents } from "../../components/MembrosCompornents";
import { colecao } from "../../collection";

export function Padrinho() {
   const { listUser } = useAuth();
   const { navigate } = useNavigation();

   const handleApadrinhar = useCallback(
      (id: string) => {
         fire()
            .collection(colecao.users)
            .doc(id)
            .get()
            .then((h) => {
               const { padrinhQuantity } = h.data();
               fire()
                  .collection(colecao.users)
                  .doc(id)
                  .update({
                     padrinhQuantity: padrinhQuantity + 1,
                  });
            });

         Alert.alert("APADRINHAMENTO", "membro foi apadrinhado com sucesso!");
         navigate("INÍCIO");
      },
      [navigate]
   );

   return (
      <NativeBaseProvider>
         <HeaderContaponent type="tipo1" title="APDRINHAMENTO" />

         <FlatList
            data={listUser}
            keyExtractor={(h) => h.id}
            renderItem={({ item: h }) => (
               <MembrosComponents
                  imageOfice={h.logoUrl}
                  oficio={h.workName}
                  userName={h.nome}
                  user_avatar={h.avatarUrl}
                  pres={() => handleApadrinhar(h.id)}
               />
            )}
         />
      </NativeBaseProvider>
   );
}
