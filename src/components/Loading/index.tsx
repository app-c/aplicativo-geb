import React from 'react';
import { ActivityIndicator } from 'react-native';
import theme from '../../global/styles/theme';
import { Container, Title } from './styles';

export function Loading() {
   return (
      <Container>
         <ActivityIndicator size="large" color={theme.colors.focus_second} />
      </Container>
   );
}
