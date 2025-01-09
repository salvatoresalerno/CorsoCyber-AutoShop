

import { Request, Response, NextFunction } from  'express';
import {  validationResult, ValidationError } from 'express-validator';


export const validateReq  = (req: Request, res: Response, next: NextFunction): void => {  //valida senza notificare dettagli errori
    const errors = validationResult(req); 


    console.log('richiedente validateReq: ', req.originalUrl)
    console.log('parametri body: ', req.body)
    console.log('validation error: ', errors)
    
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

    console.log('erroriX: ', errors)
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return
    }
     
    next();
}



