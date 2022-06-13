import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../global/styles/theme';

const { colors, fonts } = theme;

export const Container = styled.TouchableOpacity`
    background-color: ${colors.focus};
    width: ${RFValue(160)}px;
    height: ${RFValue(100)}px;
    border-radius: ${RFValue(10)}px;

    align-items: center;
    justify-content: center;
`;

export const Box = styled.View`
    background-color: ${colors.focus_second_light};
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 6px;
    top: ${RFValue(20)}px;
`;

export const Title = styled.Text`
    color: ${colors.text_secundary};
    font-family: ${fonts.blac};
    font-size: ${RFValue(16)}px;
`;

export const Image = styled.Image`
    width: 100px;
    height: 60px;
    opacity: 0.3;
    position: absolute;
    top: ${RFValue(6)}px;
`;
