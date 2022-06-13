import React from "react";
import { View } from "react-native";
import { Line } from "../MembroLista/styles";
import {
  BoxButon,
  ButonCancel,
  ButonOk,
  Container,
  Description,
  TextButon,
  Title,
} from "./styles";

interface Prps {
  description: string;
  clientName: string;
  telefone: string;
  failTransaction: () => void;
  handShak: () => void;
  quemIndicouName: string;
  quemIndicouWorkName: string;
}

export function ModalOrderIndication({
  description,
  clientName,
  quemIndicouName,
  quemIndicouWorkName,
  telefone,
  failTransaction,
  handShak,
}: Prps) {
  return (
    <Container>
      <Title>
        {quemIndicouName} da empresa {quemIndicouWorkName} idicou voce para
        fazer negócios com {clientName} {"\n"}
      </Title>

      <Description>descrição: {description}</Description>
      <Description>nome: {clientName},</Description>
      <Description>telefone: {telefone}</Description>
      <Title style={{ marginTop: 10 }}>
        Vocẽ fechou negócio com {clientName}?
      </Title>

      <BoxButon>
        <ButonOk onPress={handShak}>
          <TextButon>SIM</TextButon>
        </ButonOk>

        <ButonCancel onPress={failTransaction}>
          <TextButon>NÃO</TextButon>
        </ButonCancel>
      </BoxButon>
      <View style={{ marginTop: 26 }}>
        <Line />
      </View>
    </Container>
  );
}
