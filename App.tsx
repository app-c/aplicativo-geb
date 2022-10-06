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
   Button,
} from 'native-base';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import Async from '@react-native-async-storage/async-storage';
import theme from './src/global/styles/theme';
import AppProvider from './src/hooks';
import { Route } from './src/routes';
import { Loading } from './src/components/Loading';
import { update, version } from './src/utils/updates';
import { New } from './src/components/new';

interface IUp {
   up: boolean;
}

export default function App() {
   Notifications.setNotificationHandler({
      handleNotification: async () => ({
         shouldShowAlert: true,
         shouldPlaySound: true,
         shouldSetBadge: false,
      }),
   });

   //* * UPDATE APLICATION ....................................................
   const [showModalUpdate, setModalUpdates] = React.useState(false);

   const appState = useRef(AppState.currentState);
   const [appVisible, setAppVisible] = React.useState(appState.current);

   React.useEffect(() => {
      async function ld() {
         const dados = {
            up: false,
         };
         const data = await Async.getItem('up');
         const dt = data ? (JSON.parse(data) as IUp) : null;

         if (dt === null || !dt.up) {
            await Async.setItem('up', JSON.stringify(dados));
         }
      }

      ld();
   }, []);

   const ChecUpdadeDevice = React.useCallback(async () => {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
         setModalUpdates(true);
      }
   }, []);

   const ReloadDevice = React.useCallback(async () => {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
   }, []);

   React.useEffect(() => {
      const event = AppState.addEventListener('change', h => {
         if (h === 'active') {
            ChecUpdadeDevice();
         }
      });

      return () => {
         event.remove();
      };
   }, [ChecUpdadeDevice]);

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
                     <Modal visible={showModalUpdate}>
                        <Center p="5" bg={theme.colors.primary}>
                           <Box>
                              <Text fontFamily={theme.fonts.blac} fontSize="16">
                                 UMA NOVA ATUALIZAÇÃO ESTA DISPONÍVEL
                              </Text>
                              {update.map(h => (
                                 <Text>{h.title}</Text>
                              ))}
                              <Text>{version}</Text>
                           </Box>
                           <Button onPress={ReloadDevice} mt="10">
                              ATUALIZAR
                           </Button>
                        </Center>
                     </Modal>

                     <Route />
                  </View>
               </NativeBaseProvider>
            </AppProvider>
         </ThemeProvider>
      </NavigationContainer>
   );
}
