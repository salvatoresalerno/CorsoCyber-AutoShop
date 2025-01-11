import { Request, Response } from  'express';

import { poolConnection } from '../index';
import { Ruolo, User } from '../types/types';
import { findUserForChangeRole } from '../services/user.service';

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

export const setBanned = async (req: Request, res: Response): Promise<void>  => {

    const { id, banned } = req.body;

    console.log('BANNED Body: ',banned )

    try {
        const query = `UPDATE users SET banned = ? WHERE id = ?`;
            
        const values = [banned, id];
        await poolConnection.execute(query, values);
        
        res.status(200).json({
            message: "Banned aggiornato con successo",
            error: null
        }); 

    } catch (error) {
        console.log('errori: ', error);
        res.status(500).json({
            message: null,
            error: 'Errore durante aggiornamento stato Banned.'
        });     
    } 
}


/* export const changeRole = async (req: Request, res: Response): Promise<void>  => {

    const { username } = req.body;

    try {

        const id = await findUserForChangeRole(username);

        console.log('ID per admin: ', id)

        if (id === null) {         
            res.status(200).json({ 
                errors:  'Errore Imprevisto, riprovare più tardi',
                message: null
            });          
            return;         
        }

        const query = "UPDATE user_roles SET role = ? WHERE user_id = ?;";
            
        const values = [Ruolo.ADMIN, id];
        const [rows] = await poolConnection.execute(query, values);
        console.log('Connected to database: ', rows);
        res.status(200).json({
            message: "Ruolo aggiornato con successo",
            error: null
        }); 

        //console.log('res dopo update role: ', res)

    } catch (error) {
        console.log('errori: ', error);
        res.status(500).json({
            message: null,
            error: 'Errore durante aggiornamento Ruolo.'
        });     
    } 
} */