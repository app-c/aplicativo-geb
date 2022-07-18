import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';

const { colors, fonts } = theme;

interface IProps {
   select: boolean;
}

export const Container = styled.TouchableOpacity`
   width: ${RFValue(25)}px;
   height: ${RFValue(25)}px;
   border-radius: 15px;
   border-width: 3px;
   border-color: ${colors.focus};
   align-items: center;
   justify-content: center;
`;

export const Circle = styled.View<IProps>`
   width: ${RFValue(12)}px;
   height: ${RFValue(12)}px;
   border-radius: 15px;
   background-color: ${({ select }) =>
      select ? colors.focus_second : colors.primary};
`;

export const Title = styled.Text``;
