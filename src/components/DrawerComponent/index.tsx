/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from "react";

import {
   DrawerItemList,
   DrawerContentComponentProps,
} from "@react-navigation/drawer";

import {
   ActivityIndicator,
   Alert,
   ScrollView,
   Text,
   TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Box, HStack, VStack } from "native-base";
import { useAuth } from "../../hooks/AuthContext";
import {
   Avatar,
   Container,
   Header,
   LogOf,
   TextContainer,
   Title,
   TitleName,
} from "./styles";
import theme from "../../global/styles/theme";

type Props = DrawerContentComponentProps;

export function DrawerContent({ ...props }: Props) {
   const { signOut, user } = useAuth();

   const [loading, setLoading] = useState(false);

   return (
      <Container>
         <Header>
            <HStack maxW={200}>
               <Avatar source={{ uri: user.avatarUrl }} />
               <VStack ml={5}>
                  <Text
                     style={{ color: theme.colors.text, fontSize: RFValue(18) }}
                  >
                     Olá
                  </Text>
                  <TitleName>{user.nome} </TitleName>
               </VStack>
            </HStack>
         </Header>

         <ScrollView>
            <DrawerItemList {...props} />

            <LogOf
               onPress={() => {
                  signOut();
               }}
            >
               <Title style={{ color: theme.colors.text_secundary }}>
                  SAIR
               </Title>
            </LogOf>
         </ScrollView>
      </Container>
   );
}
