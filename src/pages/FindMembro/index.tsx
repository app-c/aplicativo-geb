import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Linking, View } from "react-native";
import { Form } from "@unform/mobile";
import * as Linkin from "expo-linking";
import fire from "@react-native-firebase/firestore";
import { FindMembroComponent } from "../../components/FindMembro";
import { IUserDto } from "../../dtos";
import { Box, Container, Flat, Title } from "./styles";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { InputCasdastro } from "../../components/InputsCadastro";
import { colecao } from "../../collection";
import { Loading } from "../../components/Loading";
import { useAuth } from "../../hooks/AuthContext";

export function FindUser() {
   const { user, listUser } = useAuth();
   const [membro, setMembro] = useState<IUserDto[]>([]);
   const [value, setValue] = useState("");
   const [lista, setLista] = useState<IUserDto[]>([]);
   const [load, setLoad] = useState(true);

   useEffect(() => {
      const us = listUser.map((h) => {
         const wa = `https://wa.me/55${h.whats.slice(1, 3)}${h.whats.slice(
            5,
            -5
         )}${h.whats.slice(-4)}`;

         let ma = "";
         if (h.links.maps) {
            const [c, l] = h.links.maps.split("https://").map(String);
            ma = l;
         }

         return {
            ...h,
            wa,
            map: ma,
         };
      });
      setMembro(us);
      setLoad(false);
   }, [listUser]);

   const handlePress = useCallback(async (url: string) => {
      await Linkin.openURL(`https://${url}`);
   }, []);

   const handleNavigateToWatts = useCallback(async (url: string) => {
      await Linkin.openURL(url);
   }, []);

   useEffect(() => {
      if (value === "") {
         setLista(membro);
      } else {
         setLista(
            membro
               .filter((h) => {
                  return h.nome.indexOf(value) > -1;
               })
               .sort()
         );
      }
   }, [membro, value]);

   return (
      <>
         {load ? (
            <Loading />
         ) : (
            <Container>
               <HeaderContaponent title="Localizar membros" type="tipo1" />

               <Form>
                  <Box>
                     <InputCasdastro
                        name="find"
                        icon="search"
                        type="custom"
                        options={{ mask: "****************************" }}
                        onChangeText={(text) => setValue(text)}
                        value={value}
                     />
                  </Box>
               </Form>

               <FlatList
                  // contentContainerStyle={{ paddingBottom: 150 }}
                  data={lista}
                  keyExtractor={(h) => h.id}
                  renderItem={({ item: h }) => (
                     <View>
                        <FindMembroComponent
                           avatar={h.avatarUrl}
                           name={h.nome}
                           workName={h.workName}
                           whats={() => handleNavigateToWatts(h.wa)}
                           face={() => handlePress(h.links.face)}
                           insta={() => handlePress(h.links.insta)}
                           maps={() => handlePress(h.map)}
                        />
                     </View>
                  )}
               />
            </Container>
         )}
      </>
   );
}
