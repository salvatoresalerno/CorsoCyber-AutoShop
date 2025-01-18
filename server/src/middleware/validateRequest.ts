

import { Request, Response, NextFunction } from  'express';
import {  validationResult } from 'express-validator';


export const validateReq  = (req: Request, res: Response, next: NextFunction): void => {  //valida senza notificare dettagli errori
    const errors = validationResult(req); 

    //console.log('errori: ', errors);
    
    if (!errors.isEmpty()) {
        res.status(400).json({ 
            message: "", 
            error:  'Dati non validi!'
        });
        return;
    }   
     
    next();
}


export const validateReqWithFields  = (req: Request, res: Response, next: NextFunction): void => { //valida e notifica dettagli errori
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return
    }
     
    next();
}



