/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
import React from "react";
import { Image, Text } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import theme from "../../global/styles/theme";
import negociosPng from "../../assets/NEGOCIOS.png";

import {
   Avatar,
   Box,
   BoxAvatar,
   BoxText,
   Container,
   ContainerIcon,
   ImageOfice,
   Title,
} from "./styles";

interface Props {
   userName: string;
   user_avatar: string;
   oficio: string;
   imageOfice: string;
   pres: () => void;
   icon?: "necociar" | "indicar" | "b2b";
   inativo?: boolean;
   inativoPres?: boolean;
}

export function MembrosComponents({
   userName,
   user_avatar,
   oficio,
   imageOfice,
   pres,
   icon,
   inativo,
   inativoPres,
}: Props) {
   return (
      <Container>
         <Box
            inativo={inativo}
            onPress={pres}
            disabled={inativoPres}
            style={{
               shadowColor: "#000",
               shadowOffset: {
                  width: 0,
                  height: 3,
               },
               shadowOpacity: 0.27,
               shadowRadius: 4.65,

               elevation: 6,
            }}
         >
            <BoxAvatar>
               <Avatar
                  source={{
                     uri:
                        user_avatar ||
                        "https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png",
                  }}
               />
               <ImageOfice source={{ uri: imageOfice }} />
            </BoxAvatar>

            <BoxText>
               <Title>{userName}</Title>
               <Text
                  style={{
                     fontFamily: theme.fonts.regular,
                     textAlign: "left",
                  }}
               >
                  {" "}
                  {oficio}{" "}
               </Text>
            </BoxText>

            <ContainerIcon>
               {icon === "necociar" && (
                  <>
                     <Image
                        style={{
                           width: 60,
                           height: 60,
                           marginTop: 10,
                        }}
                        source={negociosPng}
                     />
                  </>
               )}
               {icon === "indicar" && (
                  <>
                     <AntDesign
                        size={40}
                        name="swap"
                        color={theme.colors.focus}
                     />
                  </>
               )}

               {icon === "b2b" && (
                  <>
                     <FontAwesome5
                        name="users"
                        size={40}
                        color={theme.colors.focus}
                     />
                  </>
               )}
            </ContainerIcon>
         </Box>
      </Container>
   );
}
