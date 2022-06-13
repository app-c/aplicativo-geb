import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

const { colors, fonts } = theme;
export const Container = styled.View.attrs({
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 9,
  },
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

  elevation: 18,
})`
  width: 85%;
  min-height: ${RFPercentage(40)}px;
  background-color: ${colors.secundary};
  align-self: center;
  border-radius: 15px;
  padding: 20px;
`;

export const Title = styled.Text``;
