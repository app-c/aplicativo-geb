import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
    width: ${RFValue(270)}px;
    height: ${50}px;
    background-color: ${({ theme: h }) => h.colors.primary};
    align-items: center;
    justify-content: center;

    border-radius: ${RFValue(10)}px;
`;

export const Title = styled.Text`
    font-family: ${({ theme: h }) => h.fonts.blac};
    color: ${({ theme: h }) => h.colors.focus};
    font-size: ${RFValue(18)}px;
`;
