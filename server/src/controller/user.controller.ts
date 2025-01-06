
import { Request, Response, NextFunction } from  'express';
import { poolConnection } from '../index';
import { Profilo } from '../types/types';


export const getProfilo = async (req: Request, res: Response): Promise<void>  => {

    const username = req.params.username
    try {
        const query = "SELECT * FROM profiles WHERE username = ?";
            
        const values = [username];
        const [result] = await poolConnection.execute(query, values);
        
        res.status(201).json({
            data: (result as Profilo[])[0] ?? {},
            error: null
        }); 

    } catch (error) {
        console.log('errori: ', error);
        res.status(500).json({
            data: null,
            error: 'Errore durante il recupero del profilo.'
        });     
    }  
}