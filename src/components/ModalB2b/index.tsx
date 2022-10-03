import React from 'react';
import { View } from 'react-native';
import { Line } from '../MembroLista/styles';
import {
   BoxButon,
   ButonCancel,
   ButonOk,
   Container,
   TextButon,
   Title,
} from './styles';

interface Prps {
   clientName: string;
   failTransaction: () => void;
   handShak: () => void;
}

export function ModalB2b({ clientName, failTransaction, handShak }: Prps) {
   return (
      <Container>
         <Title>{clientName} fez um B2B com você?</Title>

         <BoxButon>
            <ButonCancel onPress={failTransaction}>
               <TextButon>NÃO</TextButon>
            </ButonCancel>
            <ButonOk onPress={handShak}>
               <TextButon>SIM</TextButon>
            </ButonOk>
         </BoxButon>
         <View style={{ marginTop: 26 }}>
            <Line />
         </View>
      </Container>
   );
}
