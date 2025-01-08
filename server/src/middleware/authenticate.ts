
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../services/jwt.service';
import { CustomPayload } from '../@types/global';


export const authenticate = async (req: Request, res: Response, next: NextFunction) : Promise<void>=> {   
    
    console.log('richiedente authenticate: ', req.originalUrl)
    console.log('req.body in auth: ', req.body)
    

    const token = req.cookies.token;

    if (!token) {
        res.status(400).json({ error: 'Token mancante nel cookie.' });
        return
    }

    const { payload, error } =   await verifyJWT(token);    

    if (error) {
        if (error === 'JWTExpired') {
            res.status(401).json({ 
                payload,
                error: 'Token scaduto. Esegui il rinnovo.' 
            });
        } else {
            res.status(400).json({ error: 'Token non valido.', data: null });
        }
        return;
    }

    //console.log('faccio passare ed aggiungo payload all req.', payload)

    req.payload = payload as CustomPayload;   //tutto ok e invio il payload  
    next();
}