import { Request, Response } from  'express';

import { poolConnection } from '../index';
import { User } from '../types/types';

type ExtendedUser = User & {
    created_at: Date;
    last_sign_in_at: Date;
    banned: boolean;
}

export const getUsers = async (req: Request, res: Response): Promise<void>  => {

    
    try {
        const query = `SELECT u.id, u.username, u.email, u.created_at, u.last_sign_in_at, u.banned, r.role
            FROM users u JOIN user_roles r 
            ON u.id = r.user_id
            ORDER BY u.username ASC;`;
            
         
        const [result] = await poolConnection.execute(query);
        
        res.status(201).json({
            data: result as ExtendedUser[],
            error: null
        }); 

    } catch (error) {
        console.log('errori: ', error);
        res.status(500).json({
            data: null,
            error: 'Errore durante il recupero lista utenti.'
        });     
    }  
}