import React from "react";
import { Text } from "react-native";
import { Line } from "../MembroLista/styles";
import { Box, Container, Title } from "./styles";

type Props = {
   data: string;
   descricao: string;
   type: string;
   valor: string;
};

export function ExtratoModal({ data, descricao, type, valor }: Props) {
   return (
      <Container>
         <Box>
            <Title>data: </Title>
            <Text>{data}</Text>
         </Box>

         <Box>
            <Title>descrição: </Title>
            <Text>{descricao}</Text>
         </Box>

         <Box>
            <Title>tipo: </Title>
            <Text>{type}</Text>
         </Box>

         <Box>
            <Title>valor: </Title>
            <Text>{valor}</Text>
         </Box>

         <Line />
      </Container>
   );
}
