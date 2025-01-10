
import { Request, Response } from  'express';
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

export const setProfilo = async (req: Request, res: Response) => {
    try {
  
        const {id, nome, cognome, cellulare, telefono, citta, via, cap, provincia  } = req.body;
  
        const query = `UPDATE profiles SET 
                nome = ?, cognome = ?, cellulare = ?, telefono = ?, citta = ?, via = ?, cap = ?, provincia = ?
                WHERE id = ?`;
                 
        const values = [nome, cognome, cellulare, telefono, citta, via, cap, provincia, id];

        await poolConnection.execute(query, values);       
        
        res.status(200).json({
            error: null,
            message: id ? 'Profilo aggiornato con successo' : 'Profilo aggiornato con successo'
        });
    } catch (error) {
        console.error('Errore in aggiornamento profilo:', error);
        res.status(500).json({
            error: 'Errore imprevisto in aggiornamento profilo',
            message: null
        });
    }
};
export const setProfilo2 = async (req: Request, res: Response) => {
    try {
        const id = req.body.id?.[0];
        const nome = req.body.nome?.[0];
        const cognome = req.body.cognome?.[0];
        const cellulare = req.body.cellulare?.[0];        
        const telefono = req.body.telefono?.[0];
        const citta = req.body.citta?.[0];
        const via = req.body.via?.[0];
        const cap = req.body.cap?.[0];
        const provincia = req.body.provincia?.[0];
        const avatar = req.body.image?.[0];  //parametro esistente solo quando salvo profilo con avatar esistente

        const imageFile = req.files?.image;

        console.log('imageFile: ', imageFile)
        const imagePath = imageFile?.relativePath || '';
        const img = imagePath ? imagePath : avatar ? avatar : null;


        //const {id, nome, cognome, cellulare, telefono, citta, via, cap, provincia  } = req.body;
  
        const query = `UPDATE profiles SET 
                nome = ?, cognome = ?, cellulare = ?, telefono = ?, citta = ?, via = ?, cap = ?, provincia = ?, image = ?
                WHERE id = ?`;
                 
        const values = [nome, cognome, cellulare, telefono, citta, via, cap, provincia, img, id];

        console.log('parametri: ', values)

        await poolConnection.execute(query, values);       
        
        res.status(200).json({
            error: null,
            message: id ? 'Profilo aggiornato con successo' : 'Profilo aggiornato con successo'
        });
    } catch (error) {
        console.error('Errore in aggiornamento profilo:', error);
        res.status(500).json({
            error: 'Errore imprevisto in aggiornamento profilo',
            message: null
        });
    }
};

export const getProfiloImage = async (req: Request, res: Response): Promise<void>  => {

    const username = req.params.username
    try {
        const query = "SELECT image FROM profiles WHERE username = ?";
            
        const values = [username];
        const [result] = await poolConnection.execute(query, values);
        
        res.status(201).json({
            data: result,
            error: null
        }); 

    } catch (error) {
        console.log('errori: ', error);
        res.status(500).json({
            data: null,
            error: "Errore durante il recupero dell'avatar."
        });     
    }  
}