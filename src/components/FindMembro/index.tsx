import {
   Feather,
   FontAwesome,
   MaterialCommunityIcons,
   Zocial,
} from "@expo/vector-icons";
import { HStack } from "native-base";
import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";
import {
   Avatar,
   Box,
   Container,
   MapView,
   Title,
   TitleMaps,
   TitleName,
   TitleSocial,
} from "./styles";

interface Props {
   name: string;
   workName: string;
   face: () => void;
   insta: () => void;
   whats: () => void;
   maps: () => void;
   avatar: string;
}

export function FindMembroComponent({
   name,
   workName,
   face,
   insta,
   whats,
   maps,
   avatar,
}: Props) {
   return (
      <Container>
         <View style={{ flexDirection: "row" }}>
            <Avatar
               source={{
                  uri:
                     avatar ||
                     "https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png",
               }}
            />
            <View style={{ marginLeft: RFValue(10) }}>
               <TitleName>{name} </TitleName>
               <Title>{workName}</Title>
            </View>
         </View>

         <MapView onPress={maps}>
            <Feather
               name="map-pin"
               color={theme.colors.primary}
               size={RFValue(20)}
            />
            <TitleMaps>endereço</TitleMaps>
         </MapView>

         <Title>Midias sociais</Title>

         <HStack space={3} alignSelf="center">
            <Box onPress={whats}>
               <FontAwesome
                  name="whatsapp"
                  color={theme.colors.primary}
                  size={RFValue(16)}
               />
               <TitleSocial>Whatts</TitleSocial>
            </Box>

            <Box onPress={face}>
               <Zocial
                  name="facebook"
                  color={theme.colors.primary}
                  size={RFValue(16)}
               />

               <TitleSocial>Face </TitleSocial>
            </Box>

            <Box onPress={insta}>
               <Zocial
                  name="instagram"
                  color={theme.colors.primary}
                  size={RFValue(16)}
               />

               <TitleSocial>Insta</TitleSocial>
            </Box>

            <Box onPress={insta}>
               <MaterialCommunityIcons
                  name="web"
                  color={theme.colors.primary}
                  size={RFValue(16)}
               />

               <TitleSocial style={{ textAlign: "center" }}>WEB</TitleSocial>
            </Box>
         </HStack>
      </Container>
   );
}
