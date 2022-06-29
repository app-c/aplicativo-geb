import React from 'react';
import { Text, Box, HStack, Image, Center } from 'native-base';

interface Props {
   nome: string;
   avatar: string;
   qnt: number;
}

export function CardsPresença({ nome, avatar, qnt }: Props) {
   return (
      <Box bg="dark.700" p="4" mt="2">
         <HStack justifyContent="space-between">
            <Image
               bg="red.500"
               w="10"
               h="10"
               source={{ uri: avatar }}
               alt="image"
               size="md"
               borderRadius="8"
            />
            <Text fontSize="xl">{nome}</Text>
            <Center borderRadius="8" w="10" h="10" bg="blue.900">
               <Text fontSize="xl" color="#fff">
                  {qnt}
               </Text>
            </Center>
         </HStack>
      </Box>
   );
}
