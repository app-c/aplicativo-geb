/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState } from 'react';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import {
   FormControl,
   WarningOutlineIcon,
   Input,
   Text,
   Box,
   Center,
   Modal as Md,
   Button as ButtonBase,
   VStack,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import { Modalize } from 'react-native-modalize';
import { BoxInput, BoxLogo, Container, Logo, Title } from './styles';
// import { Input } from "../../components/Inputs";
import { Button } from '../../components/Button';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/AuthContext';
import theme from '../../global/styles/theme';
import { version } from '../../utils/updates';
import { New } from '../../components/new';
import { api } from '../../services/api';

export function SingIn() {
   const { signIn } = useAuth();
   const formRef = useRef<FormHandles>(null);
   const [showModal, setShowModal] = useState(false);

   const [membro, setMembro] = useState('');
   const [email, setEmail] = useState('');
   const [pass, setPass] = useState('');
   const [errEmail, setErrEmail] = useState(false);
   const [errPass, setErrPass] = useState(false);

   const handleSubmit = useCallback(async () => {
      if (membro === '' || pass === '') {
         return Alert.alert('Login', 'forneça um email e uma senha');
      }

      setErrEmail(false);
      setErrPass(false);

      await signIn({
         membro,
         senha: pass,
      }).catch(h => {
         Alert.alert('Erro ao logar com sua conta', h.response.data.message);
      });
   }, [membro, pass, signIn]);

   const handleForgotPassword = useCallback(async () => {
      console.log(membro, pass);
      await api
         .post('/user/update-pass', {
            membro,
            senha: pass,
         })
         .then(() => {
            Alert.alert('Sucesso', 'senha atualizada');
            setShowModal(false);
         })
         .catch(h => Alert.alert('Membro não encontrado'));
   }, [membro, pass]);

   return (
      <Container behavior="padding">
         <Center>
            <Md isOpen={showModal} onClose={() => setShowModal(false)}>
               <Box
                  w="90%"
                  bg={theme.colors.text_secundary}
                  padding="10"
                  borderRadius={8}
               >
                  <VStack>
                     <FormControl>
                        <FormControl.Label>DIGITE O MEMBRO</FormControl.Label>
                        <Input
                           onChangeText={setMembro}
                           value={membro}
                           autoCapitalize="none"
                           keyboardType="email-address"
                        />

                        <FormControl.Label>
                           DIGITE A NOVA SENHA
                        </FormControl.Label>
                        <Input
                           onChangeText={setPass}
                           value={pass}
                           autoCapitalize="none"
                           keyboardType="email-address"
                        />
                     </FormControl>
                     <ButtonBase
                        onPress={handleForgotPassword}
                        fontFamily={theme.fonts.blac}
                        bg={theme.colors.focus}
                        mt="5"
                     >
                        ENVIAR
                     </ButtonBase>
                  </VStack>
               </Box>
            </Md>
         </Center>
         <Text
            style={{
               alignSelf: 'flex-end',
               color: theme.colors.primary_light,
               fontSize: 12,
               marginRight: 20,
               top: 30,
            }}
         >
            version: {version}
         </Text>
         <BoxLogo>
            <Logo source={logo} />
         </BoxLogo>

         <BoxInput>
            <Form ref={formRef} onSubmit={handleSubmit}>
               <FormControl isInvalid={errEmail} w="75%" maxW="300px">
                  <FormControl.Label>MEMBRO</FormControl.Label>
                  <Input
                     w="100%"
                     color={theme.colors.text_secundary}
                     type="text"
                     autoCapitalize="none"
                     keyboardType="email-address"
                     onChangeText={h => setMembro(h)}
                     selectionColor={theme.colors.text_secundary}
                  />
                  <FormControl.ErrorMessage
                     leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                     Verefique seu email e tente novamente
                  </FormControl.ErrorMessage>
               </FormControl>

               <FormControl mt={8} isInvalid={errPass} w="75%" maxW="300px">
                  <FormControl.Label>SENHA</FormControl.Label>
                  <Input
                     w="100%"
                     color={theme.colors.text_secundary}
                     onChangeText={h => setPass(h)}
                     value={pass}
                     selectionColor={theme.colors.text_secundary}
                     secureTextEntry
                  />
                  <FormControl.ErrorMessage
                     leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                     Try different from previous passwords.
                  </FormControl.ErrorMessage>
               </FormControl>

               <Box mt={5}>
                  <TouchableOpacity onPress={() => setShowModal(true)}>
                     <Text
                        fontSize="12"
                        fontFamily={theme.fonts.blac}
                        color={theme.colors.text_secundary}
                     >
                        ESQUECI MINHA SENHA
                     </Text>
                  </TouchableOpacity>
               </Box>

               <View style={{ marginTop: 32 }}>
                  <Button
                     pres={() => formRef.current?.submitForm()}
                     title="ENTRAR"
                  />
               </View>
            </Form>
         </BoxInput>
      </Container>
   );
}
