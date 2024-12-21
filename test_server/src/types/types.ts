export type User = {
    id: string;
    username: string;
    email: string;
    //password: string;
    role: string;
}

export type UserRefresh = {
    refresh_token: string;
    refresh_token_exp: Date;
}


export enum Ruolo {
    USER = "USER",
    ADMIN = "ADMIN"
}

//export type GetUser = Omit<User, "password">

export enum Stato {
    VENDUTO = "VENDUTO",
    VENDESI = "VENDESI",
    TUTTI = "TUTTI"
}

export enum TipoVeicolo {
    AUTO = "AUTO",
    MOTO = "MOTO"
}
export enum Alimentazione {
    DIESEL = "DIESEL",
    BENZINA = "BENZINA",
    IBRIDO = "IBRIDO",
    ELETTRICO = "ELETTRICO",
}

export type Veicolo = {
    brand: string,
    modello: string,
    tipo: TipoVeicolo,
    anno: number,
    kilometri: number,
    alimentazione: Alimentazione,
    prezzo: number,
    stato: Stato,
    image: string,
}

export type DataResult = {
    data: Veicolo[] | null;
    error: string | null;
}

type Range = {
    valueA: number;
    valueB: number;
};

export type VeicoloParams = {
    tipo: string;
    brand: string;
    model: string;
    alim: string;
    anno: number;
    km: Range;
    prezzo: Range;
  };


/* export type UserLogin = {
    username: string;
    email: string;
    refreshToken: string;
} */


   
    

    