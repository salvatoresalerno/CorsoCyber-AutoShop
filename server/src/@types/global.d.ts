import { Request } from 'express';
import type { Files } from 'formidable';

export type CustomPayload = {
  id: string;
  role: string;
  username: string;
  email: string;
}



declare global {
  namespace Express {
    interface Request {      
      payload?: CustomPayload
      files?: Files; //per i file da fare upload
    }
  }
}


export {};