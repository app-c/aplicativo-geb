import { Form } from "@unform/mobile";
import React from "react";
import { View } from "react-native";
import { InputCasdastro } from "../InputsCadastro";
import { Container, Title } from "./styles";

export function CreateUser() {
  return (
    <>
      <Container>
        <Form>
          <View>
            <Title>Nome completo</Title>
            <InputCasdastro
              name="nome"
              type="custom"
              options={{ mask: "******************" }}
              icon="user"
            />
          </View>

          <View>
            <Title>email</Title>
            <InputCasdastro
              name="nome"
              type="custom"
              options={{ mask: "******************" }}
              icon="user"
            />
          </View>

          <View>
            <Title>whatts App</Title>
            <InputCasdastro name="nome" type="cel-phone" icon="user" />
          </View>

          <View>
            <Title>senha</Title>
            <InputCasdastro
              name="nome"
              type="custom"
              options={{ mask: "******************" }}
              icon="user"
            />
          </View>
        </Form>
      </Container>
    </>
  );
}
