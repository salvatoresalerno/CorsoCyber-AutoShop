export type User = {
    id: string;
    username: string;
    email: string;
    role: string;
}

export type UserRefresh = {
    refresh_token: string;
    refresh_token_exp: Date;
}


export enum Ruolo {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
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
    id?: string;
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

export type Profilo = {
    id: string;
    email: string;
    username: string;
    nome: string;
    cognome: string;
    image: string;
    cellulare: string;
    telefono: string;
    citta: string;
    via: string;
    cap: string;
    provincia: string;    
}


/* export type UserLogin = {
    username: string;
    email: string;
    refreshToken: string;
} */


   
    

    