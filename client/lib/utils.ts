
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//formatta numeri con punti decimali
export const formatNumber = (number: number) => {

  return new Intl.NumberFormat('it-IT').format(number);    
}

//formatta numeri euro
export const formatEuro = (number: number) => {

  return new Intl.NumberFormat('it-IT', {    
    minimumFractionDigits: 2,  
    maximumFractionDigits: 2   
  }).format(number);    
}


export enum Format {
  SHORT = "SHORT",
  LONG = "LONG"
}

type FormatDateProps = {
  date: Date;
  onlyDate?: boolean;
  format?: Format;
  withDay?: boolean;
}
//formattazione data
export const formatDate = (date: Date, onlyDate: boolean = false, format:string = Format.SHORT, withDay:boolean = false): string => {

  let dateFormatter;

  if (format === Format.LONG) {
    dateFormatter = new Intl.DateTimeFormat('it-IT', {
      weekday: withDay ? 'long' : undefined,
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } else {
    dateFormatter = new Intl.DateTimeFormat('it-IT', {
      weekday: withDay ? 'short' : undefined,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
/* export const formatDate = ({date, onlyDate = false, format = Format.SHORT, withDay=false}:FormatDateProps): string => {

  let dateFormatter;

  if (format === Format.LONG) {
    dateFormatter = new Intl.DateTimeFormat('it-IT', {
      weekday: withDay ? 'long' : undefined,
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } else {
    dateFormatter = new Intl.DateTimeFormat('it-IT', {
      weekday: withDay ? 'short' : undefined,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } */
  
    
 
  
  const timeFormatter = new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
  });
  
  // Formatta la data e l'ora separatamente
  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);


  if (onlyDate) {
      return formattedDate;
  }
  
  return `${formattedDate} ${formattedTime}`;
};

export function escapeHtml(unsafe: string): string {
  return unsafe
      .replace(/&/g, "&amp;")    // '&' --> '&amp;'
      .replace(/</g, "&lt;")     // '<' --> '&lt;'
      .replace(/>/g, "&gt;")     // '>' --> '&gt;'
      .replace(/"/g, "&quot;")   // '"' --> '&quot;'
      .replace(/'/g, "&#39;")
      .replace(/\//g, "&#x2F;");   // "'" --> '&#39;'
}

export function decodeEscapedHtml(encodedString: string): string {
  return encodedString
    .replace(/&amp;/g, "&")      // '&amp;' --> '&'
    .replace(/&lt;/g, "<")       // '&lt;' --> '<'
    .replace(/&gt;/g, ">")       // '&gt;' --> '>'
    .replace(/&quot;/g, '"')     // '&quot;' --> '"'
    .replace(/&#39;/g, "'")      // '&#39;' --> "'"
    .replace(/&#x2F;/g, "/");    // '&#x2F;' --> '/'
} 




