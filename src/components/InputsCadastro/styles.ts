import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import styled, { css } from "styled-components/native";
import theme from "../../global/styles/theme";

interface Props {
    isError: boolean;
    isFocus: boolean;
}

const { fonts, colors } = theme;
export const Box = styled.View<Props>`
    padding: 5px 10px;
    align-self: center;
    width: ${RFPercentage(40)}px;
    height: ${RFPercentage(5)}px;
    border-width: 2px;
    justify-content: center;
    margin-bottom: 30px;
    flex-direction: row;
    border-radius: ${RFValue(8)}px;

    border-top-color: ${colors.secundary};
    border-right-color: ${colors.secundary};
    border-left-color: ${colors.secundary};
    border-bottom-color: ${colors.focus};

    ${({ theme, isError }) =>
        isError &&
        css`
            border-top-color: ${colors.secundary};
            border-right-color: ${colors.secundary};
            border-left-color: ${colors.secundary};
            border-bottom-color: red;
            border-width: 2px;
        `}

    ${({ theme, isFocus }) =>
        isFocus &&
        css`
            border-top-color: ${colors.secundary};
            border-right-color: ${colors.secundary};
            border-left-color: ${colors.secundary};
            border-bottom-color: ${colors.focus};
            border-width: 2px;
        `}
`;

export const Container = styled(TextInputMask)`
    flex: 1;
    font-family: ${({ theme: h }) => h.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme: h }) => h.colors.text};
`;

export const Icon = styled(Feather)`
    margin-right: 14px;
    align-self: center;
`;
