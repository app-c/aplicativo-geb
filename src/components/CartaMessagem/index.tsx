import React from 'react';
import { Text, Box, Center } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import theme from '../../global/styles/theme';

interface Props {
   pres: () => void;
   quantity: number;
}

export function CartaMessagem({ pres, quantity }: Props) {
   return (
      <Box>
         <TouchableOpacity onPress={pres}>
            <Center
               top="1"
               bg={theme.colors.focus_second}
               borderRadius="30"
               size="5"
            >
               <Text
                  fontFamily={theme.fonts.OpenBold}
                  color={theme.colors.text_secundary}
               >
                  {quantity}
               </Text>
            </Center>
            <MaterialCommunityIcons
               color={theme.colors.focus}
               size={40}
               name="email-outline"
            />
         </TouchableOpacity>
      </Box>
   );
}
