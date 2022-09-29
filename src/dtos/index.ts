/* eslint-disable camelcase */
export interface IUserDtos {
   id?: string;
   nome: string;
   membro: string;
   senha: string;
   adm: boolean;
   token?: string;
}

export interface IProfileDto {
   user_id: string;
   whats: string;
   workName: string;
   CNPJ: string;
   CPF: string;
   ramo: string;
   enquadramento: string;
   email: string;
   insta?: string;
   web?: string;
   face?: string;
   whatsApp?: string;
   logo?: string;
   avatar?: string;
}

export interface IPresencaDto {
   id?: string;
   nome: string;
   user_id: string;
   presenca?: boolean;
   createdAt?: Date;
   data?: string;
}

export interface IOrderTransaction {
   id?: string;
   consumidor_name: string;
   prestador_name: string;
   consumidor_id: string;

   prestador_id: string;
   valor: number;
   descricao: string;
   createdAt?: Date;
}

export interface ITransaction {
   id?: string;
   consumidor_name?: string;
   prestador_name?: string;
   consumidor_id?: string;

   prestador_id?: string;
   valor: number;
   descricao: string;
   createdAt?: Date;
}

export interface IB2b {
   id: string;
   send_id: string;
   send_name: string;
   recevid_name: string;
   recevid_id: string;
   appointment: string;
   assunto: string;
   createdAt?: Date;
   validate?: boolean;
}

export interface IIndicationDto {
   id?: string;
   indicado_id: string;
   indicado_name: string;
   quemIndicou_id: string;
   quemIndicou_name: string;
   client_name: string;
   phone_number_client: number;
   description: string;
   validate?: boolean;
}

export interface ILinkDto {
   id?: string;
   user_id: string;
   nome: string;
   link: string;
}
