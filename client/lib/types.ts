 


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
    ADMIN = "ADMIN"
}

export type User = {
    id: string;
    username: string;
    email: string;
    role: string;
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







