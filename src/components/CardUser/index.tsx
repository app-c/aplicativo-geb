import React from 'react';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import theme from '../../global/styles/theme';

export function CardUser() {
   return (
      <S.Container>
         <S.content>
            <S.avatar />
            <S.icoLogo />

            <S.box>
               <S.title>nome</S.title>
               <S.title>presetador</S.title>

               <S.row>
                  <S.boxIco bg="w">
                     <FontAwesome
                        size={30}
                        color={theme.colors.focus}
                        name="whatsapp"
                     />
                  </S.boxIco>

                  <S.boxIco style={{ marginLeft: 8 }} bg="web">
                     <FontAwesome
                        size={30}
                        color={theme.colors.focus}
                        name="instagram"
                     />
                  </S.boxIco>

                  <S.boxIco style={{ marginLeft: 8 }} bg="ins">
                     <MaterialCommunityIcons
                        size={30}
                        color={theme.colors.focus}
                        name="web"
                     />
                  </S.boxIco>
               </S.row>
            </S.box>
         </S.content>
      </S.Container>
   );
}
