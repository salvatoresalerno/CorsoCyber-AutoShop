import { Request } from 'express';
import type { Files } from 'formidable';

export type CustomPayload = {
  id: string;
  role: string;
  username: string;
  email: string;
}


type UploadedFile = formidable.File & { relativePath?: string };  //aggiunta props relativePath per path relativa


declare global {
  namespace Express {
    interface Request {      
      payload?: CustomPayload
      files?: Files | UploadedFile | undefined; //per i file da fare upload
    }
  }
}


export {};