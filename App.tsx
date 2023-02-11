/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
import {
   BarlowCondensed_300Light, BarlowCondensed_400Regular,
   BarlowCondensed_600SemiBold
} from '@expo-google-fonts/barlow-condensed';
import {
   Comfortaa_400Regular,
   Comfortaa_500Medium
} from '@expo-google-fonts/comfortaa';
import { OpenSansCondensed_700Bold } from '@expo-google-fonts/open-sans-condensed';
import {
   Roboto_400Regular,
   Roboto_900Black, useFonts
} from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React, { useRef } from 'react';
import 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components/native';

import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';
import {
   Box, Button as ButtonBase, Center,
   NativeBaseProvider, Text
} from 'native-base';
import { AppState, LogBox, Modal, View } from 'react-native';
import { Loading } from './src/components/Loading';
import theme from './src/global/styles/theme';
import AppProvider from './src/hooks';
import { Route } from './src/routes';
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
                           <ButtonBase onPress={ReloadDevice} mt="10">
                              ATUALIZAR
                           </ButtonBase>
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
