import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import theme from '../../global/styles/theme';

const { colors, fonts } = theme;
const w = Dimensions.get('window').width;

export const Container = styled.View`
   width: 100%;
   padding: 15px;
`;

export const Title = styled.Text`
   font-size: 16px;
   font-family: ${fonts.BarLight};
`;

export const Description = styled.Text`
   font-size: 16px;
   font-family: ${fonts.BarRegular};
`;

export const BoxButon = styled.View`
   flex-direction: row;
   justify-content: space-between;
   margin-top: 15px;
   width: ${w * 0.6}px;
`;

export const ButonOk = styled.TouchableOpacity`
   width: 70px;
   height: 30px;
   border-radius: 5px;
   align-items: center;
   justify-content: center;

   background-color: ${colors.focus};
`;

export const ButonCancel = styled.TouchableOpacity`
   width: 70px;
   height: 30px;
   border-radius: 5px;
   align-items: center;
   justify-content: center;

   background-color: ${colors.focus_second};
`;

export const TextButon = styled.Text`
   font-size: 16px;
   font-family: ${fonts.BarLight};
   color: ${colors.primary};
`;
