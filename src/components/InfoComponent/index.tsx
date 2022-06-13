import React from "react";
import { Box, Container, Image, Title } from "./styles";
import logo from "../../assets/logo.png";

interface Props {
  pres: () => void;
}

export function InfoConponent({ pres }: Props) {
  return (
    <Container onPress={pres}>
      <Image source={logo} />
      <Box>
        <Title>Conheça o Geb</Title>
      </Box>
    </Container>
  );
}
