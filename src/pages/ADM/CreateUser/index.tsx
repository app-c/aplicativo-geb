/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import {
   ActivityIndicator,
   Alert,
   FlatList,
   Modal,
   ScrollView,
   View,
} from 'react-native';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import * as Yup from 'yup';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import fire from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { Box, BoxAdm, BxPadrinho, Container, Logo, Title } from './styles';
import { useAuth } from '../../../hooks/AuthContext';
import { Button } from '../../../components/Button';
import getValidationErrors from '../../../utils/getValidationsErrors';
import theme from '../../../global/styles/theme';
import { InputCasdastro } from '../../../components/InputsCadastro';
import { BoxTogle, TextTogle, TitleHeader } from '../../Profile/styles';
import { ToglleRamo } from '../../../components/ToglleRamo';
import { MembroLista } from '../../../components/MembroLista';
import { ToglleEnquadramento } from '../../../components/ToglleEnquadramento';
import { IUserDto } from '../../../dtos';
import { colecao } from '../../../collection';
import { HeaderContaponent } from '../../../components/HeaderComponent';

interface FormData {
   nome: string;
   workName: string;
   membro: string;
   senha: string;
   whats: string;
   CNPJ: string;
   email: string;
   ramo: string;
   enquadramento: string;
   CPF: string;
   adm: true;
}

