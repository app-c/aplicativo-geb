/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import storage from "@react-native-firebase/storage";

import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";

import fire from "@react-native-firebase/firestore";
import {
  Box,
  BoxImage,
  BoxInput,
  ButonImage,
  Button,
  Container,
  Image,
  Input,
  TexBoton,
} from "./styled";
import { useAuth } from "../../hooks/AuthContext";
import { Loading } from "../../components/Loading";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { colecao } from "../../collection";

export function Post() {
  const { goBack } = useNavigation();
  const { user } = useAuth();

  const [img, setImage] = useState("");
  const [descricao, setDescricao] = useState("");
  const [load, setLoad] = useState(false);
  const [post, setPost] = useState("");

  const ImagePicker = useCallback(async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (img === "of") {
      Alert.alert("Erro", "Escolha uma imagem para realizar o post");
      return;
    }
    setLoad(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/image/${fileName}.png`);

    await reference.putFile(img);
    const photoUrl = await reference.getDownloadURL();

    fire()
      .collection(colecao.post)
      .add({
        nome: user.nome,
        avater: user.avatarUrl,
        descricao,
        post: photoUrl,
        data: new Date(Date.now()).getTime(),
        like: 0,
      });
    setLoad(false);
    Alert.alert("Post", "post criado com sucesso!");
    goBack();
  }, [descricao, goBack, img, user.avatarUrl, user.nome]);

  return (
    <Container>
      <HeaderContaponent title="Post" type="tipo1" />
      <Box>
        <BoxInput>
          <Input onChangeText={setDescricao} placeholder="Descrição do poste" />
        </BoxInput>

        <ButonImage onPress={ImagePicker}>
          <TexBoton style={{ fontSize: RFValue(16) }}>Escolher image</TexBoton>
        </ButonImage>

        <BoxImage>
          {img !== "" ? (
            <Image resizeMode="contain" source={{ uri: img }} />
          ) : (
            <Feather name="image" size={100} />
          )}
        </BoxImage>

        <Button enabled={!load} onPress={handleSubmit}>
          {load ? <Loading /> : <TexBoton>Criar</TexBoton>}
        </Button>
      </Box>
    </Container>
  );
}
