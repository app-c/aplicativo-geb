import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

const { colors, fonts } = theme;
export const Container = styled.View`
   background-color: ${colors.secundary};
   width: 100%;
   height: ${RFPercentage(30)}px;
   padding: 10px;
   border-radius: 8px;
   margin-bottom: ${RFValue(12)}px;
`;

export const Title = styled.Text`
   font-size: ${RFValue(14)}px;
   font-family: ${fonts.regular};
   color: ${colors.focus};
`;

export const TitleName = styled.Text`
   font-size: ${RFValue(16)}px;
   font-family: ${fonts.blac};
   color: ${colors.focus};
`;

export const Avatar = styled.Image`
   width: ${RFValue(50)}px;
   height: ${RFValue(50)}px;
   border-radius: ${RFValue(25)}px;
   background-color: ${colors.focus};
`;

export const MapView = styled.TouchableOpacity`
   width: 100%;
   min-height: ${RFPercentage(5)}px;
   background-color: ${colors.focus};
   flex-direction: row;
   padding: 5px;
   align-items: center;
   border-radius: ${RFValue(15)}px;
   margin-top: ${RFValue(16)}px;
   margin-bottom: ${RFValue(16)}px;
`;

export const TitleMaps = styled.Text`
   font-size: ${RFValue(14)}px;
   font-family: ${fonts.tenor};
   color: ${colors.text_secundary};
   margin-left: 20px;
`;

export const Box = styled.TouchableOpacity`
   width: ${RFPercentage(10.5)}px;
   height: ${RFPercentage(6)}px;
   background-color: ${colors.focus_light};
   align-items: center;
   justify-content: center;
   border-radius: 10px;
   margin-top: 8px;
`;

export const TitleSocial = styled.Text`
   font-size: ${RFValue(10)}px;
   font-family: ${fonts.tenor};
   color: ${colors.text_secundary};
`;
