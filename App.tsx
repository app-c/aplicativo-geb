/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
   useFonts,
   Roboto_400Regular,
   Roboto_900Black,
} from '@expo-google-fonts/roboto';
import {
   Comfortaa_400Regular,
   Comfortaa_500Medium,
} from '@expo-google-fonts/comfortaa';
import { OpenSansCondensed_700Bold } from '@expo-google-fonts/open-sans-condensed';
import {
   BarlowCondensed_400Regular,
   BarlowCondensed_600SemiBold,
   BarlowCondensed_300Light,
} from '@expo-google-fonts/barlow-condensed';
import { ThemeProvider } from 'styled-components/native';

import { NavigationContainer } from '@react-navigation/native';
import { LogBox, View, AppState, Modal } from 'react-native';
import {
   Text,
   Box,
   Center,
   NativeBaseProvider,
   Button as ButtonBase,
} from 'native-base';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import theme from './src/global/styles/theme';
import AppProvider from './src/hooks';
import { Route } from './src/routes';
import { Loading } from './src/components/Loading';
import { update, version } from './src/utils/updates';

export default function App() {
   const appState = useRef(AppState.currentState);

   const [appVisible, setAppVisible] = React.useState(appState.current);
   const [showModalUpdate, setModalUpdates] = React.useState(false);

   Notifications.setNotificationHandler({
      handleNotification: async () => ({
         shouldShowAlert: true,
         shouldPlaySound: true,
         shouldSetBadge: false,
      }),
   });

   //* * UPDATE APLICATION ....................................................

   //* * .......................................................................

   const [loaded] = useFonts({
      Roboto_400Regular,
      Roboto_900Black,
      OpenSansCondensed_700Bold,
      Comfortaa_400Regular,
      Comfortaa_500Medium,
      BarlowCondensed_400Regular,
      BarlowCondensed_600SemiBold,
      BarlowCondensed_300Light,
   });

   if (!loaded) {
      return <Loading />;
   }
   LogBox.ignoreLogs([`Setting a timer for a long period`]);

   return (
      <NavigationContainer>
         <ThemeProvider theme={theme}>
            <StatusBar style="light" hidden />
            <AppProvider>
               <NativeBaseProvider>
                  <View style={{ flex: 1 }}>
                     <Route />
                  </View>
               </NativeBaseProvider>
            </AppProvider>
         </ThemeProvider>
      </NavigationContainer>
   );
}
