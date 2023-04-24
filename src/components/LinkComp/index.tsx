import React, { useState } from 'react';
import { Form } from '@unform/mobile';
import { Zocial } from '@expo/vector-icons';
import { Alert } from 'react-native';
import * as S from './styles';
import { Input } from '../Inputs';
import { Button } from '../Button';
import { api } from '../../services/api';

type props = 'facebook' | 'instagram' | 'weibo';

interface IProps {
   closed: (item: boolean) => void;
}

export function LinkComp({ closed }: IProps) {
   const [selec, setSelect] = useState<props>();
   const [link, setLink] = React.useState('');

   const handleSubmit = React.useCallback(async () => {
      try {
         await api
            .post('/links/create-links', {
               nome: selec,
               link,
            })
            .then(() => {
               Alert.alert('Link adicionado');
               closed(false);
            });
      } catch (err) {
         const res = 'Você já tem esse link';
         if (err.response.data.message === res) {
            return Alert.alert(`Erro', 'Você já tem um link de ${selec}`);
         }
         Alert.alert('Erro', 'Tente mais tarde');
      }
   }, [closed, link, selec]);

   return (
      <S.Container onPress={() => closed(false)}>
         <S.contemt>
            <S.title>Qual link você deseja adicionar?</S.title>

            <S.boxSelect>
               <S.boxIco
                  onPress={() => setSelect('facebook')}
                  selected={selec === 'facebook'}
               >
                  <Zocial name="facebook" />
                  <S.subT>Facebook</S.subT>
               </S.boxIco>

               <S.boxIco
                  onPress={() => setSelect('instagram')}
                  selected={selec === 'instagram'}
               >
                  <Zocial name="instagram" />
                  <S.subT>Instagram</S.subT>
               </S.boxIco>

               <S.boxIco
                  onPress={() => setSelect('weibo')}
                  selected={selec === 'weibo'}
               >
                  <Zocial name="weibo" />
                  <S.subT>Web</S.subT>
               </S.boxIco>
            </S.boxSelect>
            <Form>
               <S.subT>Cole o link aqui</S.subT>
               <Input
                  onChangeText={setLink}
                  value={link}
                  placeholder="Cole o link aqui"
                  name="name"
               />
            </Form>

            <Button pres={handleSubmit} title="SALVAR" />
         </S.contemt>
      </S.Container>
   );
}
