import { Valide } from '../pages/ValidePresenca';
import { Profile } from '../pages/Profile';
import { Consumo } from '../pages/Consumo';
import { Indicacoes } from '../pages/Indicacoes';
import { FindUser } from '../pages/FindMembro';
import { Inativo } from '../pages/ADM/Inativo';
import { Ranking } from '../pages/ADM/Classificacao';
import { SingUp } from '../pages/ADM/CreateUser';
import { UpdateSenhaUser } from '../pages/ADM/UpdateSenhaUser';
import { DeletUser } from '../pages/ADM/DeleteUser';
import { TabBarApp } from '../routes/TabBarApp';
import { StacKMembros } from '../routes/StackMembros';
import { StackB2b } from '../routes/StackB2b';
import theme from '../global/styles/theme';
import { Padrinho } from '../pages/Padrinho';
import { ListaPresença } from '../pages/ADM/ListaPresensa';
import { ListPresenca } from '../pages/ADM/ValidatePresenca';

export const rotas = [
   {
      focus: theme.colors.focus_second,
      color: theme.colors.focus_second_3,
      name: 'POSTS',
      component: TabBarApp,
      icon: 'camera-retro',
   },
   {
      focus: theme.colors.focus_second,
      color: theme.colors.focus_second_3,
      name: 'PERFIL',
      component: Profile,
      icon: 'user-circle-o',
   },
   {
      focus: theme.colors.focus_second,
      color: theme.colors.focus_second_3,
      name: 'LOCALIZE OS MEMBROS',
      component: FindUser,
      icon: 'map-marker',
   },
   {
      focus: theme.colors.focus_second,
      color: theme.colors.focus_second_3,
      name: 'EXTRATO',
      component: Consumo,
      icon: 'line-chart',
   },
   {
      focus: theme.colors.focus,
      color: theme.colors.focus_light_3,
      name: 'VALIDE SUA PRESENÇA',
      component: Valide,
      icon: 'hand-peace-o',
   },
   {
      focus: theme.colors.focus,
      color: theme.colors.focus_light_3,
      name: 'LANÇAR CONSUMO',
      component: StacKMembros,
      icon: 'handshake-o',
   },
   {
      focus: theme.colors.focus,
      color: theme.colors.focus_light_3,
      name: 'INDICAÇÕES',
      component: Indicacoes,
      icon: 'exchange',
   },
   {
      focus: theme.colors.focus,
      color: theme.colors.focus_light_3,
      name: 'B2B',
      component: StackB2b,
      icon: 'users',
   },
   {
      focus: theme.colors.focus,
      color: theme.colors.focus_light_3,
      name: 'APADRINHAMENTO',
      component: Padrinho,
      icon: 'mortar-board',
   },
];

export const rotasAdm = [
   {
      color: theme.colors.secundary,
      name: 'RANKING',
      component: Ranking,
      icon: '',
   },
   {
      color: theme.colors.secundary,
      name: 'CADASTRAR MEMBRO',
      component: SingUp,
      icon: '',
   },
   {
      color: theme.colors.secundary,
      name: 'CONFIRMAR PRESENÇA DOS MEMBROS',
      component: ListPresenca,
      icon: '',
   },
   // {
   //    color: theme.colors.secundary,
   //    name: 'ALTERAR SENHA DE UM MEMBRO',
   //    component: UpdateSenhaUser,
   //    icon: '',
   // },
   {
      color: theme.colors.secundary,
      name: 'EXCLUIR UM MEMBRO',
      component: DeletUser,
      icon: '',
   },
   {
      color: theme.colors.secundary,
      name: 'INATIVAR UM MEMBRO',
      component: Inativo,
      icon: '',
   },
   {
      color: theme.colors.secundary,
      name: 'LISTA DE PRESENÇA',
      component: ListaPresença,
      icon: '',
   },
];
