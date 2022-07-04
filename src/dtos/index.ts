/* eslint-disable camelcase */
export interface IUserDto {
   id: string;
   nome: string;
   workName: string;
   adm: boolean;
   ramo: string;
   email: string;
   enquadramento: string;
   indicacao: number;
   whats: string;
   links: {
      site: string;
      maps: string;
      insta: string;
      face: string;
   };
   presenca: {
      avatar: string;
      createdAt: string;
      nome: string;
      presenca: boolean;
      user_id: string;
   }[];
   CPF: string;
   CNPJ: string;
   padrinhQuantity: number;
   avatarUrl: string;
   logoUrl: string;
   inativo: boolean;
   token: string;
   apadrinhado: boolean;
}

export interface ITransaction {
   prestador_id?: string;
   consumidor?: string;
   descricao: string;
   type: 'entrada' | 'saida';
   valor;
   createdAt: string;
}

export interface IOrderB2b {
   prestador_id: string;
   user_id: string;
   data: string;
   description: string;
}

export interface IOrderTransaction {
   prestador_id?: string;
   consumidor?: string;
   valor: string;
   description: string;
   nome: string;
   data: string;
}

export interface IOrderIndication {
   userId: string;
   quemIndicou: string;
   quemIndicouName: string;
   quemIndicouWorkName: string;
   nomeCliente: string;
   telefoneCliente: string;
   descricao: string;
   createdAt?: string;
}
