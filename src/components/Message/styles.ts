import { TenorSans_400Regular } from "@expo-google-fonts/tenor-sans";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { FlatList } from "react-native";
import { Res } from ".";

export const Container = styled.View`
  padding: 20px 20px 140px 20px;
  background-color: ${({ theme: h }) => h.colors.primary};
`;

export const Text = styled.Text`
  color: ${({ theme: h }) => h.colors.text_secundary};
  font-family: ${({ theme: h }) => h.fonts.tenor};
`;

export const Bot = styled.TouchableOpacity`
  width: ${RFValue(200)}px;
  height: ${RFValue(45)}px;
  background-color: ${({ theme: h }) => h.colors.focus};
  border-radius: ${RFValue(12)}px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const ContainerMessage = styled.View`
  width: 100%;
  height: ${RFValue(150)}px;
  background-color: ${({ theme: h }) => h.colors.primary};
  border-radius: ${RFValue(12)}px;
  margin-bottom: 16px;
  flex-direction: row;
`;

export const Avatar = styled.Image`
  height: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  border-radius: ${RFValue(80)}px;
`;

export const BoxTexts = styled.View`
  background-color: ${({ theme: h }) => h.colors.focus_light};
`;

export const Flat = styled(FlatList as new () => FlatList<Res>)``;
