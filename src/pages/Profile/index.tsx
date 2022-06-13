/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FormHandles } from "@unform/core";

import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { Modalize } from "react-native-modalize";
import { Form } from "@unform/mobile";

import * as ImagePiker from "expo-image-picker";
import Fire from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import {
   Avatar,
   Box,
   BoxButton,
   BoxCamera,
   BoxFormularios,
   BoxInput,
   BoxLogo,
   BoxTogle,
   Camera,
   Container,
   LogoImage,
   TextTogle,
   TitleButton,
   TitleHeader,
} from "./styles";
import { ToglleRamo } from "../../components/ToglleRamo";
import { IUserDto } from "../../dtos";
import { InputCasdastro } from "../../components/InputsCadastro";
import { Input } from "../../components/Inputs";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { ToglleEnquadramento } from "../../components/ToglleEnquadramento";
import { colecao } from "../../collection";

export interface Props {
   id: string;
   nome: string;
   sobrenome: string;
   whats: number;
   workName: string;
   CNPJ: number;
}
export function Profile() {
   const { user, updateUser, signOut } = useAuth();
   const { navigate } = useNavigation();
   const formRef = useRef<FormHandles>(null);
   const modalizeRefRamo = useRef<Modalize>(null);
   const modalizeRefEnquadramento = useRef<Modalize>(null);

   const [loading, setLoading] = useState(true);

   // TODO USER
   const [avatar, setAvatar] = useState("");
   const [logo, setLogo] = useState("");

   // TODO FORMULARIOS
   const [nome, setNome] = useState(user.nome);
   const [whats, setWhats] = useState("");
   const [email, setEmail] = useState("");
   const [workName, setWorkName] = useState("");
   const [CPF, setCpf] = useState(user.CPF);
   const [cnpj, setCnpj] = useState(user.CNPJ);
   const [linkSite, setLinkSite] = useState(null);
   const [linkF, setLinkF] = useState(null);
   const [linkI, setLinkI] = useState(null);
   const [linkMaps, setLinkMaps] = useState(null);
   const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
   const [logoUrl, setLogorUrl] = useState(user.logoUrl);

   // TODO MODAL
   const [ramo, setRamo] = useState(user.ramo);
   const [enquadramento, setEnquadramento] = useState(user.enquadramento);
   const [modal, setModal] = useState(false);

   const handleModalOpenRamo = useCallback(() => {
      modalizeRefRamo.current?.open();
      setModal(!modal);
   }, [modal]);

   const handleModalOpenEnquadramento = useCallback(() => {
      modalizeRefEnquadramento.current?.open();
   }, []);

   const SelectItemRamo = useCallback(
      (item: string) => {
         setRamo(item);
         setModal(!modal);

         modalizeRefRamo.current?.close();
      },
      [modal]
   );

   const SelectItemEnquadramento = useCallback((item: string) => {
      setEnquadramento(item);
      modalizeRefEnquadramento.current?.close();
   }, []);

   useEffect(() => {
      setLinkF(user.links.face);
      setLinkI(user.links.insta);
      setLinkMaps(user.links.maps);
      setLinkSite(user.links.site);
      setEmail(user.email);
      setWhats(user.whats);
      setWorkName(user.workName);
      setCnpj(String(user.CNPJ));
      setCpf(String(user.CPF));
   }, [user.CNPJ, user.CPF, user.email, user.links, user.whats, user.workName]);

   const handleImagePiker = useCallback(async () => {
      setLoading(true);

      const result = await ImagePiker.launchImageLibraryAsync({
         mediaTypes: ImagePiker.MediaTypeOptions.All,
         allowsEditing: true,
         quality: 1,
      });

      if (result.cancelled) {
         setLoading(false);
      }
      if (!result.cancelled) {
         setAvatar(result.uri);
         const fileName = new Date().getTime();
         const reference = storage().ref(`/image/${fileName}.png`);

         await reference.putFile(result.uri);
         const photoUrl = await reference.getDownloadURL();
         setAvatarUrl(photoUrl);
      }
   }, []);

   const handleLogo = useCallback(async () => {
      setLoading(true);
      const { status } = await ImagePiker.requestMediaLibraryPermissionsAsync();

      if (status === "granted") {
         const result = await ImagePiker.launchImageLibraryAsync({
            mediaTypes: ImagePiker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
         });

         if (result.cancelled) {
            setLoading(false);
         }

         if (!result.cancelled) {
            setLogo(result.uri);

            const fileName = new Date().getTime();
            const reference = storage().ref(`/image/${fileName}.png`);

            await reference.putFile(result.uri);
            const photoUrl = await reference.getDownloadURL();
            setLogorUrl(photoUrl);
         }
      }

      setLoading(false);
   }, []);

   const handleSubmit = useCallback(async () => {
      formRef.current?.setErrors({});

      const formData = {
         id: user.id,
         nome,
         adm: user.adm,
         whats: String(whats),
         workName,
         CNPJ: String(cnpj),
         CPF: String(CPF),
         email,
         ramo,
         enquadramento,
         padrinhQuantity: user.padrinhQuantity,
         links: {
            site: linkSite || "site",
            maps: linkMaps || "site",
            insta: linkI || "site",
            face: linkF || "site",
         },
         avatarUrl,
         logoUrl,
      };

      Fire()
         .collection(colecao.users)
         .doc(user.id)
         .update({
            id: user.id,
            nome,
            adm: user.adm,
            whats: String(whats),
            workName,
            CPF: String(CPF),
            CNPJ: String(cnpj),
            email,
            ramo,
            enquadramento,
            links: {
               site: linkSite || "site",
               maps: linkMaps || "site",
               insta: linkI || "site",
               face: linkF || "site",
            },
            avatarUrl,
            logoUrl,
         })
         .finally(() => updateUser(formData))
         .catch((err) => console.log(err.code));

      Alert.alert("Perfil alterado com sucesso!");
      navigate("INÍCIO");
   }, [
      CPF,
      avatarUrl,
      cnpj,
      email,
      enquadramento,
      linkF,
      linkI,
      linkMaps,
      linkSite,
      logoUrl,
      navigate,
      nome,
      ramo,
      updateUser,
      user.adm,
      user.id,
      user.padrinhQuantity,
      whats,
      workName,
   ]);

   console.log(linkF, user.links);

   return (
      <Container>
         <Modalize ref={modalizeRefRamo} snapPoint={530}>
            <ToglleRamo selectItem={(item: string) => SelectItemRamo(item)} />
         </Modalize>

         <Modalize ref={modalizeRefEnquadramento} snapPoint={530}>
            <ToglleEnquadramento
               selectItem={(item: string) => SelectItemEnquadramento(item)}
            />
         </Modalize>
         <HeaderContaponent type="tipo1" title="MEU PERFIL" onMessage="of" />

         <View
            style={{
               height: RFPercentage(80),
            }}
         >
            <ScrollView
               contentContainerStyle={{
                  paddingTop: RFValue(10),
                  paddingBottom: RFValue(30),
               }}
            >
               <Box>
                  <Avatar
                     style={{ resizeMode: "cover" }}
                     source={{ uri: avatar !== "" ? avatar : user.avatarUrl }}
                  />
                  <BoxCamera onPress={handleImagePiker}>
                     <Camera name="camera" />
                  </BoxCamera>
               </Box>

               <Form
                  initialData={{
                     nome: user.nome,
                     email: user.email,
                     workName: user.workName,
                  }}
               >
                  <BoxFormularios>
                     <BoxInput>
                        <TitleHeader style={{ right: 10 }}>NOME</TitleHeader>
                        <InputCasdastro
                           icon=""
                           name="nome"
                           autoCapitalize="words"
                           type="custom"
                           options={{
                              mask: "***********************************",
                           }}
                           onChangeText={(h) => setNome(h)}
                           value={nome}
                        />
                     </BoxInput>

                     <BoxInput>
                        <TitleHeader style={{ right: 10 }}>E-MAIL</TitleHeader>
                        <InputCasdastro
                           name="email"
                           icon=""
                           autoCapitalize="none"
                           type="custom"
                           keyboardType="email-address"
                           options={{
                              mask: "**************************",
                           }}
                           onChangeText={(h) => setEmail(h)}
                           value={email}
                        />
                     </BoxInput>

                     <BoxInput>
                        <TitleHeader style={{ right: 10 }}>WHATS</TitleHeader>
                        <InputCasdastro
                           name="whats"
                           icon=""
                           type="cel-phone"
                           onChangeText={(mask) => {
                              setWhats(mask);
                           }}
                           value={whats!}
                        />
                     </BoxInput>

                     <BoxInput>
                        <TitleHeader style={{ right: 10 }}>
                           RAZÃO SOCIAL
                        </TitleHeader>
                        <InputCasdastro
                           name="workName"
                           icon=""
                           autoCapitalize="none"
                           type="custom"
                           options={{
                              mask: "********************************************************",
                           }}
                           onChangeText={(h) => setWorkName(h)}
                           value={workName!}
                        />
                     </BoxInput>
                  </BoxFormularios>

                  <BoxFormularios>
                     <BoxInput>
                        <TitleHeader style={{ right: 10 }}>CPF</TitleHeader>
                        <InputCasdastro
                           name="cpf"
                           icon=""
                           type="cpf"
                           onChangeText={(h) => setCpf(h)}
                           value={String(CPF)}
                        />
                     </BoxInput>

                     <BoxInput>
                        <TitleHeader style={{ right: 10 }}>CNPJ</TitleHeader>
                        <InputCasdastro
                           type="cnpj"
                           name="cnpj"
                           icon=""
                           onChangeText={(h) => setCnpj(h)}
                           value={String(cnpj)}
                        />
                     </BoxInput>

                     <View
                        style={{
                           alignSelf: "flex-start",
                           marginLeft: 20,
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
                           alignSelf: "flex-start",
                           marginLeft: 20,
                           marginTop: 20,
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
                  </BoxFormularios>

                  <BoxFormularios>
                     <TitleHeader>LINK SITE</TitleHeader>
                     <Input
                        value={linkSite}
                        onChangeText={(h) => setLinkSite(h)}
                        name="whatLind"
                        icon=""
                     />

                     <TitleHeader>LINK FACE</TitleHeader>
                     <Input
                        value={linkF}
                        onChangeText={(h) => setLinkF(h)}
                        name="linkFace"
                        icon=""
                     />

                     <TitleHeader>LINK INSTA</TitleHeader>
                     <Input
                        value={linkI}
                        onChangeText={(h) => setLinkI(h)}
                        name="linkInsta"
                        icon=""
                     />

                     <TitleHeader>LINK ENDEREÇO</TitleHeader>
                     <Input
                        value={linkMaps}
                        onChangeText={(h) => setLinkMaps(h)}
                        name="linkMap"
                        icon=""
                     />
                  </BoxFormularios>
               </Form>

               <View
                  style={{
                     flexDirection: "row",
                  }}
               >
                  <BoxLogo>
                     <TitleButton style={{ textAlign: "center" }}>
                        LOGO EMPRESA
                     </TitleButton>
                     <LogoImage source={{ uri: logoUrl }} />
                  </BoxLogo>
                  <TouchableOpacity
                     onPress={handleLogo}
                     style={{ top: RFPercentage(10), marginLeft: 20 }}
                  >
                     <TitleHeader>ALTERAR LOGO</TitleHeader>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </View>
         <BoxButton onPress={handleSubmit}>
            <TitleButton>Alterar</TitleButton>
         </BoxButton>
      </Container>
   );
}
