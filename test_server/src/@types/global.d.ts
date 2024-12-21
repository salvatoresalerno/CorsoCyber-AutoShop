import { Request } from 'express';

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
    }
  }
}


export {};