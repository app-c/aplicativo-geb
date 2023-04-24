import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';

const w = Dimensions.get('screen').height;

interface props {
   selected: boolean;
}

export const Container = styled.TouchableOpacity`
   background-color: rgba(66, 66, 66, 0.95);

   flex: 1;

   align-items: center;
   justify-content: center;
`;

export const title = styled.Text`
   margin-bottom: 20px;

   font-size: ${RFValue(20)}px;
   font-family: ${theme.fonts.OpenBold};

   color: #fff;
`;

export const contemt = styled.View`
   width: ${w * 0.5}px;
   height: ${w * 0.4}px;

   background-color: ${theme.colors.focus_light};
   border-radius: 10px;

   padding: 20px 10px;
   align-items: center;
   justify-content: center;
`;

export const boxSelect = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-around;

   width: 100%;

   margin-bottom: 20px;
`;

export const boxIco = styled.TouchableOpacity<props>`
   padding: 5px;
   width: ${w * 0.13}px;

   background-color: ${h =>
      h.selected ? theme.colors.focus_second : '#9a9a9a'};
   border-radius: 5px;

   align-items: center;
   justify-content: center;
`;

export const subT = styled.Text`
   font-size: ${RFValue(16)}px;
   font-family: ${theme.fonts.OpenBold};

   color: #fff;
`;
