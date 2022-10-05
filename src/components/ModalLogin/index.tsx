import React from 'react';
import { Box, Center, Input, Text } from 'native-base';
import { Modal } from 'react-native';
import theme from '../../global/styles/theme';

interface Props {
   visible: boolean;
}

export function ModalLogin({ visible }: Props) {
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');

   return (
      <Modal visible={visible}>
         <Box p="5">
            <Center>
               <Box w="200" h="100" bg={theme.colors.focus_light}>
                  <Text>
                     Entre com sua conta para carregarmos seus dados no novo
                     servidor
                  </Text>
               </Box>

               <Input
                  keyboardType="email-address"
                  placeholder="E-mail"
                  onChangeText={setEmail}
               />

               <Input secureTextEntry onChangeText={setPassword} />
            </Center>
         </Box>
      </Modal>
   );
}
