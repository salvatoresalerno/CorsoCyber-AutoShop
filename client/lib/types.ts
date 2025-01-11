 


export type Range = {
    valueA: number,
    valueB: number
}

export type FilterParams = {
    tipo: string; 
    brand: string; 
    model?: string; 
    alim?: string; 
    anno?: number | string; 
    km?: Range; 
    prezzo?: Range;
}

export type VeicoloWithImg = Veicolo & {
    urlImg: string;
}

export type VeicoliSuggeriti = {
    veicoli: VeicoloWithImg[];
    suggerito: boolean;
}

export type ResponseResult = {
    message: string;
    error: string;
}

export enum Ruolo {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}

export type User = {
    id: string;
    username: string;
    email: string;
    role: string;
}

export type ExtendedUser = User & {
    created_at: Date;
    last_sign_in_at: Date;
    banned: number;
}

export type UserResult = {
    user: User | null;
    error: string | null;
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
export enum Stato {
    VENDUTO = "VENDUTO",
    VENDESI = "VENDESI",
    TUTTI = "TUTTI"
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

export type DataFilterResult = DataResult & { suggerito: boolean;}

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

export type UserDataResult = {
    data: Profilo | null;
    error: string | null;
}






