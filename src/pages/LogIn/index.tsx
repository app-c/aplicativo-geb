/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState } from 'react';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { Alert, TouchableOpacity, View } from 'react-native';
import {
   FormControl,
   WarningOutlineIcon,
   Input,
   Text,
   Box,
   Center,
   Modal,
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

export function SingIn() {
   const { signIn } = useAuth();
   const formRef = useRef<FormHandles>(null);
   const modalRef = useRef<Modalize>(null);
   const [showModal, setShowModal] = useState(false);

   const [email, setEmail] = useState('');
   const [pass, setPass] = useState('');
   const [errEmail, setErrEmail] = useState(false);
   const [errPass, setErrPass] = useState(false);

   const handleSubmit = useCallback(async () => {
      if (email === '' || pass === '') {
         return Alert.alert('Login', 'forneça um email e uma senha');
      }

      setErrEmail(false);
      setErrPass(false);

      await signIn({
         email,
         senha: pass,
      }).catch(err => {
         const { code } = err;
         if (code === 'auth/user-not-found') {
            setErrEmail(true);
            return Alert.alert('Login', 'usuário nao encontrado');
         }

         if (code === 'auth/invalid-email') {
            setErrEmail(true);
            return Alert.alert('Login', 'email incorreto');
         }

         if (code === 'auth/wrong-password') {
            setErrPass(true);
            return Alert.alert('Login', 'senha incorreto');
         }
         return Alert.alert('Login', 'usuário nao encontrado');
      });
   }, [email, pass, signIn]);

   const handleForgotPassword = useCallback(() => {
      auth()
         .sendPasswordResetEmail(email)
         .then(h => {
            Alert.alert('Um link foi enviado para seu email');
         });
   }, [email]);

   return (
      <Container behavior="padding">
         <Center>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
               <Box
                  w="90%"
                  bg={theme.colors.text_secundary}
                  padding="10"
                  borderRadius={8}
               >
                  <VStack>
                     <FormControl>
                        <FormControl.Label>DIGITE SEU E-MAIL</FormControl.Label>
                        <Input
                           onChangeText={h => setEmail(h)}
                           value={email}
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
            </Modal>
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
            version: 2.1.4
         </Text>
         <BoxLogo>
            <Logo source={logo} />
         </BoxLogo>

         <BoxInput>
            <Form ref={formRef} onSubmit={handleSubmit}>
               <FormControl isInvalid={errEmail} w="75%" maxW="300px">
                  <FormControl.Label>E-MAIL</FormControl.Label>
                  <Input
                     w="100%"
                     color={theme.colors.text_secundary}
                     type="text"
                     autoCapitalize="none"
                     keyboardType="email-address"
                     onChangeText={h => setEmail(h)}
                     value={email}
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
