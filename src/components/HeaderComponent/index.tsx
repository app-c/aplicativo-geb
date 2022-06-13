/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import React, { useCallback, useState } from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Image, Modal, TouchableOpacity, View } from 'react-native';
import {
   BoxMail,
   Circle,
   Container,
   Header,
   TextCircli,
   TitleHeader,
} from './styles';
import { useAuth } from '../../hooks/AuthContext';
import theme from '../../global/styles/theme';
import logo1 from '../../assets/logo1.png';
import logo from '../../assets/logo.png';

interface Props {
   title: string;
   type: 'tipo1' | 'tipo2' | 'tipo3';
}

interface Res {
   prestador_id: string;
   consumidor: string;
   valor: string;
   descricao: string;
   nome: string;
}
export function HeaderContaponent({ title, type }: Props) {
   const { navigate } = useNavigation();

   return (
      <Container>
         <Header type={type}>
            <TouchableOpacity onPress={() => navigate('INÍCIO')}>
               {type === 'tipo1' && (
                  <Feather
                     name="arrow-left"
                     size={35}
                     color={theme.colors.primary}
                  />
               )}

               {type === 'tipo2' && (
                  <Feather
                     name="arrow-left"
                     size={35}
                     color={theme.colors.focus}
                  />
               )}
            </TouchableOpacity>

            <TitleHeader type={type}>{title} </TitleHeader>

            {type === 'tipo1' && (
               <Image
                  style={{
                     width: RFPercentage(6),
                     height: RFPercentage(3.5),
                  }}
                  source={logo}
               />
            )}
         </Header>
      </Container>
   );
}
