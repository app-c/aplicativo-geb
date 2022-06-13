import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const ContainerMessage = styled.View`
  width: 100%;
  height: ${RFValue(150)}px;
  background-color: ${({ theme: h }) => h.colors.primary};
  border-radius: ${RFValue(12)}px;
  margin-bottom: 16px;
  /* flex-direction: row; */

  /* justify-content: space-between; */
  padding: 20px;
`;

export const Text = styled.Text`
  color: ${({ theme: h }) => h.colors.text};
  font-family: ${({ theme: h }) => h.fonts.tenor};
`;

export const ButtonConfirmar = styled.TouchableOpacity`
  width: ${RFValue(100)}px;
  height: ${RFValue(35)}px;
  background-color: ${({ theme: h }) => h.colors.focus_light};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const ButtonConcelar = styled.TouchableOpacity`
  width: ${RFValue(100)}px;
  height: ${RFValue(35)}px;
  background-color: ${({ theme: h }) => h.colors.focus_second_light};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const TextButton = styled.Text`
  color: ${({ theme: h }) => h.colors.text_secundary};
  font-family: ${({ theme: h }) => h.fonts.blac};
`;
