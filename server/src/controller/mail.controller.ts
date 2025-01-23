import { Request, Response } from  'express';

import dotenv from "dotenv";
import { sendEmail } from '../middleware/mail.utils';

dotenv.config();


 

export const sendInfo = async (req: Request, res: Response): Promise<void> => {

    const { nome, email, telefono, messaggio } = req.body;   

    const text = `<p>Il sig. <strong>${nome}</strong> ha richiesto informazioni.</p>
                  <br />
                  <p ><strong>Contatti:</strong></p>
                  <ul>
                  <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                  <li><strong>Telefono:</strong> ${telefono}</li>
                  </ul> 
                  <br />
                  <p><strong>Messaggio</strong></p>
                  <p>${messaggio}</p>`;   

    const sender = {
        name: 'Auto Shop srl - Store OnLine',
        address: 'no-reply@auto-shop.com'
    }

    const receipients = [{
        name: 'Informazioni Store',
        address: 'info@auto-shop.com'
    }]

    try {
        const result = await sendEmail({            
            sender,
            receipients ,
            subject: 'Richiesta Informazioni',
            message: text
        });
        
        res.status(200).json({
            accepted: result.accepted
        }); 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Impossibile inviare Mail'
        });
    }
}  


export const sendOrder = async (req: Request, res: Response): Promise<void> => {

    const { username, brand, modello, anno, alimentazione } = req.body; 
 
    const  text = `<p>Il sig. <strong>${username}</strong> ha effettuato un nuovo ordine.</p>
                   <p>Veicolo ordinato: ${brand} ${modello}</p>
                   <p>immatricolazione: ${anno}</p>
                   <p>Alimentazione: ${alimentazione}</p>`;     

    const sender = {
        name: 'Auto Shop srl - Store OnLine',
        address: 'no-reply@auto-shop.com'
    }

    const receipients = [{
        name: 'Gestione Ordini',
        address: 'ordini@auto-shop.com'
    }]

    try {
        const result = await sendEmail({            
            sender,
            receipients ,
            subject: 'Nuovo Ordine',
            message: text
        })

        res.status(200).json({
            accepted: result.accepted
        }); 
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Impossibile inviare Mail'
        });
    } 

}