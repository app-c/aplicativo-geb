/* eslint-disable camelcase */
export interface IUserDtos {
   id?: string;
   nome: string;
   membro: string;
   senha: string;
   adm: boolean;
   token?: string;

   //! ! FK_USERS
   situation?: ISituationUser;
   profile?: IProfileDto;
   links?: ILinkDto;
   region?: IRegion;
   Stars?: IStars[];
}

export interface ISituationUser {
   id?: string;
   inativo: boolean;
   firstLogin: boolean;
   apadrinhado: boolean;
   fk_id_user?: string;
}

export interface IProfileDto {
   fk_id_user: string;
   // fk_id_post?: string;
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

export interface IRegion {
   id?: string;
   city: string;
   fk_id_user?: string;
}

export interface IPresencaDto {
   id?: string;
   nome: string;
   user_id: string;
   presenca?: boolean;
   createdAt?: Date;
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
   created_at?: Date;
   date?: string;
   valorFormated: string;
}

export interface IB2b {
   send_id: string;
   send_name: string;
   recevid_name: string;
   recevid_id: string;
   appointment: string;
   assunto: string;
   createdAt?: Date;
   validate?: boolean;
   id?: string;
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

export interface IPostsDtos {
   id?: string;
   image: string;
   fk_id_user: string;
   description: string;
   like?: ILikeDto[];
   profile?: IProfileDto;
   user?: IUserDtos;
   created_at?: Date;
   date?: number;
}

export interface ILikeDto {
   id?: string;
   like: number;
   fk_id_post: string;
}

export interface IStars {
   id: string;
   fk_id_user: string;
   star: number;
   valiador: string;
}
