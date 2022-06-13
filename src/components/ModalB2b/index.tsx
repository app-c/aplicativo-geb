import React from "react";
import { View } from "react-native";
import { Line } from "../MembroLista/styles";
import {
  BoxButon,
  ButonCancel,
  ButonOk,
  Container,
  TextButon,
  Title,
} from "./styles";

interface Prps {
  clientName: string;
  failTransaction: () => void;
  handShak: () => void;
}

export function ModalB2b({ clientName, failTransaction, handShak }: Prps) {
  return (
    <Container>
      <Title>{clientName} fez ou irá realizar um B2B com você</Title>

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
