import React from 'react';
import { View } from 'react-native';
import { Line } from '../MembroLista/styles';
import {
   BoxButon,
   ButonCancel,
   ButonOk,
   Container,
   Description,
   TextButon,
   Title,
} from './styles';

interface Prps {
   description: string;
   clientName: string;
   telefone: number;
   failTransaction: () => void;
   handShak: () => void;
   quemIndicouName: string;
}

export function ModalOrderIndication({
   description,
   clientName,
   quemIndicouName,
   telefone,
   failTransaction,
   handShak,
}: Prps) {
   return (
      <Container>
         <Title>
            {quemIndicouName} idicou voce para fazer negócios com {clientName}{' '}
            {'\n'}
         </Title>

         <Description>descrição: {description}</Description>
         <Description>nome: {clientName},</Description>
         <Description>telefone: {telefone}</Description>
         <Title style={{ marginTop: 10 }}>
            Vocẽ entrou em contato com {clientName}?
         </Title>

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