export function SingUp() {
   const { navigate } = useNavigation();
   const formRef = useRef<FormHandles>(null);
   const { user, listUser } = useAuth();

   const [adm, setAdm] = useState(false);
   const [idAdm, setIsAdm] = useState('user');
   const [er, setErr] = useState();
   const [response, setResponse] = useState<IUserDto[]>([]);
   const [loading, setLoading] = useState(false);

   // TODO MODAL
   const [modal, setModal] = useState(false);
   const [modalRamo, setModalRamo] = useState(false);
   const [enquadramento, setEnquadramento] = useState('');
   const [ramo, setRamo] = useState('');
   const [modalUser, setModalUser] = useState(false);
   const [idUserModal, setIdUserModal] = useState('');
   const [nomeUserModa, setNomeUserModal] = useState('');
   const modalizeRefRamo = useRef<Modalize>(null);
   const modalizeRefEnquadramento = useRef<Modalize>(null);

   const [padre, setPadre] = useState(0);

   const handleModalOpenEnquadramento = useCallback(() => {
      modalizeRefEnquadramento.current?.open();
   }, []);

   const handleModalOpenRamo = useCallback(() => {
      modalizeRefRamo.current?.open();
   }, []);

   const SelectItemRamo = useCallback(
      (item: string) => {
         setRamo(item);
         modalizeRefRamo.current?.close();
         setModalRamo(!modalRamo);
      },
      [modalRamo],
   );

   const SelectItemEnquadramento = useCallback(
      (item: string) => {
         setEnquadramento(item);
         modalizeRefEnquadramento.current?.close();
         setModal(!modal);
      },
      [modal],
   );

   const OpenModalUser = useCallback(() => {
      setModalUser(true);
   }, []);

   const CloseModalUser = useCallback((id: string, nome: string) => {
      setIdUserModal(id);
      setNomeUserModal(nome);
      setModalUser(false);
   }, []);

   // TODO RESTO

   const handleSubmit = useCallback(
      async (data: FormData) => {
         try {
            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
               nome: Yup.string().required('Nome obrigatorio'),
               email: Yup.string()
                  .email('email inválido')
                  .required('E-mail Obrigatorio'),
               // workName: Yup.string().required(
               //     "nome razão social obrigatório",
               // ),
               // whats: Yup.string().required("whatts app é obrigatório"),
               senha: Yup.string().min(6, 'Senha no minimo 6 digitos'),
            });

            await shema.validate(data, {
               abortEarly: false,
            });

            setLoading(true);
            auth()
               .createUserWithEmailAndPassword(data.email, data.senha)
               .then(h => {
                  fire()
                     .collection(colecao.users)
                     .doc(h.user.uid)
                     .set({
                        id: h.user.uid,
                        nome: data.nome,
                        workName: data.workName,
                        whats: data.whats,
                        email: h.user.email,
                        CNPJ: data.CNPJ,
                        CPF: data.CPF,
                        adm,
                        ramo,
                        enquadramento,
                        padrinhQuantity: 0,
                        avatarUrl: null,
                        logoUrl: null,
                        links: {},
                        presenca: [],
                        indicacao: 0,
                        inativo: false,
                     })
                     .catch(err => console.log('erro1', err));

                  setLoading(false);
                  Alert.alert('Usuário cadastrado');
                  navigate('Inicio');
               })
               .catch(err => {
                  console.log('erro2', err);
                  if (err.code === 'auth/email-already-in-use') {
                     return Alert.alert('Cadastro', 'email já cadastrado');
                  }
               });
         } catch (err: any) {
            console.log('err 3', err);
            if (err instanceof Yup.ValidationError) {
               const errors = getValidationErrors(err);
               formRef.current?.setErrors(errors);
               Alert.alert('Cadastro', err.message);
            }
         }

         if (nomeUserModa) {
            fire()
               .collection(colecao.users)
               .doc(idUserModal)
               .get()
               .then(h => {
                  const { padrinhQuantity } = h.data();
                  fire()
                     .collection(colecao.users)
                     .doc(idUserModal)
                     .update({
                        padrinhQuantity: padrinhQuantity + 1,
                     });
               });
         }

         setNomeUserModal('');
         setIdUserModal('');
      },
      [adm, enquadramento, idUserModal, navigate, nomeUserModa, ramo],
   );

   const handleAdm = useCallback(() => {
      setAdm(true);
      setIsAdm('adm');
   }, []);

   const handleUser = useCallback(() => {
      setAdm(false);
      setIsAdm('user');
   }, []);

   useFocusEffect(
      useCallback(() => {
         const us = listUser
            .sort((a, b) => {
               if (a.nome < b.nome) {
                  return -1;
               }
            })
            .sort((a, b) => {
               if (a.nome < b.nome) {
                  return -1;
               }
            });
         setResponse(us);
      }, []),
   );

   return (
      <Container>
         <HeaderContaponent type="tipo1" title="Dados cadastrais" />

         <Modalize ref={modalizeRefRamo}>
            <ToglleRamo selectItem={(item: string) => SelectItemRamo(item)} />
         </Modalize>

         <Modalize ref={modalizeRefEnquadramento} snapPoint={530}>
            <ToglleEnquadramento
               selectItem={(item: string) => SelectItemEnquadramento(item)}
            />
         </Modalize>

         <Modal animationType="fade" visible={modalUser}>
            <View style={{ flex: 1 }}>
               <FlatList
                  data={response}
                  keyExtractor={h => h.id}
                  renderItem={({ item: h }) => (
                     <>
                        <MembroLista
                           closeModal={() => CloseModalUser(h.id, h.nome)}
                           nome={h.nome}
                           avatar={h.avatarUrl}
                        />
                     </>
                  )}
               />
            </View>
         </Modal>

         <View
            style={{
               flexDirection: 'row',
               alignSelf: 'center',
               marginBottom: 10,
               marginTop: 20,
            }}
         >
            <Title>adm</Title>
            <BoxAdm isAdm={idAdm === 'adm'} onPress={handleAdm} />
            <Title style={{ marginLeft: 40 }}>usuário</Title>
            <BoxAdm isAdm={idAdm === 'user'} onPress={handleUser} />
         </View>

         <BxPadrinho onPress={OpenModalUser}>
            {nomeUserModa ? (
               <Title>padrinho: {nomeUserModa} </Title>
            ) : (
               <Title>Escolher padrinho</Title>
            )}
         </BxPadrinho>

         <ScrollView
            contentContainerStyle={{
               paddingHorizontal: 30,
               paddingTop: RFValue(20),
               paddingBottom: RFPercentage(35),
            }}
            style={{
               marginTop: RFValue(30),
            }}
         >
            <Form ref={formRef} onSubmit={handleSubmit}>
               <Box>
                  <View>
                     <Title>NOME COMPLETO</Title>
                     <InputCasdastro
                        name="nome"
                        type="custom"
                        options={{ mask: '******************' }}
                        icon="user"
                     />
                  </View>

                  <View>
                     <Title>E-MAIL</Title>
                     <InputCasdastro
                        name="email"
                        type="custom"
                        options={{
                           mask: '**************************************************',
                        }}
                        icon="user"
                     />
                  </View>

                  <View>
                     <Title>WHATS</Title>
                     <InputCasdastro
                        name="whats"
                        type="cel-phone"
                        icon="user"
                     />
                  </View>

                  <View>
                     <Title>SENHA</Title>
                     <InputCasdastro
                        name="senha"
                        autoCapitalize="none"
                        type="custom"
                        options={{ mask: '******************' }}
                        icon="user"
                     />
                  </View>
               </Box>

               <Box>
                  <View>
                     <Title>CPF</Title>
                     <InputCasdastro name="CPF" type="cpf" icon="user" />
                  </View>

                  <View>
                     <Title>CNPJ</Title>
                     <InputCasdastro name="CNPJ" type="cnpj" icon="user" />
                  </View>

                  <View>
                     <Title>NOME RAZAO SOCIAL</Title>
                     <InputCasdastro
                        name="workName"
                        type="custom"
                        options={{
                           mask: '***********************************',
                        }}
                        icon="user"
                     />
                  </View>

                  <View
                     style={{
                        alignSelf: 'flex-start',
                        // marginLeft: 20,
                        marginTop: 20,
                        marginBottom: 20,
                     }}
                  >
                     <TitleHeader>RAMO DE ATIVIDADE</TitleHeader>
                     <BoxTogle onPress={handleModalOpenRamo}>
                        <TextTogle>{ramo}</TextTogle>
                        <AntDesign
                           name="caretdown"
                           size={25}
                           color={theme.colors.focus}
                        />
                     </BoxTogle>
                  </View>

                  <View
                     style={{
                        alignSelf: 'flex-start',
                        // marginLeft: 20,
                        marginTop: 20,
                        marginBottom: 20,
                     }}
                  >
                     <TitleHeader>ENQUADRAMENTO</TitleHeader>
                     <BoxTogle onPress={handleModalOpenEnquadramento}>
                        <TextTogle>{enquadramento}</TextTogle>
                        <AntDesign
                           name="caretdown"
                           size={25}
                           color={theme.colors.focus}
                        />
                     </BoxTogle>
                  </View>
               </Box>
            </Form>
            <View>
               {loading ? (
                  <ActivityIndicator size="large" />
               ) : (
                  <Button
                     pres={() => formRef.current?.submitForm()}
                     title="Cadastrar"
                  />
               )}
            </View>
         </ScrollView>
      </Container>
   );
}
