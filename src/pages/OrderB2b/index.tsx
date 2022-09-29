/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import fire from '@react-native-firebase/firestore';
import { TextArea } from 'native-base';
import {
   Avatar,
   Box,
   BoxAvatar,
   Boxcons,
   BoxElement,
   BoxInput,
   BoxProvider,
   Buton,
   Container,
   ContainerInput,
   ImageOfice,
   ImageProviderOfice,
   InputText,
   Title,
} from './styles';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';
import { IUserDto } from '../../dtos';
import { HeaderContaponent } from '../../components/HeaderComponent';
import { colecao } from '../../collection';
import { api } from '../../services/api';

interface IRoute {
   prestador_id: string;
   avatar_url: string;
   avatar: string | null;
   logoUrl: string;
   nome: string;
   workName: string;
}

export function OrderB2b() {
   const { navigate, reset } = useNavigation();
   const moneyRef = useRef(null);
   const { user } = useAuth();
   const route = useRoute();
   const { prestador_id, avatar_url, nome, workName, logoUrl } =
      route.params as IRoute;

   const [value, setValue] = useState('');
   const [prestador, setPrestador] = useState<IUserDto>();
   const [description, setDescription] = useState('');
   const [mon, setMon] = useState(0);

   const navigateToOk = useCallback(async () => {
      if (!description) {
         Alert.alert('Transação', 'informe uma descrição ');
         return;
      }

      const dados = {
         send_id: user.user.id,
         send_name: user.user.nome,
         recevid_id: prestador_id,
         recevid_name: nome,
         appointment: new Date(),
         validate: false,
         assunto: description,
      };

      await api
         .post('/b2b/create-b2b', dados)
         .then(h => {
            navigate('sucess', { workName, description, nome });
         })
         .catch(h => console.log('b2b', h.response.data));
   }, [description, navigate, nome, prestador_id, user, workName]);

   useEffect(() => {
      const mo = moneyRef.current?.getRawValue();
      setMon(mo);
   }, [value]);

   return (
      <Container>
         <HeaderContaponent type="tipo1" title="" />
         <Box>
            <Title style={{ marginBottom: 30, textAlign: 'center' }}>
               Vocẽ irá realizar um B2B com: {nome}
               {prestador?.workName}
            </Title>
            <BoxElement>
               <BoxAvatar>
                  {user.profile.avatar ? (
                     <Avatar source={{ uri: user.profile.avatar }} />
                  ) : (
                     <Feather
                        name="user"
                        size={60}
                        color={theme.colors.focus}
                     />
                  )}

                  {user.profile.logo ? (
                     <ImageOfice source={{ uri: user.profile.logo }} />
                  ) : (
                     <View
                        style={{
                           width: 50,
                           height: 50,
                           borderRadius: 25,
                           backgroundColor: theme.colors.focus,
                           alignSelf: 'flex-end',
                        }}
                     />
                  )}
               </BoxAvatar>

               <Boxcons>
                  <AntDesign
                     style={{ left: -30, position: 'absolute' }}
                     name="caretright"
                     size={RFValue(18)}
                  />
                  <AntDesign
                     style={{ right: -30, position: 'absolute' }}
                     name="caretright"
                     size={RFValue(18)}
                  />
               </Boxcons>

               <BoxProvider>
                  {avatar_url ? (
                     <Avatar source={{ uri: avatar_url }} />
                  ) : (
                     <Feather
                        name="user"
                        size={85}
                        color={theme.colors.focus}
                     />
                  )}

                  {logoUrl ? (
                     <ImageProviderOfice source={{ uri: logoUrl }} />
                  ) : (
                     <View
                        style={{
                           width: 50,
                           height: 50,
                           borderRadius: 25,
                           backgroundColor: theme.colors.focus,
                           alignSelf: 'flex-start',
                        }}
                     />
                  )}
               </BoxProvider>
            </BoxElement>
         </Box>

         <ScrollView>
            <View style={{ paddingBottom: 50 }}>
               <BoxInput
                  style={{
                     shadowColor: '#000',
                     shadowOffset: {
                        width: 0,
                        height: 3,
                     },
                     shadowOpacity: 0.57,
                     shadowRadius: 4.65,

                     elevation: 6,
                  }}
               >
                  <Text style={{ alignSelf: 'flex-end' }}>
                     {description.length}/100
                  </Text>
                  <TextArea
                     h="50%"
                     w="80%"
                     borderRadius={10}
                     maxLength={100}
                     value={description}
                     onChangeText={h => setDescription(h)}
                     fontFamily={theme.fonts.regular}
                     fontSize={14}
                  />
               </BoxInput>

               <Buton onPress={navigateToOk}>
                  <Title style={{ color: theme.colors.text_secundary }}>
                     Enviar
                  </Title>
               </Buton>
            </View>
         </ScrollView>
      </Container>
   );
}
